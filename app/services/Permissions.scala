package services

import com.gu.permissions.{PermissionDefinition, PermissionsConfig, PermissionsProvider}
import config.AWS

class Permissions(stage: String) {
  private val app = "atom-maker"

  private val permissionDefinitions = Map(
    "deleteAtom" -> PermissionDefinition(name = "delete_atom", app)
  )

  private val permissions: PermissionsProvider = PermissionsProvider(PermissionsConfig(stage, AWS.region.getName, AWS.credentials))

  def getAll(email: String): Map[String, Boolean] = permissionDefinitions.transform(
    (_, permission) => permissions.hasPermission(permission, email)
  )
}
