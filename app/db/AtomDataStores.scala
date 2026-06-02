package db

import com.gu.atom.data._
import com.gu.atom.publish.{PreviewKinesisAtomReindexerV2, PublishedKinesisAtomReindexerV2}
import config.{AWS, Config}
import models.{Live, Preview, Version}

class AtomDataStores(config: Config) {
  def getDataStore(version: Version): DynamoDataStoreV2 = version match {
    case Live => publishedDataStore
    case Preview => previewDataStore
  }

  val previewDataStore = new PreviewDynamoDataStoreV2(AWS.dynamoDbClient, config.previewDynamoTableName)
  val publishedDataStore = new PublishedDynamoDataStoreV2(AWS.dynamoDbClient, config.publishedDynamoTableName)

  val reindexPreview = new PreviewKinesisAtomReindexerV2(config.previewReindexKinesisStreamName, AWS.kinesisClient)

  val reindexPublished = new PublishedKinesisAtomReindexerV2(config.liveReindexKinesisStreamName, AWS.kinesisClient)
}