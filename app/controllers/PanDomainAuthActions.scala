package controllers

import com.gu.pandomainauth.PanDomain
import com.gu.pandomainauth.action.AuthActions
import com.gu.pandomainauth.model.AuthenticatedUser
import play.api.Logging
import services.Permissions
import play.api.mvc.{RequestHeader, Result}
import play.api.mvc.Results.Forbidden

trait PanDomainAuthActions extends AuthActions with Logging {

  override def validateUser(authedUser: AuthenticatedUser): Boolean = {

    val isValid = PanDomain.guardianValidation(authedUser)
    val canAccess = permissions.canAccess(authedUser)
    val canDeleteAtom = permissions.canDeleteAtom(authedUser)

    if (!isValid) {
      logger.warn(s"User ${authedUser.user.email} is not valid")
    } else if (!canAccess && !canDeleteAtom) {
      logger.warn(s"User ${authedUser.user.email} has no atom workshop permissions")
    } else if (!canAccess) {
      logger.warn(s"User ${authedUser.user.email} does not have atom_workshop_access permission")
    }

    isValid && canAccess
  }

  override def showUnauthedMessage(message: String)(implicit request: RequestHeader): Result = {
    Forbidden(views.html.authError(message))
  }

  override def authCallbackUrl: String

  def permissions: Permissions
}
