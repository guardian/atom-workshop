import Dependencies._

name := "atom-workshop"
version := "1.0"

scalaVersion := "2.13.18"

libraryDependencies ++= dependencies

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

