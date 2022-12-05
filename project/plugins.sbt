logLevel := Level.Warn

libraryDependencies += "org.vafer" % "jdeb" % "1.6" artifacts (Artifact("jdeb", "jar", "jar"))

addSbtPlugin("com.typesafe.play" % "sbt-plugin" % "2.8.8")

addSbtPlugin("com.gu" % "sbt-riffraff-artifact" % "1.1.18")

addSbtPlugin("net.virtual-void" % "sbt-dependency-graph" % "0.10.0-RC1")

addSbtPlugin("com.typesafe.sbt" % "sbt-digest" % "1.1.3")

/*
   Because scala-xml has not be updated to 2.x in sbt yet but has in sbt-native-packager
   See: https://github.com/scala/bug/issues/12632
 */
ThisBuild / libraryDependencySchemes ++= Seq(
  "org.scala-lang.modules" %% "scala-xml" % VersionScheme.Always
)
