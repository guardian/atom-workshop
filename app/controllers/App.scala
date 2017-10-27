package controllers

import cats.syntax.either._
import com.gu.contentatom.thrift.EventType
import com.gu.fezziwig.CirceScroogeMacros._
import config.Config
import db.AtomDataStores._
import db.AtomWorkshopDBAPI
import io.circe._
import io.circe.syntax._
import models._
import play.api.Logger
import play.api.libs.ws.WSClient
import play.api.mvc.Controller
import services.AtomPublishers._
import util.AtomElementBuilders
import util.AtomLogic._
import util.AtomUpdateOperations._
import util.Parser._
import util.CORSable
import play.api.mvc.Action

class App(val wsClient: WSClient, val atomWorkshopDB: AtomWorkshopDBAPI) extends Controller with PanDomainAuthActions {

  def allowCORSAccess(methods: String, args: Any*) = CORSable(Config.workflowUrl) {
    Action { implicit req =>
      val requestedHeaders = req.headers("Access-Control-Request-Headers")
      NoContent.withHeaders("Access-Control-Allow-Methods" -> methods, "Access-Control-Allow-Headers" -> requestedHeaders)
    }
  }
  
  def index(placeholder: String) = AuthAction { req =>
    Logger.info(s"I am the ${Config.appName}")
    val clientConfig = ClientConfig(
      user = User(req.user.firstName, req.user.lastName, req.user.email),
      gridUrl = Config.gridUrl,
      composerUrl = Config.composerUrl,
      viewerUrl = Config.viewerUrl,
      capiLiveUrl = Config.capiLiveUrl,
      targetingUrl = Config.targetingUrl,
      isEmbedded = req.queryString.get("embeddedMode").isDefined,
      embeddedMode = req.queryString.get("embeddedMode").map(_.head),
      atomEditorGutoolsDomain = Config.atomEditorGutoolsDomain,
      presenceEnabled = Config.presenceEnabled,
      presenceDomain = Config.presenceDomain
    )

    val jsFileName = "build/app.js"

    val jsLocation = sys.env.get("JS_ASSET_HOST").map(_ + jsFileName)
      .getOrElse(routes.Assets.versioned(jsFileName).toString)

    val presenceJsFile = if(Config.presenceEnabled) {
      Some(s"https://${Config.presenceDomain}/client/1/lib.js")
    } else {
      None
    }

    Ok(views.html.index("Atom Workshop", jsLocation, presenceJsFile, clientConfig.asJson.noSpaces))
  }

  def getAtom(atomType: String, id: String, version: String) = AuthAction {
    APIResponse {
      for {
        atomType <- validateAtomType(atomType)
        ds = getDataStore(getVersion(version))
        atom <- atomWorkshopDB.getAtom(ds, atomType, id)
      } yield atom
    }
  }


  def createAtom(atomType: String) = CORSable(Config.workflowUrl) {
    AuthAction { req =>
      APIResponse{
        for {
          atomType <- validateAtomType(atomType)
          createAtomFields <- extractCreateAtomFields(req.body.asJson.map(_.toString))
          atomToCreate = AtomElementBuilders.buildDefaultAtom(atomType, req.user, createAtomFields)
          atom <- atomWorkshopDB.createAtom(previewDataStore, atomType, req.user, atomToCreate)
          _ <- sendKinesisEvent(atom, previewAtomPublisher, EventType.Update)
        } yield atom
      }
    }
  }

  def publishAtom(atomType: String, id: String) = AuthAction { req =>
    APIResponse {
      for {
        atomType <- validateAtomType(atomType)
        previewDs = getDataStore(Preview)
        currentDraftAtom <- atomWorkshopDB.getAtom(previewDs, atomType, id)
        updatedAtom <- atomWorkshopDB.publishAtom(publishedDataStore, req.user, updateTopLevelFields(currentDraftAtom, req.user, publish=true))
        _ <- atomWorkshopDB.updateAtom(previewDs, updatedAtom)
        _ <- sendKinesisEvent(updatedAtom, liveAtomPublisher, EventType.Update)
        _ <- sendKinesisEvent(updatedAtom, previewAtomPublisher, EventType.Update)
      } yield updatedAtom
    }
  }

  def updateEntireAtom(atomType: String, id: String) = AuthAction { req =>
    APIResponse {
      for {
        atomType <- validateAtomType(atomType)
        payload <- extractRequestBody(req.body.asJson.map(_.toString))
        newAtom <- stringToAtom(payload)
        updatedAtom <- atomWorkshopDB.updateAtom(previewDataStore, updateTopLevelFields(newAtom, req.user))
        _ <- sendKinesisEvent(updatedAtom, previewAtomPublisher, EventType.Update)
      } yield updatedAtom
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
        _ <- sendKinesisEvent(updatedAtom, previewAtomPublisher, EventType.Update)
      } yield updatedAtom
    }
  }

  def deleteAtom(atomType: String, id: String) = AuthAction {
    APIResponse {
      for {
        atomType <- validateAtomType(atomType)
        liveAtom = atomWorkshopDB.getAtom(publishedDataStore, atomType, id)
        _ <- checkAtomCanBeDeletedFromPreview(liveAtom)
        previewDataStore = getDataStore(Preview)
        result <- atomWorkshopDB.deleteAtom(previewDataStore, atomType, id)
        atom <- liveAtom
        _ <- sendKinesisEvent(atom, previewAtomPublisher, EventType.Takedown)
      } yield AtomWorkshopAPIResponse("Atom deleted from preview")
    }
  }

  def takedownAtom(atomType: String, id: String) = AuthAction { req =>
    APIResponse {
      for {
        atomType <- validateAtomType(atomType)
        atom <- atomWorkshopDB.getAtom(publishedDataStore, atomType, id)
        updatedAtom <- atomWorkshopDB.updateAtom(previewDataStore, updateTakenDownChangeRecord(atom, req.user))
        result <- atomWorkshopDB.deleteAtom(publishedDataStore, atomType, id)
        _ <- sendKinesisEvent(updatedAtom, liveAtomPublisher, EventType.Takedown)
        _ <- sendKinesisEvent(updatedAtom, previewAtomPublisher, EventType.Update)
      } yield updatedAtom
    }
  }

}
