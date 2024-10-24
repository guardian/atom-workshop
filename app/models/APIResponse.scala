package models

import io.circe._
import io.circe.generic.semiauto._
import io.circe.syntax._
import play.api.Logging
import play.api.mvc._

case class AtomWorkshopAPIResponse(message: String)
object AtomWorkshopAPIResponse{
  implicit val atomWorkshopApiResponseEncoder: Encoder[AtomWorkshopAPIResponse] = deriveEncoder[AtomWorkshopAPIResponse]
}

object APIResponse extends Results with Logging {
  def apiErrorToResult(e: AtomAPIError) = {
    logger.error(e.msg)
    e.status(AtomWorkshopAPIResponse(e.msg).asJson.noSpaces)
  }

  def apply[T](result: Either[AtomAPIError, T])(implicit encoder: Encoder[T]): Result = {
    val res = result.fold(apiErrorToResult, r => Ok(r.asJson.noSpaces))
    res.as("text/json")
  }
}