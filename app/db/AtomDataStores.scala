package db

import com.gu.atom.data._
import com.gu.atom.publish.{PreviewKinesisAtomReindexer, PublishedKinesisAtomReindexer}
import config.{AWS, Config}
import models.{Live, Preview, Version}

class AtomDataStores(config: Config) {
  def getDataStore(version: Version): DynamoDataStore = version match {
    case Live => publishedDataStore
    case Preview => previewDataStore
  }

  val previewDataStore = new PreviewDynamoDataStore(AWS.dynamoDB, config.previewDynamoTableName)
  val publishedDataStore = new PublishedDynamoDataStore(AWS.dynamoDB, config.publishedDynamoTableName)
  
  val explainerPreviewDataStore = new PreviewDynamoDataStore(AWS.dynamoDB, config.explainerPreviewDynamoTableName)
  val explainerPublishedDataStore = new PublishedDynamoDataStore(AWS.dynamoDB, config.explainerPublishedDynamoTableName)

  val reindexPreview: PreviewKinesisAtomReindexer =
    new PreviewKinesisAtomReindexer(config.previewReindexKinesisStreamName, AWS.kinesisClient)

  val reindexPublished: PublishedKinesisAtomReindexer =
    new PublishedKinesisAtomReindexer(config.liveReindexKinesisStreamName, AWS.kinesisClient)
}