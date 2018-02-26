package db

import cats.implicits._

import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClient
import com.amazonaws.services.dynamodbv2.model.{AttributeValue, GetItemRequest}

import config.Config
import models.{Answer, QuestionAnswers, AtomAPIError}

import scala.collection.JavaConverters._

class NotificationsDB(dynamoDB: AmazonDynamoDBClient) {
  def getNotification(atomId: String, questionId: String): Either[AtomAPIError, Option[QuestionAnswers]] = {
    val key = Seq(
      "atomId" -> new AttributeValue().withS(atomId), 
      "questionId" -> new AttributeValue().withS(questionId)
    ).toMap.asJava
    val res = dynamoDB.getItem(new GetItemRequest(Config.notificationsDynamoTableName, key)).getItem.asScala
    
    Either.right(
      res
        .get("answers").map { as =>
          val bs = as.getL().asScala.map { a =>
            val m = a.getM().asScala
            for {
              path <- m.get("answerPath").map(_.getS)
              `type` <- m.get("answerType").map(_.getS)
            } yield Answer(path, `type`)
          }.flatten

          QuestionAnswers(atomId, questionId, bs)
        }
    )
  }
}