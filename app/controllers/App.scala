package controllers

import cats.syntax.either._
import com.gu.contentatom.thrift.{Atom, AtomType, EventType}
import com.gu.fezziwig.CirceScroogeMacros._
import config.Config
import db.{AtomDataStores, AtomWorkshopDBAPI}
import models._
import play.api.Logging
import play.api.mvc._
import util.AtomElementBuilders
import util.AtomLogic._
import util.AtomUpdateOperations._
import util.Parser._
import util.CORSable
import com.gu.pandomainauth.model.{User => PandaUser}
import services.{AtomPublishers, Permissions}
import views.html.helper.CSRF

class App(
           val controllerComponents: ControllerComponents,
           val config: Config,
           val pandaAuthActions: PanDomainAuthActions,
           val atomWorkshopDB: AtomWorkshopDBAPI,
           val atomDataStores: AtomDataStores,
           val atomPublishers: AtomPublishers,
           val permissions: Permissions
         ) extends BaseController with Logging {

  // These are required even though IntelliJ thinks they are not
  import io.circe._
  import io.circe.syntax._

  import pandaAuthActions.AuthAction

  implicit val executionContext = controllerComponents.executionContext

  private val previewDataStore = atomDataStores.getDataStore(Preview)
  private val publishedDataStore = atomDataStores.getDataStore(Live)

  private val previewAtomPublisher = atomPublishers.previewAtomPublisher
  private val liveAtomPublisher = atomPublishers.liveAtomPublisher

  def allowCORSAccess(methods: String, args: Any*) = CORSable(config.workflowUrl) {
    Action { implicit req =>
      val requestedHeaders = req.headers("Access-Control-Request-Headers")
      NoContent.withHeaders("Access-Control-Allow-Methods" -> methods, "Access-Control-Allow-Headers" -> requestedHeaders)
    }
  }

  def index(placeholder: String) = AuthAction { implicit req =>
    logger.info(s"I am the ${config.appName}")

      val clientConfig = ClientConfig(
        user = User(req.user.firstName, req.user.lastName, req.user.email),
        gridUrl = config.gridUrl,
        composerUrl = config.composerUrl,
        viewerUrl = config.viewerUrl,
        capiLiveUrl = config.capiLiveUrl,
        targetingUrl = config.targetingUrl,
        workflowUrl = config.workflowUrl,
        isEmbedded = req.queryString.get("embeddedMode").isDefined,
        embeddedMode = req.queryString.get("embeddedMode").map(_.head),
        atomEditorGutoolsDomain = config.serviceDomain,
        presenceEnabled = config.presenceEnabled,
        presenceDomain = config.presenceDomain,
        permissions.getAll(req.user.email),
        stage = config.stage
      )

      val jsFileName = "build/app.js"

      val jsLocation = sys.env.get("JS_ASSET_HOST").map(_ + jsFileName)
        .getOrElse(routes.Assets.versioned(jsFileName).toString)

      val presenceJsFile = if (config.presenceEnabled) {
        Some(s"https://${config.presenceDomain}/client/1/lib.js")
      } else {
        None
      }

      Ok(views.html.index(
        "Atom Workshop",
        jsLocation,
        presenceJsFile,
        clientConfig.asJson.noSpaces,
        CSRF.getToken.value
      ))
  }

  def getAtom(atomType: String, id: String, version: String) = {
    AuthAction {
      APIResponse {
        for {
          atomType <- validateAtomType(atomType)
          ds = atomDataStores.getDataStore(getVersion(version))
          atom <- atomWorkshopDB.getAtom(ds, atomType, id)
        } yield atom
      }
    }
  }

  def createAtom(atomType: String) = CORSable(config.workflowUrl) {
    AuthAction { req =>
      APIResponse {
        for {
          atomType <- validateAtomType(atomType)
          createAtomFields <- extractCreateAtomFields(req.body.asJson.map(_.toString))
          atomToCreate = AtomElementBuilders.buildDefaultAtom(atomType, req.user, createAtomFields)
          atom <- atomWorkshopDB.createAtom(previewDataStore, atomType, req.user, atomToCreate)
          _ <- atomPublishers.sendKinesisEvent(atom, previewAtomPublisher, EventType.Update)
        } yield atom
      }
    }
  }

  def publishAtom(atomType: String, id: String) = AuthAction { req =>
    APIResponse {
      for {
        atomType <- validateAtomType(atomType)
        previewDs = previewDataStore
        currentDraftAtom <- atomWorkshopDB.getAtom(previewDs, atomType, id)
        updatedAtom <- atomWorkshopDB.publishAtom(publishedDataStore, req.user, updateTopLevelFields(currentDraftAtom, req.user, publish=true))
        _ <- atomWorkshopDB.updateAtom(previewDs, updatedAtom)
        _ <- atomPublishers.sendKinesisEvent(updatedAtom, liveAtomPublisher, EventType.Update)
        _ <- atomPublishers.sendKinesisEvent(updatedAtom, previewAtomPublisher, EventType.Update)
      } yield updatedAtom
    }
  }

  def updateEntireAtom(atomType: String, id: String) = {
    AuthAction { req =>
      APIResponse {
        for {
          atomType <- validateAtomType(atomType)
          payload <- extractRequestBody(req.body.asJson.map(_.toString))
          newAtom <- stringToAtom(payload)
          updatedAtom <- atomWorkshopDB.updateAtom(previewDataStore, updateTopLevelFields(newAtom, req.user))
          _ <- atomPublishers.sendKinesisEvent(updatedAtom, previewAtomPublisher, EventType.Update)
        } yield updatedAtom
      }
    }
  }

  def updateAtomByPath(atomType: String, id: String) = AuthAction { req =>
    APIResponse {
      for {
        atomType <- validateAtomType(atomType)
        payload <- extractRequestBody(req.body.asJson.map(_.toString))
        newJson <- stringToJson(payload)
        currentAtom <- atomWorkshopDB.getAtom(previewDataStore, atomType, id)
        newAtom <- updateAtomFromJson(currentAtom, newJson, req.user)
        updatedAtom <- atomWorkshopDB.updateAtom(previewDataStore, updateTopLevelFields(newAtom, req.user))
        _ <- atomPublishers.sendKinesisEvent(updatedAtom, previewAtomPublisher, EventType.Update)
      } yield updatedAtom
    }
  }

  def deleteAtom(atomType: String, id: String) = AuthAction { req =>
    APIResponse {
      validateAtomType(atomType).flatMap { atomType =>
        atomWorkshopDB.getAtom(publishedDataStore, atomType, id) match {
          case Right(publishedAtom) =>
            for {
              _ <- takedown(atomType, id, req.user)
              _ <- atomWorkshopDB.deleteAtom(previewDataStore, atomType, id)
              _ <- atomPublishers.sendKinesisEvent(publishedAtom, previewAtomPublisher, EventType.Takedown)
            } yield AtomWorkshopAPIResponse(s"Atom $atomType/$id taken down and deleted")

          case Left(UnknownAtomError(_, _)) =>
            atomWorkshopDB.getAtom(previewDataStore, atomType, id).flatMap { unpublishedAtom =>
              for {
                _ <- atomWorkshopDB.deleteAtom(previewDataStore, atomType, id)
                _ <- atomPublishers.sendKinesisEvent(unpublishedAtom, previewAtomPublisher, EventType.Takedown)
              } yield AtomWorkshopAPIResponse(s"Atom $atomType/$id deleted")
            }

          case Left(err) =>
            Left(err)
        }
      }
    }
  }

  def takedownAtom(atomType: String, id: String) = AuthAction { req =>
    APIResponse {
      for {
        atomType <- validateAtomType(atomType)
        result <- takedown(atomType, id, req.user)
      } yield result
    }
  }

  private def takedown(atomType: AtomType, id: String, user: PandaUser): Either[AtomAPIError, Atom] = for {
    atom <- atomWorkshopDB.getAtom(publishedDataStore, atomType, id)
    updatedAtom <- atomWorkshopDB.updateAtom(previewDataStore, updateTakenDownChangeRecord(atom, user))
    result <- atomWorkshopDB.deleteAtom(publishedDataStore, atomType, id)
    _ <- atomPublishers.sendKinesisEvent(updatedAtom, liveAtomPublisher, EventType.Takedown)
    _ <- atomPublishers.sendKinesisEvent(updatedAtom, previewAtomPublisher, EventType.Update)
  } yield updatedAtom
}
