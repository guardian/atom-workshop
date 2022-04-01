name := "atom-workshop"
version := "1.0"

scalaVersion := "2.11.12"

lazy val awsVersion = "1.11.678"
lazy val atomLibVersion = "1.2.5-SNAPSHOT"

libraryDependencies ++= Seq(
  ws,
  "com.amazonaws"            %  "aws-java-sdk-core"            % awsVersion,
  "com.amazonaws"            %  "aws-java-sdk-ec2"             % awsVersion,
  "com.amazonaws"            %  "aws-java-sdk-lambda"          % awsVersion,
  "com.amazonaws"            %  "aws-java-sdk-dynamodb"        % awsVersion,
  "com.gu"                   %% "atom-manager-play"            % atomLibVersion,
  "com.gu"                   %% "atom-publisher-lib"           % atomLibVersion,
  "com.gu"                   %% "editorial-permissions-client" % "0.7",
  "com.gu"                   %% "configuration-magic-core"     % "1.3.0",
  "com.gu"                   %% "fezziwig"                     % "1.2",
  "com.gu"                   %  "kinesis-logback-appender"     % "1.4.4",
  "com.gu"                   %% "pan-domain-auth-play_2-6"     % "0.5.0",
  "io.circe"                 %% "circe-parser"                 % "0.11.0",
  "net.logstash.logback"     %  "logstash-logback-encoder"     % "6.6",
  "com.gu"                   %% "content-api-client-aws"       % "0.5",
  "com.gu"                   %% "content-api-client"           % "15.9"
)

resolvers ++= Seq(
  "Sonatype OSS Snapshots" at "http://oss.sonatype.org/content/repositories/snapshots/",
    Resolver.sonatypeRepo("snapshots")
)

routesGenerator := InjectedRoutesGenerator

import com.typesafe.sbt.packager.archetypes.systemloader.ServerLoader.Systemd
serverLoading in Debian := Some(Systemd)

lazy val root = (project in file(".")).enablePlugins(PlayScala, RiffRaffArtifact, JDebPackaging)
  .settings(Defaults.coreDefaultSettings: _*)
  .settings(
    name in Universal := normalizedName.value,
    topLevelDirectory := Some(normalizedName.value),
    riffRaffPackageName := name.value,
    riffRaffManifestProjectName := s"editorial-tools:${name.value}",
    riffRaffUploadArtifactBucket := Option("riffraff-artifact"),
    riffRaffUploadManifestBucket := Option("riffraff-builds"),

    riffRaffPackageType := (packageBin in Debian).value,

    debianPackageDependencies := Seq("openjdk-8-jre-headless"),
    maintainer := "Editorial Tools <digitalcms.dev@guardian.co.uk>",
    packageSummary := "Atom Workshop",
    packageDescription := """A single place for atoms of all types""",

    riffRaffArtifactResources := Seq(
      (packageBin in Debian).value -> "atom-workshop/atom-workshop_1.0_all.deb",
      baseDirectory.value / "riff-raff.yaml" -> "riff-raff.yaml",
      baseDirectory.value / "fluentbit/td-agent-bit.conf" -> "atom-workshop/fluentbit/td-agent-bit.conf",
      baseDirectory.value / "fluentbit/parsers.conf" -> "atom-workshop/fluentbit/parsers.conf"
    ),

    javaOptions in Universal ++= Seq(
      "-Dpidfile.path=/dev/null"
    )
  )

