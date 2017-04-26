package util

import com.amazonaws.services.dynamodbv2.model.AmazonDynamoDBException
import cats.syntax.either._
import io.circe.generic.auto._
import io.circe.{DecodingFailure, Json, ParsingFailure, parser}
import models._
import play.api.Logger
import util.SharedAtomDraftLogic.processException

object SharedAtomDraftLogic {

    def getVersion(version: String): Version = version match {
      case "draft" => Draft
      case "preview" => Preview
      case "live" => Live
    }

  def processException(exception: Exception): Either[AtomAPIError, Nothing] = {
    val atomApiError = exception match {
      case e: ParsingFailure => AtomJsonParsingError(e.message)
      case e: DecodingFailure => AtomThriftDeserialisingError(e.message)
      case e: AmazonDynamoDBException => AmazonDynamoError(e.getMessage)
      case e: NoSuchElementException => AtomWithoutIDError
      case _ => UnexpectedExceptionError
    }
    Logger.error(atomApiError.msg, exception)
    Left(atomApiError)
  }

  def extractRequestBody(body: Option[String]): Either[AtomAPIError, String] =
    Either.cond(body.isDefined, body.get, BodyRequiredForUpdateError)

  def extractCreateAtomFields(body: Option[String]): Either[AtomAPIError, Option[CreateAtomFields]] = {
    body.map { body =>
      for {
        json <- Parser.stringToJson(body)
        createAtomFields <- json.as[CreateAtomFields].fold(processException, m => Right(m))
      } yield Some(createAtomFields)
    }.getOrElse(Right(None))
  }

}

object Parser {
  def stringToJson(atomJson: String): Either[AtomAPIError, Json] = {
    Logger.info(s"Parsing body to json: $atomJson")
    val parsingResult = for {
      parsedJson <- parser.parse(atomJson)
    } yield parsedJson
    parsingResult.fold(processException, a => Right(a))
  }
}
