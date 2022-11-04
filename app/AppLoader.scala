import com.gu.conf.{ConfigurationLoader, FileConfigurationLocation, SSMConfigurationLocation}
import com.gu.{AppIdentity, AwsIdentity, DevIdentity}
import play.api.ApplicationLoader.Context
import play.api.{Application, ApplicationLoader, Configuration, LoggerConfigurator}
import software.amazon.awssdk.auth.credentials.{AwsCredentialsProvider, DefaultCredentialsProvider, ProfileCredentialsProvider}

import java.io.File

class AppLoader extends ApplicationLoader {
  override def load(context: Context): Application = {
    startLogging(context)

    val appName = "atom-workshop"

    val identity: AppIdentity = AppIdentity.whoAmI(appName)

    val credentials: AwsCredentialsProvider = identity match {
      case _: DevIdentity => ProfileCredentialsProvider.create("composer")
      case _ => DefaultCredentialsProvider.create()
    }

    val loadedConfig = ConfigurationLoader.load(identity, credentials) {
      case identity: AwsIdentity => SSMConfigurationLocation.default(identity)
      case _: DevIdentity =>
        val home = System.getProperty("user.home")
        FileConfigurationLocation(new File(s"$home/.gu/$appName.conf"))
    }

    new AppComponents(context.copy(initialConfiguration = context.initialConfiguration ++ Configuration(loadedConfig)), identity).application
  }

  private def startLogging(context: Context): Unit = {
    LoggerConfigurator(context.environment.classLoader).foreach {
      _.configure(context.environment)
    }
  }
}
