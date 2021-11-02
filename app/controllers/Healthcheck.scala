package controllers

import play.api.mvc.{Action, Controller}
import play.api.Logger

class Healthcheck extends Controller {

  def healthcheck = Action {
    Logger.info(s"Healthcheck called")
    Ok("Healthcheck")
  }

}
