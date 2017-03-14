package controllers

import config.Config
import models._
import play.api.Logger
import play.api.libs.ws.WSClient
import play.api.mvc.Controller
import cats.syntax.either._
import com.gu.contentatom.thrift.EventType
import db.{AtomDataStores, AtomWorkshopDBAPI}
import com.gu.fezziwig.CirceScroogeMacros._
import io.circe.syntax._
import io.circe._
import io.circe.generic.auto._
import util.AtomLogic._
import util.Parser._
import services.AtomPublishers._
import util.AtomElementBuilders
import util.AtomUpdateOperations._

class App(val wsClient: WSClient, val atomWorkshopDB: AtomWorkshopDBAPI) extends Controller with PanDomainAuthActions {

  def index(placeholder: String) = AuthAction { req =>
    Logger.info(s"I am the ${Config.appName}")
    val clientConfig = ClientConfig(
      user = User(req.user.firstName, req.user.lastName, req.user.email),
      gridUrl = Config.gridUrl,
      atomEditorUrls = Config.atomEditorUrls,
      composerUrl = Config.composerUrl,
      viewerUrl = Config.viewerUrl,
      capiLiveUrl = Config.capiLiveUrl,
      presenceEndpointURL = Config.presenceEndpointURL
    )

    val jsFileName = "build/app.js"

    val jsLocation = sys.env.get("JS_ASSET_HOST").map(_ + jsFileName)
      .getOrElse(routes.Assets.versioned(jsFileName).toString)

    Ok(views.html.index("AtomMcAtomFace", jsLocation, clientConfig.asJson.noSpaces))
  }

  def getAtom(atomType: String, id: String, version: String) = AuthAction {
    APIResponse {
      for {
        atomType <- validateAtomType(atomType)
        ds <- AtomDataStores.getDataStore(atomType, getVersion(version))
        atom <- atomWorkshopDB.getAtom(ds, atomType, id)
      } yield atom
    }
  }

  def createAtom(atomType: String) = AuthAction { req =>
    APIResponse{
      for {
        atomType <- validateAtomType(atomType)
        createAtomFields <- extractCreateAtomFields(req.body.asJson.map(_.toString))
        ds <- AtomDataStores.getDataStore(atomType, Preview)
        atomToCreate = AtomElementBuilders.buildDefaultAtom(atomType, req.user, createAtomFields)
        atom <- atomWorkshopDB.createAtom(ds, atomType, req.user, atomToCreate)
        _ <- sendKinesisEvent(atom, previewAtomPublisher, EventType.Update)
      } yield atom
    }
  }

  def publishAtom(atomType: String, id: String) = AuthAction { req =>
    APIResponse {
      for {
        atomType <- validateAtomType(atomType)
        previewDs <- AtomDataStores.getDataStore(atomType, Preview)
        liveDs <- AtomDataStores.getDataStore(atomType, Live)
        currentDraftAtom <- atomWorkshopDB.getAtom(previewDs, atomType, id)
        updatedAtom <- atomWorkshopDB.publishAtom(liveDs, req.user, updateTopLevelFields(currentDraftAtom, req.user, publish=true))
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
        datastore <- AtomDataStores.getDataStore(atomType, Preview)
        updatedAtom <- atomWorkshopDB.updateAtom(datastore, updateTopLevelFields(newAtom, req.user))
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
        datastore <- AtomDataStores.getDataStore(atomType, Preview)
        currentAtom <- atomWorkshopDB.getAtom(datastore, atomType, id)
        newAtom <- updateAtomFromJson(currentAtom, newJson, req.user)
        updatedAtom <- atomWorkshopDB.updateAtom(datastore, updateTopLevelFields(newAtom, req.user))
        _ <- sendKinesisEvent(updatedAtom, previewAtomPublisher, EventType.Update)
      } yield updatedAtom
    }
  }

  def deleteAtom(atomType: String, id: String) = AuthAction {
    APIResponse {
      for {
        atomType <- validateAtomType(atomType)
        liveDataStore <- AtomDataStores.getDataStore(atomType, Live)
        liveAtom = atomWorkshopDB.getAtom(liveDataStore, atomType, id)
        _ <- checkAtomCanBeDeletedFromPreview(liveAtom)
        previewDataStore <- AtomDataStores.getDataStore(atomType, Preview)
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
        liveDataStore <- AtomDataStores.getDataStore(atomType, Live)
        previewDataStore <- AtomDataStores.getDataStore(atomType, Preview)
        atom <- atomWorkshopDB.getAtom(liveDataStore, atomType, id)
        updatedAtom <- atomWorkshopDB.updateAtom(previewDataStore, updateTakenDownChangeRecord(atom, req.user))
        result <- atomWorkshopDB.deleteAtom(liveDataStore, atomType, id)
        _ <- sendKinesisEvent(updatedAtom, liveAtomPublisher, EventType.Takedown)
        _ <- sendKinesisEvent(updatedAtom, previewAtomPublisher, EventType.Update)
      } yield updatedAtom
    }
  }

}
