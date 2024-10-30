package config

import com.amazonaws.auth.profile.ProfileCredentialsProvider
import com.amazonaws.auth.{AWSCredentialsProvider, AWSCredentialsProviderChain, STSAssumeRoleSessionCredentialsProvider}
import com.gu.{AppIdentity, AwsIdentity, DevIdentity}
import play.api.Configuration

class Config(initialConfiguration: Configuration, identity: AppIdentity) {
  val config = initialConfiguration.underlying

  val (appName, stage) = identity match {
    case aws: AwsIdentity => (aws.app, aws.stage)
    case dev: DevIdentity => (dev.app, "DEV")
  }

  val effectiveStage: String = if (stage.contentEquals("DEV")) "CODE" else stage

  val domain: String = domainFromStage(stage)
  val serviceDomain: String = domainFromStage(effectiveStage)

  // Service URLs
  val gridUrl = s"https://media.${if (!stage.contentEquals("PROD")) "test.dev-" else ""}gutools.co.uk"
  val composerUrl = s"https://composer.$serviceDomain"
  val viewerUrl = s"https://viewer.$serviceDomain/"
  val targetingUrl = s"https://targeting.$serviceDomain/"
  val workflowUrl = s"https://workflow.$serviceDomain"
  val visualsUrl = s"https://charts.$domain"

  // Panda Auth
  val pandaDomain: String = domain
  val pandaAuthCallback: String = s"https://atomworkshop.$domain/oauthCallback"
  val pandaSystem: String = config.getString("panda.system")

  // Kinesis
  val kinesisEnabled: Boolean = getOptionalProperty("aws.kinesis.publish.enabled", config.getBoolean).getOrElse(true)
  val liveKinesisStreamName: String = getPropertyIfEnabled(kinesisEnabled, "aws.kinesis.publish.live")
  val previewKinesisStreamName: String = getPropertyIfEnabled(kinesisEnabled, "aws.kinesis.publish.preview")
  val liveReindexKinesisStreamName: String = getPropertyIfEnabled(kinesisEnabled, "aws.kinesis.reindex.live")
  val previewReindexKinesisStreamName: String = getPropertyIfEnabled(kinesisEnabled, "aws.kinesis.reindex.preview")

  // DynamoDB
  val previewDynamoTableName: String = config.getString("aws.dynamo.preview.tableName")
  val publishedDynamoTableName: String = config.getString("aws.dynamo.live.tableName")
  val explainerPreviewDynamoTableName: String = config.getString("aws.dynamo.explainers.preview.tableName")
  val explainerPublishedDynamoTableName: String = config.getString("aws.dynamo.explainers.live.tableName")

  // CAPI
  val capiApiKey: String = config.getString("capi.apiKey")
  val capiPreviewIAMUrl: String = config.getString("capi.previewIAMUrl")
  val capiLiveUrl: String = config.getString("capi.liveUrl")
  val capiPreviewRole: String = config.getString("capi.previewRole")
  val capiPreviewCredentials: AWSCredentialsProvider = {
    new AWSCredentialsProviderChain(
      new ProfileCredentialsProvider("capi"),
      new STSAssumeRoleSessionCredentialsProvider.Builder(capiPreviewRole, "capi-preview").build()
    )
  }

  // Presence
  val presenceEnabled: Boolean = getOptionalProperty("presence.enabled", config.getBoolean).getOrElse(true)
  val presenceDomain: String = getPropertyIfEnabled(presenceEnabled, "presence.domain")

  val reindexApiKey: String = config.getString("reindexApiKey")

  def getOptionalProperty[T](path: String, getVal: String => T): Option[T] = {
    if (config.hasPath(path)) Some(getVal(path))
    else None
  }

  def getPropertyIfEnabled(enabled: Boolean, path: String): String =
    if (enabled) getOptionalProperty(path, config.getString).getOrElse(sys.error(s"Property $path is required"))
    else s"feature requiring $path is disabled"

  private def domainFromStage(stage: String): String = {
    stage match {
      case "PROD" => "gutools.co.uk"
      case "DEV" => "local.dev-gutools.co.uk"
      case x => x.toLowerCase() + ".dev-gutools.co.uk"
    }
  }
}
