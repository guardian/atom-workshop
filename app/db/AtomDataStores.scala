package db

import com.gu.atom.data._
import com.gu.atom.reindex.{DynamoReindexDataStoreV2, PreviewKinesisAtomReindexerV2, PublishedKinesisAtomReindexerV2}
import config.{AWS, Config}
import models.{Live, Preview, Version}

class AtomDataStores(config: Config) {
  def getDataStore(version: Version): DynamoDataStoreV2 = version match {
    case Live => publishedDataStore
    case Preview => previewDataStore
  }

  val previewDataStore = new PreviewDynamoDataStoreV2(AWS.dynamoDbClient, config.previewDynamoTableName)
  val publishedDataStore = new PublishedDynamoDataStoreV2(AWS.dynamoDbClient, config.publishedDynamoTableName)

  val previewReindexStore = new DynamoReindexDataStoreV2(AWS.dynamoDbClient, config.previewReindexDynamoTableName)
  val publishedReindexStore = new DynamoReindexDataStoreV2(AWS.dynamoDbClient, config.publishedReindexDynamoTableName)

  val previewReindexer = new PreviewKinesisAtomReindexerV2(
    streamName = config.previewReindexKinesisStreamName,
    kinesis = AWS.kinesisClient,
    atomDataStore = previewDataStore,
    reindexDataStore = previewReindexStore)

  val publishedReindexer = new PublishedKinesisAtomReindexerV2(
    streamName = config.liveReindexKinesisStreamName,
    kinesis = AWS.kinesisClient,
    atomDataStore = publishedDataStore,
    reindexDataStore = publishedReindexStore)

}