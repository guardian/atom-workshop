package models

import com.gu.contentatom.thrift.AtomType
import models.APIResponse.{Conflict, InternalServerError}

sealed abstract class AtomAPIError(val msg: String, val status: APIResponse.Status = InternalServerError)

case object InvalidAtomTypeError extends AtomAPIError("Atom type not valid - did you make a typo? Correct examples: 'cta', 'media")
case class UnknownAtomError(atomType: AtomType, id: String) extends AtomAPIError(s"Unknown atom $atomType/$id")
case object UnsupportedAtomTypeError extends AtomAPIError("Atom type not supported. Currently supported types: unknown")
case object DeleteAtomFromPreviewError extends AtomAPIError("Could not delete atom from preview. Atom is live.")
case class CreateAtomDynamoError(atomJson: String, message: String) extends AtomAPIError(s"Error thrown by Dynamo when attempting to create atom. JSON of atom: $atomJson, error message: $message")
case class AmazonDynamoError(message: String) extends AtomAPIError(s"Error thrown by Dynamo: $message")
case class AtomWorkshopDynamoDatastoreError(message: String) extends AtomAPIError(message)
case object AtomWorkshopDynamoConflictError extends AtomAPIError("Could not apply update due to a version conflict", Conflict)
case class ExplainerDynamoDatastoreError(message: String) extends AtomAPIError(message)
case class AtomJsonParsingError(message: String) extends AtomAPIError(s"Failed to parse Json string with error: $message")
case class AtomThriftDeserialisingError(message: String) extends AtomAPIError(s"Failed to deserialise JSON into thrift with error: $message")
case object UnexpectedExceptionError extends AtomAPIError("Atom workshop hit an exception it didn't expect. Please try again!")
case object BodyRequiredForUpdateError extends AtomAPIError("You must provide a JSON representation of the the new version of the atom you wish to update in the body of your request")
case object KinesisPublishingFailed extends AtomAPIError("Failed to publish to Content API via kinesis")
case class LambdaExecutionError(name: String, message: String) extends AtomAPIError("Lambda invocation failed")