package services

import com.gu.pandomainauth.model.AuthenticatedUser
import com.gu.permissions.{PermissionDefinition, PermissionsConfig, PermissionsProvider}
import config.AWS

class Permissions(stage: String) {
  private val legacyApp = "atom-maker" // used for old permissions, shared with MAM. TODO should these be separated?
  private val app = "atom-workshop"

  private val deleteAtom = PermissionDefinition(name = "delete_atom", legacyApp)
  private val access = PermissionDefinition(name = "atom_workshop_access", app)

  private val permissionDefinitions = Map(
    "deleteAtom" -> deleteAtom,
    "access" -> access
  )

  def canAccess(authedUser: AuthenticatedUser): Boolean = {
    permissions.hasPermission(access, authedUser.user.email)
  }

  def canDeleteAtom(authedUser: AuthenticatedUser): Boolean = {
    permissions.hasPermission(deleteAtom, authedUser.user.email)
  }

  private val permissions: PermissionsProvider = PermissionsProvider(PermissionsConfig(stage, AWS.region.getName, AWS.credentials))

  def getAll(email: String): Map[String, Boolean] = permissionDefinitions.transform(
    (_, permission) => permissions.hasPermission(permission, email)
  )
}
