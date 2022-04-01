import com.gu.atom.play.ReindexController
import com.typesafe.config.Config
import config.Config.{capiDynamoDB, capiLambdaClient, config, dynamoDB, permissions}
import controllers.ExplainerReindexController
import db.AtomDataStores._
import db.AtomWorkshopDB
import db.ExplainerDB
import db.ReindexDataStores._
import play.api.Configuration
import play.api.ApplicationLoader.Context
import play.api.BuiltInComponentsFromContext
import play.api.libs.ws.ahc.AhcWSComponents
import controllers.AssetsComponents
import play.filters.HttpFiltersComponents
import router.Routes

class AppComponents(context: Context)
  extends BuiltInComponentsFromContext(context) with AhcWSComponents with AssetsComponents with HttpFiltersComponents {

  lazy val router = new Routes(httpErrorHandler, appController, healthcheckController, loginController, assets, supportController, reindex, explainerReindex)
  lazy val appController = new controllers.App(wsClient, atomWorkshopDB, permissions, controllerComponents)
  lazy val loginController = new controllers.Login(wsClient, controllerComponents)
  lazy val healthcheckController = new controllers.Healthcheck(controllerComponents)
  lazy val supportController = new controllers.Support(wsClient, controllerComponents)

  lazy val reindex = new ReindexController(previewDataStore, publishedDataStore, reindexPreview, reindexPublished, Configuration(config), controllerComponents, actorSystem)

  lazy val explainerReindex = new ExplainerReindexController(
    wsClient,
    explainerDB,
    explainerPreviewDataStore,
    explainerPublishedDataStore,
    reindexPreview,
    reindexPublished,
    Configuration(config),
    controllerComponents
  )(actorSystem.dispatcher)

  lazy val atomWorkshopDB = new AtomWorkshopDB()

  lazy val explainerDB = new ExplainerDB()
}
