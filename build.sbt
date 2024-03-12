import Dependencies._

name := "atom-workshop"
version := "1.0"

scalaVersion := "2.13.12"

libraryDependencies ++= dependencies

resolvers ++= Resolver.sonatypeOssRepos("releases")

routesGenerator := InjectedRoutesGenerator

lazy val root = (project in file(".")).enablePlugins(PlayScala, RiffRaffArtifact, JDebPackaging, SystemdPlugin)
  .settings(Defaults.coreDefaultSettings: _*)
  .settings(
    Universal / name := normalizedName.value,
    topLevelDirectory := Some(normalizedName.value),
    riffRaffManifestProjectName := s"editorial-tools:${name.value}",
    riffRaffUploadArtifactBucket := Option("riffraff-artifact"),
    riffRaffUploadManifestBucket := Option("riffraff-builds"),

    riffRaffPackageType := (Debian / packageBin).value,

    maintainer := "Editorial Tools <digitalcms.dev@guardian.co.uk>",
    packageSummary := "Atom Workshop",
    packageDescription := """A single place for atoms of all types""",

    riffRaffArtifactResources := Seq(
      (Debian / packageBin).value -> "atom-workshop/atom-workshop_1.0_all.deb",
      baseDirectory.value / "riff-raff.yaml" -> "riff-raff.yaml"
    ),

    Universal / javaOptions ++= Seq(
      "-Dpidfile.path=/dev/null"
    ),

    pipelineStages := Seq(digest)
  )

