package controllers

import play.api.libs.ws.WSClient
import play.api.mvc._

class Login(val controllerComponents: ControllerComponents, val wsClient: WSClient, val pandaAuthActions: PanDomainAuthActions) extends BaseController {
  import pandaAuthActions.{AuthAction, processOAuthCallback}

  def reauth: Action[AnyContent] = AuthAction {
    Ok("auth ok")
  }

  def oauthCallback: Action[AnyContent] = Action.async { implicit request =>
    processOAuthCallback()
  }
}