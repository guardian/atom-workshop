logLevel := Level.Warn

libraryDependencies += "org.vafer" % "jdeb" % "1.6" artifacts Artifact("jdeb", "jar", "jar")

addSbtPlugin("com.typesafe.play" % "sbt-plugin" % "2.7.9")

addSbtPlugin("com.gu" % "sbt-riffraff-artifact" % "1.1.18")

addSbtPlugin("net.virtual-void" % "sbt-dependency-graph" % "0.10.0-RC1")

addSbtPlugin("com.typesafe.sbt" % "sbt-digest" % "1.1.1")
