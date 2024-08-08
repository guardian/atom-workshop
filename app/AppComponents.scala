import com.gu.AppIdentity
import com.gu.atom.play.ReindexController
import com.gu.pandomainauth.PanDomainAuthSettingsRefresher
import config.{AWS, Config}
import controllers.{AssetsComponents, ExplainerReindexController, PanDomainAuthActions}
import db.{AtomDataStores, AtomWorkshopDB, ExplainerDB}
import play.api.ApplicationLoader.Context
import play.api.{BuiltInComponentsFromContext, Configuration}
import play.api.libs.ws.WSClient
import play.api.libs.ws.ahc.AhcWSComponents
import play.api.mvc.{ControllerComponents, EssentialFilter}
import play.filters.HttpFiltersComponents
import router.Routes
import services.{AtomPublishers, Permissions}

class AppComponents(context: Context, identity: AppIdentity)
  extends BuiltInComponentsFromContext(context) with AhcWSComponents with AssetsComponents with HttpFiltersComponents {

  lazy val config = new Config(context.initialConfiguration, identity)

  override lazy val router = new Routes(httpErrorHandler, appController, healthcheckController, loginController, assets, supportController, reindex, explainerReindex)
  override lazy val httpFilters: Seq[EssentialFilter] = super.httpFilters.filterNot(_ == allowedHostsFilter)

  lazy val appPermissions = new Permissions(config.effectiveStage)

  private val pandaAuthActions = new PanDomainAuthActions {
    override def authCallbackUrl: String = config.pandaAuthCallback

    override def wsClient: WSClient = AppComponents.this.wsClient

    override def controllerComponents: ControllerComponents = AppComponents.this.controllerComponents

    override val panDomainSettings: PanDomainAuthSettingsRefresher = new PanDomainAuthSettingsRefresher(
      domain = config.pandaDomain,
      system = config.pandaSystem,
      bucketName = "pan-domain-auth-settings",
      settingsFileKey = s"${config.pandaDomain}.settings",
      s3Client = AWS.S3Client,
    )

    override def permissions: Permissions = appPermissions
  }

  lazy val atomWorkshopDB = new AtomWorkshopDB()
  lazy val explainerDB = new ExplainerDB()

  lazy val atomDataStores = new AtomDataStores(config)
  lazy val atomPublishers = new AtomPublishers(config)


  lazy val appController = new controllers.App(controllerComponents, config, pandaAuthActions, atomWorkshopDB, atomDataStores, atomPublishers, appPermissions)
  lazy val loginController = new controllers.Login(controllerComponents, wsClient, pandaAuthActions)
  lazy val healthcheckController = new controllers.Healthcheck(controllerComponents)
  lazy val supportController = new controllers.Support(controllerComponents, wsClient, config, pandaAuthActions)

  lazy val reindex = new ReindexController(
    atomDataStores.previewDataStore,
    atomDataStores.publishedDataStore,
    atomDataStores.reindexPreview,
    atomDataStores.reindexPublished,
    Configuration(config.config),
    controllerComponents,
    actorSystem
  )

  lazy val explainerReindex = new ExplainerReindexController(
    wsClient,
    explainerDB,
    atomDataStores.explainerPreviewDataStore,
    atomDataStores.explainerPublishedDataStore,
    atomDataStores.reindexPreview,
    atomDataStores.reindexPublished,
    config,
    controllerComponents
  )(actorSystem.dispatcher)
}