package db

import com.gu.atom.data._
import com.gu.atom.publish.{PreviewKinesisAtomReindexer, PublishedKinesisAtomReindexer}
import config.Config
import models.{Live, Preview, Version}

class AtomDataStores(config: Config) {
  def getDataStore(version: Version): DynamoDataStore = version match {
    case Live => publishedDataStore
    case Preview => previewDataStore
  }

  val previewDataStore = new PreviewDynamoDataStore(config.dynamoDB, config.previewDynamoTableName)
  val publishedDataStore = new PublishedDynamoDataStore(config.dynamoDB, config.publishedDynamoTableName)
  
  val explainerPreviewDataStore = new PreviewDynamoDataStore(config.dynamoDB, config.explainerPreviewDynamoTableName)
  val explainerPublishedDataStore = new PublishedDynamoDataStore(config.dynamoDB, config.explainerPublishedDynamoTableName)

  val reindexPreview: PreviewKinesisAtomReindexer =
    new PreviewKinesisAtomReindexer(config.previewReindexKinesisStreamName, config.kinesisClient)

  val reindexPublished: PublishedKinesisAtomReindexer =
    new PublishedKinesisAtomReindexer(config.liveReindexKinesisStreamName, config.kinesisClient)
}