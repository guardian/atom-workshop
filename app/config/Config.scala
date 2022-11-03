package config

import com.amazonaws.auth.profile.ProfileCredentialsProvider
import com.amazonaws.auth.{AWSCredentialsProvider, AWSCredentialsProviderChain, InstanceProfileCredentialsProvider, STSAssumeRoleSessionCredentialsProvider}
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder
import com.amazonaws.services.kinesis.AmazonKinesisClientBuilder
import com.amazonaws.services.lambda.AWSLambdaClientBuilder
import com.gu.{AppIdentity, AwsIdentity, DevIdentity}
import play.api.Configuration
import services.Permissions

class Config(initialConfiguration: Configuration, identity: AppIdentity) {
  val config = initialConfiguration.underlying

  val (appName, stage, stack, region) = identity match {
    case aws: AwsIdentity => (aws.app, aws.stage, aws.stack, aws.region)
    case dev: DevIdentity => (dev.app, "DEV", "flexible", "eu-west-1")
  }

  val effectiveStage: String = if(stage == "PROD") "PROD" else "CODE"

  val awsCredentialsProvider = new AWSCredentialsProviderChain(
    new ProfileCredentialsProvider("composer"),
    new InstanceProfileCredentialsProvider(false)
  )
  def getOptionalProperty[T](path: String, getVal: String => T): Option[T] = {
    if (config.hasPath(path)) Some(getVal(path))
    else None
  }

  def getPropertyIfEnabled(enabled: Boolean, path: String): String =
    if (enabled) getOptionalProperty(path, config.getString).getOrElse(sys.error(s"Property $path is required"))
    else s"feature requiring $path is disabled"

  val kinesisEnabled = getOptionalProperty("aws.kinesis.publish.enabled", config.getBoolean).getOrElse(true)

  val elkKinesisStream = getPropertyIfEnabled(kinesisEnabled, "elk.kinesis.stream")
  val elkLoggingEnabled = getOptionalProperty("elk.logging.enabled", config.getBoolean).getOrElse(true)

  val pandaDomain = config.getString("panda.domain")
  val pandaAuthCallback = config.getString("panda.authCallback")
  val pandaSystem = config.getString("panda.system")

  val dynamoDB = AmazonDynamoDBClientBuilder
    .standard()
    .withCredentials(awsCredentialsProvider)
    .withRegion(region)
    .build()

  val previewDynamoTableName = config.getString("aws.dynamo.preview.tableName")
  val publishedDynamoTableName = config.getString("aws.dynamo.live.tableName")
  val explainerPreviewDynamoTableName = getOptionalProperty("aws.dynamo.explainers.preview.tableName", config.getString).getOrElse("explain-maker-preview-DEV")
  val explainerPublishedDynamoTableName = getOptionalProperty("aws.dynamo.explainers.live.tableName", config.getString).getOrElse("explain-maker-live-DEV")
  val notificationsDynamoTableName = config.getString("aws.dynamo.notifications.tableName")

  val gridUrl = config.getString("grid.url")
  val composerUrl = config.getString("composer.url")
  val viewerUrl = config.getString("viewer.url")
  val targetingUrl = config.getString("targeting.url")
  val workflowUrl = config.getString("workflow.url")
  val visualsUrl = config.getString("visuals.url")

  val liveKinesisStreamName = getPropertyIfEnabled(kinesisEnabled, "aws.kinesis.publish.live")
  val previewKinesisStreamName = getPropertyIfEnabled(kinesisEnabled, "aws.kinesis.publish.preview")
  val liveReindexKinesisStreamName = getPropertyIfEnabled(kinesisEnabled, "aws.kinesis.reindex.live")
  val previewReindexKinesisStreamName = getPropertyIfEnabled(kinesisEnabled, "aws.kinesis.reindex.preview")

  val presenceEnabled = getOptionalProperty("presence.enabled", config.getBoolean).getOrElse(true)
  val presenceDomain = getPropertyIfEnabled(presenceEnabled, "presence.domain")
  
  val capiPreviewIAMUrl = config.getString("capi.previewIAMUrl")
  val capiLiveUrl = config.getString("capi.liveUrl")

  val capiApiKey = getOptionalProperty("capi.apiKey", config.getString).getOrElse("atom-workshop-DEV")

  val capiCredentialsProvider = new ProfileCredentialsProvider("capi")
  val capiPreviewRole = config.getString("capi.previewRole")
  val capiPreviewCredentials: AWSCredentialsProvider = {
    new AWSCredentialsProviderChain(
      capiCredentialsProvider,
      new STSAssumeRoleSessionCredentialsProvider.Builder(capiPreviewRole, "capi-preview").build()
    )
  }

  val capiReaderQuestionsRole = config.getString("capi.readerQuestionsRole")
  val capiReaderQuestionsCredentials: AWSCredentialsProvider = {
    new AWSCredentialsProviderChain(
      capiCredentialsProvider,
      new STSAssumeRoleSessionCredentialsProvider.Builder(capiReaderQuestionsRole, "capi-readerquestions").build()
    )
  }

  val capiLambdaClient = AWSLambdaClientBuilder.standard()
    .withCredentials(capiReaderQuestionsCredentials)
    .withRegion(region)
    .build()

  val capiDynamoDB = AmazonDynamoDBClientBuilder.standard()
    .withCredentials(capiReaderQuestionsCredentials)
    .withRegion(region)
    .build()

  val atomEditorGutoolsDomain = config.getString("atom.editors.gutoolsDomain")

  val kinesisClient = AmazonKinesisClientBuilder.standard()
    .withCredentials(awsCredentialsProvider)
    .withRegion(region)
    .build()

  val reindexApiKey = config.getString("reindexApiKey")

  // Not sure if we need a full config or if we can just inline the name
  // of the function here
  val lambdaFunctionName = config.getString("aws.lambda.notifications.name")

  val permissions = new Permissions(effectiveStage, region, awsCredentialsProvider)
}
