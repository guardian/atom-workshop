package services

import com.gu.atom.publish.{AtomPublisher, LiveKinesisAtomPublisher, PreviewKinesisAtomPublisher}
import com.gu.contentatom.thrift.{Atom, ContentAtomEvent, EventType}
import config.{AWS, Config}
import models.{AtomAPIError, KinesisPublishingFailed}
import org.joda.time.DateTime
import play.api.Logging

import scala.util.{Failure, Success}

class AtomPublishers(config: Config) extends Logging {
  val liveAtomPublisher = new LiveKinesisAtomPublisher(config.liveKinesisStreamName, AWS.kinesisClient)
  val previewAtomPublisher = new PreviewKinesisAtomPublisher(config.previewKinesisStreamName, AWS.kinesisClient)

  def sendKinesisEvent(atom: Atom, atomPublisher: AtomPublisher, eventType: EventType): Either[AtomAPIError, Unit] = {
    if (config.kinesisEnabled) {
      val event = ContentAtomEvent(atom, eventType, DateTime.now.getMillis)
      atomPublisher.publishAtomEvent(event) match {
        case Success(_) =>
          logger.info(s"Successfully published ${atom.id} to kinesis with $eventType")
          Right(())
        case Failure(err) =>
          logger.error(s"Failed to publish ${atom.id} to kinesis with $eventType", err)
          Left(KinesisPublishingFailed)
      }
    } else {
      Right(())
    }
  }
}
