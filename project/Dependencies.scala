import play.sbt.PlayImport.ws
import sbt.*

object Dependencies {
  lazy val atomLibVersion = "14.0.0"
  lazy val awsVersion = "2.55.11"
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
    "software.amazon.awssdk" % "dynamodb" % awsVersion,
    "software.amazon.awssdk" % "kinesis" % awsVersion,
    "software.amazon.awssdk" % "sts" % awsVersion,
    "com.gu" %% "atom-manager-play" % atomLibVersion,
    "com.gu" %% "atom-publisher-lib" % atomLibVersion,
    "com.gu" %% "editorial-permissions-client" % "8.0.0",
    "com.gu" %% "simple-configuration-ssm" % "10.0.2",
    "com.gu" %% "fezziwig" % "1.6",
    "com.gu" %% "pan-domain-auth-play_3-0" % "22.2.0",
    "io.circe" %% "circe-parser" % "0.14.5",
    "net.logstash.logback" % "logstash-logback-encoder" % "6.6",
    "com.gu" %% "content-api-client-aws" % "1.0.1",
    "com.gu" %% "content-api-client" % "50.0.0",
    "joda-time" % "joda-time" % "2.14.2"
  )
}
