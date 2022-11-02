package services

import com.amazonaws.auth.AWSCredentialsProvider
import com.gu.permissions.{PermissionDefinition, PermissionsConfig, PermissionsProvider}
class Permissions(stage: String, region: String, credsProvider: AWSCredentialsProvider) {
  private val app = "atom-maker"

  private val permissionDefinitions = Map(
    "deleteAtom" -> PermissionDefinition(name = "delete_atom", app)
  )

  private val permissions: PermissionsProvider = PermissionsProvider(PermissionsConfig(stage, region, credsProvider))

  def getAll(email: String): Map[String, Boolean] = permissionDefinitions.transform(
    (_, permission) => permissions.hasPermission(permission, email)
  )
}
