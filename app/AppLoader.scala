import com.gu.conf.{ConfigurationLoader, FileConfigurationLocation, SSMConfigurationLocation}
import com.gu.{AppIdentity, AwsIdentity, DevIdentity}
import play.api.ApplicationLoader.Context
import play.api.{Application, ApplicationLoader, Configuration, LoggerConfigurator, Logging, Mode}
import software.amazon.awssdk.auth.credentials.{AwsCredentialsProvider, DefaultCredentialsProvider, ProfileCredentialsProvider}

import java.io.File
import scala.util.{Failure, Success}

class AppLoader extends ApplicationLoader with Logging {
  override def load(context: Context): Application = {
    startLogging(context)

    val appName = "atom-workshop"

    val credentialsProvider = DefaultCredentialsProvider.builder().build()
    val isDev = context.environment.mode == Mode.Dev

    val application = for {
      identity <- if (isDev) Success(DevIdentity(appName)) else AppIdentity.whoAmI(appName, credentialsProvider)
    } yield {
      val loadedConfig = ConfigurationLoader.load(identity, credentialsProvider) {
        case identity: AwsIdentity => SSMConfigurationLocation.default(identity)
        case _: DevIdentity =>
          val home = System.getProperty("user.home")
          FileConfigurationLocation(new File(s"$home/.gu/$appName.conf"))
      }

      new AppComponents(context.copy(initialConfiguration = context.initialConfiguration.withFallback(Configuration(loadedConfig))), identity).application
    }

    application match {
      case Success(app) => app
      case Failure(error) =>
        logger.error("Error starting application", error)
        throw error
    }
  }

  private def startLogging(context: Context): Unit = {
    LoggerConfigurator(context.environment.classLoader).foreach {
      _.configure(context.environment)
    }
  }
}
