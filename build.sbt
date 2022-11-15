import Dependencies._

name := "atom-workshop"
version := "1.0"

scalaVersion := "2.12.16"

lazy val awsVersion = "1.11.678"
lazy val atomLibVersion = "1.3.0"

libraryDependencies ++= dependencies

resolvers ++= Seq(
  "Sonatype OSS Snapshots" at "https://oss.sonatype.org/content/repositories/snapshots/",
    Resolver.sonatypeRepo("snapshots")
)

routesGenerator := InjectedRoutesGenerator

lazy val root = (project in file(".")).enablePlugins(PlayScala, RiffRaffArtifact, JDebPackaging, SystemdPlugin)
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
    ),

    pipelineStages := Seq(digest)
  )

