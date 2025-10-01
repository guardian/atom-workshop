import play.sbt.PlayImport.ws
import sbt._

object Dependencies {
  lazy val awsVersion = "1.12.791"
  lazy val atomLibVersion = "3.0.0"
  lazy val jacksonVersion = "2.17.2"
  lazy val jacksonDatabindVersion = "2.17.2"

  // these Jackson dependencies are required to resolve issues in Play 2.8.x https://github.com/orgs/playframework/discussions/11222
  val jacksonOverrides = Seq(
    "com.fasterxml.jackson.core" % "jackson-core",
    "com.fasterxml.jackson.datatype" % "jackson-datatype-jdk8",
    "com.fasterxml.jackson.datatype" % "jackson-datatype-jsr310",
    "com.fasterxml.jackson.module" %% "jackson-module-scala",
    "com.fasterxml.jackson.core" % "jackson-annotations"
  ).map(_ % jacksonVersion)

  val jacksonDatabindOverrides = Seq(
    "com.fasterxml.jackson.core" % "jackson-databind" % jacksonDatabindVersion
  )

  val dependencies = jacksonOverrides ++ jacksonDatabindOverrides ++ Seq(
    ws,
    "com.amazonaws" % "aws-java-sdk-core" % awsVersion,
    "com.amazonaws" % "aws-java-sdk-ec2" % awsVersion,
    "com.amazonaws" % "aws-java-sdk-lambda" % awsVersion,
    "com.amazonaws" % "aws-java-sdk-dynamodb" % awsVersion,
    "com.amazonaws" % "aws-java-sdk-sts" % awsVersion,
    "com.amazonaws" % "aws-java-sdk-kinesis" % awsVersion,
    "com.gu" %% "atom-manager-play" % atomLibVersion,
    "com.gu" %% "atom-publisher-lib" % atomLibVersion,
    "com.gu" %% "editorial-permissions-client" % "2.15",
    "com.gu" %% "simple-configuration-ssm" % "7.0.1",
    "com.gu" %% "fezziwig" % "1.6",
    "com.gu" %% "pan-domain-auth-play_3-0" % "11.0.0-PREVIEW.sh-wsyupgrade-aws-sdk-to-2.2025-09-17T1358.a15b1789",
    "io.circe" %% "circe-parser" % "0.14.5",
    "net.logstash.logback" % "logstash-logback-encoder" % "6.6",
    "com.gu" %% "content-api-client-aws" % "0.7",
    "com.gu" %% "content-api-client" % "20.0.0"
  )
}
