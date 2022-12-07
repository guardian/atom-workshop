import play.sbt.PlayImport.ws
import sbt._

object Dependencies {
  lazy val awsVersion = "1.11.678"
  lazy val atomLibVersion = "1.3.2"
  lazy val jacksonVersion = "2.13.4"
  lazy val jacksonDatabindVersion = "2.13.4.2"

  // these Jackson dependencies are required to resolve issues in Play 2.8.x https://github.com/orgs/playframework/discussions/11222
  val jacksonOverrides = Seq(
    "com.fasterxml.jackson.core" % "jackson-core",
    "com.fasterxml.jackson.core" % "jackson-annotations",
    "com.fasterxml.jackson.datatype" % "jackson-datatype-jdk8",
    "com.fasterxml.jackson.datatype" % "jackson-datatype-jsr310",
    "com.fasterxml.jackson.module" %% "jackson-module-scala",
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
    "com.gu" %% "atom-manager-play" % atomLibVersion,
    "com.gu" %% "atom-publisher-lib" % atomLibVersion,
    "com.gu" %% "editorial-permissions-client" % "2.0",
    "com.gu" %% "simple-configuration-ssm" % "1.5.6",
    "com.gu" %% "fezziwig" % "1.2",
    "com.gu" % "kinesis-logback-appender" % "1.4.4",
    "com.gu" %% "pan-domain-auth-play_2-8" % "1.2.0",
    "io.circe" %% "circe-parser" % "0.11.0",
    "net.logstash.logback" % "logstash-logback-encoder" % "6.6",
    "com.gu" %% "content-api-client-aws" % "0.5",
    "com.gu" %% "content-api-client" % "15.9"
  )
}