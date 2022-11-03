package services

import com.gu.atom.publish.{AtomPublisher, LiveKinesisAtomPublisher, PreviewKinesisAtomPublisher}
import com.gu.contentatom.thrift.{Atom, ContentAtomEvent, EventType}
import config.Config
import models.{AtomAPIError, KinesisPublishingFailed}
import org.joda.time.DateTime
import play.api.Logger

import scala.util.{Failure, Success}

class AtomPublishers(config: Config) {
  val liveAtomPublisher = new LiveKinesisAtomPublisher(config.liveKinesisStreamName, config.kinesisClient)
  val previewAtomPublisher = new PreviewKinesisAtomPublisher(config.previewKinesisStreamName, config.kinesisClient)

  def sendKinesisEvent(atom: Atom, atomPublisher: AtomPublisher, eventType: EventType): Either[AtomAPIError, Unit] = {
    if (config.kinesisEnabled) {
      val event = ContentAtomEvent(atom, eventType, DateTime.now.getMillis)
      atomPublisher.publishAtomEvent(event) match {
        case Success(_) =>
          Logger.info(s"Successfully published ${atom.id} to kinesis with $eventType")
          Right(())
        case Failure(err) =>
          Logger.error(s"Failed to publish ${atom.id} to kinesis with $eventType", err)
          Left(KinesisPublishingFailed)
      }
    } else {
      Right(())
    }
  }
}
