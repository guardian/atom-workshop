package controllers

import com.amazonaws.auth.AWSCredentialsProvider
import com.gu.pandomainauth.action.AuthActions
import com.gu.pandomainauth.model.AuthenticatedUser
import config.AWS

trait PanDomainAuthActions extends AuthActions {

  override def validateUser(authedUser: AuthenticatedUser): Boolean =
    (authedUser.user.email endsWith "@guardian.co.uk") && authedUser.multiFactor

  override def authCallbackUrl: String

  override def domain: String

  override val system: String

  override def awsCredentialsProvider: AWSCredentialsProvider = AWS.credentialsV1

}
