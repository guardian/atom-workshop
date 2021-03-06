package config

import com.amazonaws.auth.profile.ProfileCredentialsProvider
import com.amazonaws.auth.{
  AWSCredentialsProvider, 
  AWSCredentialsProviderChain, 
  InstanceProfileCredentialsProvider, 
  STSAssumeRoleSessionCredentialsProvider
}
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClient
import com.amazonaws.services.kinesis.AmazonKinesisClient
import com.amazonaws.services.lambda.AWSLambdaClient
import com.gu.cm.{Mode, Configuration => ConfigurationMagic}
import services.{AtomWorkshopPermissionsProvider, AwsInstanceTags}

object Config extends AwsInstanceTags {

  val stage = readTag("Stage") getOrElse "DEV"
  val appName = readTag("App") getOrElse "atom-workshop"
  val stack = readTag("Stack") getOrElse "flexible"
  val region = services.EC2Client.region

  val awsCredentialsProvider = new AWSCredentialsProviderChain(
    new ProfileCredentialsProvider("composer"),
    new InstanceProfileCredentialsProvider(false)
  )

  //CODE uses Configuration Mode PROD so that we can use dynamo to get config. Configuration Magic currently has no CODE mode SC 15/2/17
  val configMagicMode = stage match {
    case "DEV" => Mode.Dev
    case "CODE" => Mode.Prod
    case "PROD" => Mode.Prod
    case _ => sys.error("invalid stage")
  }
  val config = ConfigurationMagic(appName, configMagicMode).load

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

  val dynamoDB = region.createClient(
    classOf[AmazonDynamoDBClient],
    awsCredentialsProvider,
    null
  )

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

  val capiLambdaClient = region.createClient(
    classOf[AWSLambdaClient],
    capiReaderQuestionsCredentials,
    null
  )

  val capiDynamoDB = region.createClient(
    classOf[AmazonDynamoDBClient],
    capiReaderQuestionsCredentials,
    null
  )

  val atomEditorGutoolsDomain = config.getString("atom.editors.gutoolsDomain")

  val kinesisClient = region.createClient(
    classOf[AmazonKinesisClient],
    awsCredentialsProvider,
    null
  )

  // Not sure if we need a full config or if we can just inline the name
  // of the function here
  val lambdaFunctionName = config.getString("aws.lambda.notifications.name")

  val permissions = new AtomWorkshopPermissionsProvider(stage, awsCredentialsProvider)
}
