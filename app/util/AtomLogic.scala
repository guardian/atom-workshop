package util

import cats.syntax.either._
import com.amazonaws.services.dynamodbv2.model.AmazonDynamoDBException
import com.gu.atom.data.DynamoCompositeKey
import com.gu.contentatom.thrift._
import com.gu.contententity.thrift.Entity
import com.gu.fezziwig.CirceScroogeMacros._
import com.gu.pandomainauth.model.User
import io.circe.generic.auto._
import io.circe.{DecodingFailure, ParsingFailure, parser, _}
import models._
import play.api.Logging
import util.AtomElementBuilders._

object AtomLogic extends Logging {

  def buildKey(atomType: AtomType, id: String) = DynamoCompositeKey(atomType.name, Some(id))

  def getVersion(version: String): Version = version match {
    case "preview" => Preview
    case "live" => Live
  }

  def validateAtomType(atomType: String): Either[AtomAPIError, AtomType] = {
    val t = AtomType.valueOf(atomType)
    Either.cond(t.isDefined, t.get, InvalidAtomTypeError)
  }

  def processException(exception: Exception): Either[AtomAPIError, Nothing] = {
    val atomApiError = exception match {
      case e: ParsingFailure => AtomJsonParsingError(e.message)
      case e: DecodingFailure => AtomThriftDeserialisingError(e.message)
      case e: AmazonDynamoDBException => AmazonDynamoError(e.getMessage)
      case _ => UnexpectedExceptionError
    }
    logger.error(atomApiError.msg, exception)
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

  def updateTakenDownChangeRecord(atom: Atom, user: User): Atom =
    atom.copy(contentChangeDetails = buildContentChangeDetails(user, Some(atom.contentChangeDetails), updateTakenDown = true))
}

object Parser extends Logging {
  import AtomLogic._

  //These implicits speed up compilation
  private implicit val atomDecoder = {
    implicit val entityDecoder = Decoder[Entity]
    implicit val imageAssetDecoder = Decoder[ImageAsset]
    implicit val imageDecoder = Decoder[Image]
    implicit val changeRecord = Decoder[ChangeRecord]
    implicit val atomDataDecoder = Decoder[AtomData]
    implicit val flagsDecoder = Decoder[Flags]

    Decoder[Atom]
  }


  def stringToAtom(atomString: String): Either[AtomAPIError, Atom] = {
    logger.info(s"Parsing atom json: $atomString")
    for {
      json <- stringToJson(atomString)
      atom <- jsonToAtom(json)
    } yield atom
  }

  def jsonToAtom(json: Json): Either[AtomAPIError, Atom] = {
    logger.info(s"Parsing json: $json")
    json.as[Atom].fold(processException, m => Right(m))
  }

  def stringToJson(atomJson: String): Either[AtomAPIError, Json] = {
    logger.info(s"Parsing body to json: $atomJson")
    val parsingResult = for {
      parsedJson <- parser.parse(atomJson)
    } yield parsedJson
    parsingResult.fold(processException, a => Right(a))
  }
}
