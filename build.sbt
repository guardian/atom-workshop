import Dependencies._

name := "atom-workshop"
version := "1.0"

scalaVersion := "2.13.12"

libraryDependencies ++= dependencies

dependencyOverrides ++= Seq("circe-core", "circe-generic", "circe-parser", "circe-jawn", "circe-numbers")
  .map("io.circe" %% _ % "0.14.16")

dependencyOverrides += "com.google.guava" % "guava" % "33.7.2-jre"

dependencyOverrides ++= Seq(
  "ch.qos.logback" % "logback-core" % "1.5.34",
  "ch.qos.logback" % "logback-classic" % "1.5.34"
)

routesGenerator := InjectedRoutesGenerator

resolvers ++= Resolver.sonatypeOssRepos("releases")

lazy val root = (project in file(".")).enablePlugins(PlayScala, JDebPackaging, SystemdPlugin)
  .settings(Defaults.coreDefaultSettings: _*)
  .settings(
    Universal / name := normalizedName.value,
    topLevelDirectory := Some(normalizedName.value),

    maintainer := "Editorial Tools <digitalcms.dev@guardian.co.uk>",
    packageSummary := "Atom Workshop",
    packageDescription := """A single place for atoms of all types""",

    Universal / javaOptions ++= Seq(
      "-Dpidfile.path=/dev/null"
    ),

    pipelineStages := Seq(digest)
  )
