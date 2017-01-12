name := "atom-workshop"

version := "1.0"

scalaVersion := "2.11.7"

libraryDependencies ++= Seq(
  ws
)

import com.typesafe.sbt.packager.archetypes.ServerLoader.Systemd
serverLoading in Debian := Systemd

lazy val root = (project in file(".")).enablePlugins(PlayScala, RiffRaffArtifact, JDebPackaging)
  .settings(Defaults.coreDefaultSettings: _*)
  .settings(
    name in Universal := normalizedName.value,
    topLevelDirectory := Some(normalizedName.value),
    riffRaffPackageName := s"editorial-tools:${name.value}",
    riffRaffManifestProjectName := riffRaffPackageName.value,
    riffRaffBuildIdentifier :=  Option(System.getenv("CIRCLE_BUILD_NUM")).getOrElse("dev"),
    riffRaffUploadArtifactBucket := Option("riffraff-artifact"),
    riffRaffUploadManifestBucket := Option("riffraff-builds"),
    riffRaffManifestBranch := Option(System.getenv("CIRCLE_BRANCH")).getOrElse("dev"),

    riffRaffPackageType := (packageBin in Debian).value,

    debianPackageDependencies := Seq("openjdk-8-jre-headless"),
    maintainer := "Editorial Tools <digitalcms.dev@guardian.co.uk>",
    packageSummary := "Atom Workshop",
    packageDescription := """A single place for atoms of all types""",

    riffRaffArtifactResources ++= Seq(
      riffRaffPackageType.value -> s"packages/${name.value}/${name.value}.deb",
      baseDirectory.value / "cloudformation" / "AtomWorkshop.yml" -> s"packages/cloudformation/AtomWorkshop.yml"
    ),
    javaOptions in Universal ++= Seq(
      "-Dlogger.resource=prod-logger.xml",
      "-Dpidfile.path=/dev/null"
    )
  )