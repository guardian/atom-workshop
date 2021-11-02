import com.gu.atom.play.ReindexController
import config.LogConfig
import config.Config.{config, permissions, dynamoDB, capiDynamoDB, capiLambdaClient}
import controllers.ExplainerReindexController
import db.AtomDataStores._
import db.AtomWorkshopDB
import db.ExplainerDB
import db.ReindexDataStores._
import play.api.ApplicationLoader.Context
import play.api._
import play.api.libs.ws.ahc.AhcWSComponents
import router.Routes

class AppComponents(context: Context)
  extends BuiltInComponentsFromContext(context) with AhcWSComponents {

  // val logger = new LogConfig

  lazy val router = new Routes(httpErrorHandler, appController, healthcheckController, loginController, assets, supportController, reindex, explainerReindex)
  lazy val assets = new controllers.Assets(httpErrorHandler)
  lazy val appController = new controllers.App(wsClient, atomWorkshopDB, permissions)
  lazy val loginController = new controllers.Login(wsClient)
  lazy val healthcheckController = new controllers.Healthcheck()
  lazy val supportController = new controllers.Support(wsClient)

  lazy val reindex = new ReindexController(previewDataStore, publishedDataStore, reindexPreview, reindexPublished, Configuration(config), actorSystem)

  lazy val explainerReindex = new ExplainerReindexController(
    wsClient,
    explainerDB,
    explainerPreviewDataStore,
    explainerPublishedDataStore,
    reindexPreview,
    reindexPublished,
    Configuration(config)
  )(actorSystem.dispatcher)

  lazy val atomWorkshopDB = new AtomWorkshopDB()

  lazy val explainerDB = new ExplainerDB()
}
