package config

import com.amazonaws.auth.profile.{ProfileCredentialsProvider => ProfileCredentialsProviderV1}
import com.amazonaws.auth.{AWSCredentialsProviderChain => AWSCredentialsProviderChainV1, InstanceProfileCredentialsProvider => InstanceProfileCredentialsProviderV1}
import com.amazonaws.regions.{Region, Regions}
import com.amazonaws.services.dynamodbv2.{AmazonDynamoDB, AmazonDynamoDBClientBuilder}
import com.amazonaws.services.kinesis.{AmazonKinesis, AmazonKinesisClientBuilder}
import software.amazon.awssdk.auth.credentials.{AwsCredentialsProviderChain, InstanceProfileCredentialsProvider, ProfileCredentialsProvider}

object AWS {
  lazy val region: Region = Option(Regions.getCurrentRegion).getOrElse(Region.getRegion(Regions.EU_WEST_1))
  lazy val defaultAppName = "atom-workshop"
  lazy val profile = "composer"

  lazy val credentialsV2: AwsCredentialsProviderChain = AwsCredentialsProviderChain.builder().credentialsProviders(
    ProfileCredentialsProvider.create(profile),
    InstanceProfileCredentialsProvider.create()
  ).build()

  lazy val credentials = new AWSCredentialsProviderChainV1(
    new ProfileCredentialsProviderV1("composer"),
    new InstanceProfileCredentialsProviderV1(false)
  )

  lazy val dynamoDB: AmazonDynamoDB = AmazonDynamoDBClientBuilder
    .standard()
    .withCredentials(AWS.credentials)
    .withRegion(region.getName)
    .build()

  lazy val kinesisClient: AmazonKinesis = AmazonKinesisClientBuilder.standard()
    .withCredentials(AWS.credentials)
    .withRegion(region.getName)
    .build()
}
