package controllers

import play.api.libs.ws.WSClient
import play.api.mvc._

class Login(val wsClient: WSClient, val controllerComponents: ControllerComponents) extends BaseController with PanDomainAuthActions {

  override protected val executionContext = controllerComponents.executionContext

  override protected val parser: BodyParser[AnyContent] = controllerComponents.parsers.defaultBodyParser

  def reauth = AuthAction {
    Ok("auth ok")
  }

  def oauthCallback = Action.async { implicit request =>
    processGoogleCallback()
  }
}
