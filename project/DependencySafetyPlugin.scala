import sbt._
import sbt.Keys._

object DependencySafetyPlugin extends AutoPlugin {
  override def trigger = allRequirements

  object autoImport {
    val verifyDependencySafety = taskKey[Unit]("Check resolved dependencies for excluded vulnerable artifacts")
  }
  import autoImport._

  override lazy val projectSettings = Seq(
    verifyDependencySafety := {
      val modules = update.value.configurations.flatMap(_.modules).filterNot(_.evicted).map(_.module)
      require(!modules.exists(m => Set("io.fluentlenium", "org.seleniumhq.selenium", "io.appium").contains(m.organization) ||
        (m.organization == "net.sourceforge.htmlunit" && m.name == "htmlunit") ||
        (m.organization == "org.scalatestplus" && m.name.startsWith("selenium-"))),
        "Unused browser test dependencies must not re-enter the resolved graph")
    },
    Test / test := (Test / test).dependsOn(verifyDependencySafety).value
  )
}
