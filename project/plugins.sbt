logLevel := Level.Warn

libraryDependencies += "org.vafer" % "jdeb" % "1.6" artifacts (Artifact("jdeb", "jar", "jar"))

addSbtPlugin("com.typesafe.play" % "sbt-plugin" % "2.5.19")

addSbtPlugin("com.gu" % "sbt-riffraff-artifact" % "1.1.9")

 addSbtPlugin("net.virtual-void" % "sbt-dependency-graph" % "0.10.0-RC1")
