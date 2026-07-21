package config

import java.net.URI

import software.amazon.awssdk.auth.credentials.{AwsCredentialsProviderChain, DefaultCredentialsProvider, ProfileCredentialsProvider}
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import software.amazon.awssdk.services.kinesis.KinesisClient
import software.amazon.awssdk.services.s3.S3Client
import software.amazon.awssdk.services.sts.StsClient
import software.amazon.awssdk.services.sts.auth.StsAssumeRoleCredentialsProvider
import software.amazon.awssdk.services.sts.model.AssumeRoleRequest

object AWS {
  lazy val region: Region = Region.EU_WEST_1

  lazy val credentialsLocal: AwsCredentialsProviderChain = AwsCredentialsProviderChain.of(
    DefaultCredentialsProvider.builder().build(),
    ProfileCredentialsProvider.create("composer")
  )

  lazy val credentials: DefaultCredentialsProvider = DefaultCredentialsProvider.builder()
    .profileName("composer")
    .build()

  private[config] def capiPreviewCredentials(roleArn: String): AwsCredentialsProviderChain = AwsCredentialsProviderChain.of(
    ProfileCredentialsProvider.create("capi"),
    StsAssumeRoleCredentialsProvider.builder().stsClient(stsClient).refreshRequest(
      AssumeRoleRequest.builder()
        .roleArn(roleArn)
        .roleSessionName("capi-preview")
        .build()
    ).build()
  )

  lazy val dynamoDbClient: DynamoDbClient = DynamoDbClient.builder()
    .credentialsProvider(credentials)
    .region(region)
    .build()

  lazy val kinesisClient: KinesisClient = {
    val builder = KinesisClient.builder()
      .credentialsProvider(credentialsLocal)
      .region(region)

    kinesisEndpointOverride.foreach(builder.endpointOverride)

    builder.build()
  }

  lazy val s3Client: S3Client = S3Client.builder()
    .credentialsProvider(credentials)
    .region(region)
    .build()

  private lazy val stsClient = StsClient.builder()
    .credentialsProvider(credentials)
    .region(region)
    .build()

  private lazy val kinesisEndpointOverride: Option[URI] =
    setting("AWS_KINESIS_ENDPOINT").map(URI.create)

  private def setting(name: String): Option[String] =
    sys.env.get(name).orElse(sys.props.get(name)).filter(_.nonEmpty)
}
