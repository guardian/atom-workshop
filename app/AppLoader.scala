import com.gu.conf.{ConfigurationLoader, FileConfigurationLocation, SSMConfigurationLocation}
import com.gu.{AppIdentity, AwsIdentity, DevIdentity}
import config.AWS._
import play.api.ApplicationLoader.Context
import play.api.{Application, ApplicationLoader, Configuration, LoggerConfigurator}

import java.io.File

class AppLoader extends ApplicationLoader {
  override def load(context: Context): Application = {
    startLogging(context)

    val identity: AppIdentity = AppIdentity.whoAmI(defaultAppName, credentialsV2)

    val loadedConfig = ConfigurationLoader.load(identity, credentialsV2) {
      case identity: AwsIdentity => SSMConfigurationLocation.default(identity)
      case _: DevIdentity =>
        val home = System.getProperty("user.home")
        FileConfigurationLocation(new File(s"$home/.gu/$defaultAppName.conf"))
    }

    new AppComponents(context.copy(initialConfiguration = context.initialConfiguration ++ Configuration(loadedConfig)), identity).application
  }

  private def startLogging(context: Context): Unit = {
    LoggerConfigurator(context.environment.classLoader).foreach {
      _.configure(context.environment)
    }
  }
}
