package config

import com.amazonaws.auth.profile.ProfileCredentialsProvider
import com.amazonaws.auth.{AWSCredentialsProviderChain, InstanceProfileCredentialsProvider}
import com.amazonaws.regions.{Region, Regions}
import com.amazonaws.services.dynamodbv2.{AmazonDynamoDB, AmazonDynamoDBClientBuilder}
import com.amazonaws.services.kinesis.{AmazonKinesis, AmazonKinesisClientBuilder}
import com.amazonaws.services.s3.{AmazonS3, AmazonS3ClientBuilder}

object AWS {
  lazy val region: Region = Option(Regions.getCurrentRegion).getOrElse(Region.getRegion(Regions.EU_WEST_1))

  lazy val credentials = new AWSCredentialsProviderChain(
    new ProfileCredentialsProvider("composer"),
    new InstanceProfileCredentialsProvider(false)
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

  lazy val S3Client: AmazonS3 = AmazonS3ClientBuilder.standard()
    .withCredentials(credentials)
    .withRegion(region.getName)
    .build()
}
