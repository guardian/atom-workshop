package controllers

import com.gu.atom.data.DynamoDataStore
import com.gu.atom.publish.{AtomReindexer, PreviewAtomReindexer, PublishedAtomReindexer}
import db.ExplainerDBAPI
import play.api.Configuration
import play.api.libs.ws.WSClient
import play.api.mvc.{Action, ActionBuilder, AnyContent, BaseController, BodyParser, ControllerComponents, Request, Result}
import com.gu.contentatom.thrift.{ContentAtomEvent, EventType}
import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success, Try}
import play.api.libs.json.Json
import play.api.Logger

class ExplainerReindexController(
  val wsClient: WSClient,
  explainerDB: ExplainerDBAPI,
  previewDataStore: DynamoDataStore,
  publishedDataStore: DynamoDataStore,
  previewReindexer: PreviewAtomReindexer,
  publishedReindexer: PublishedAtomReindexer,
  config: Configuration,
  val controllerComponents: ControllerComponents
)(implicit ec: ExecutionContext) extends BaseController with PanDomainAuthActions {

  var lastPublished: Int = 0
  var lastPreview: Int = 0

  override protected val executionContext = controllerComponents.executionContext

  override protected val parser: BodyParser[AnyContent] = controllerComponents.parsers.defaultBodyParser

  // Copy-pasted from the atom-maker library
  object ApiKeyAction extends ActionBuilder[Request, AnyContent] {
    lazy val apiKey = config.getString("reindexApiKey").get

    def invokeBlock[A](request: Request[A], block: (Request[A] => Future[Result])) = {
      if(request.getQueryString("api").contains(apiKey))
        block(request)
      else
        Future.successful(Unauthorized(""))
    }

    override def parser: BodyParser[AnyContent] = controllerComponents.parsers.defaultBodyParser

    override protected def executionContext: ExecutionContext = controllerComponents.executionContext
  }

  def reindex(stack: String): Action[AnyContent] = ApiKeyAction.async { req => 
    stack match {
      case "preview" => run(previewDataStore, previewReindexer).andThen(updateState(true)) map displayResult recover displayError(stack)
      case "published" => run(publishedDataStore, publishedReindexer).andThen(updateState(false)) map displayResult recover displayError(stack)
      case x => Future.successful(BadRequest(s"$x is not a valid stack identifier"))
    }
  }

  def status(stack: String): Action[AnyContent] = ApiKeyAction { req =>
    stack match {
      case "preview" => displayResult(lastPreview)
      case "published" => displayResult(lastPublished)
      case x => BadRequest(s"$x is not a valid stack identifier")
    }
  }

  private def run(datastore: DynamoDataStore, reindexer: AtomReindexer): Future[Int] = {
    explainerDB.listAtoms(datastore).fold(
      apiError => Future.failed(new RuntimeException(apiError.msg)),
      { atoms =>
        val timestamp = System.currentTimeMillis
        val events = atoms.map(ContentAtomEvent(_, EventType.Update, timestamp))
        reindexer.startReindexJob(events.iterator, events.size).execute
      }
    )
  }

  private def updateState(isPreview: Boolean): PartialFunction[Try[Int], _] = {
    case Success(x) => if (isPreview) lastPreview = x else lastPublished = x
  }

  private def displayResult(result: Int): Result =
    Ok(Json.parse(s"""{ "status": "completed", "documentsIndexed": $result, "documentsExpected": $result }"""))

  private def displayError(stack: String): PartialFunction[Throwable, Result] = {
    case x: Throwable => 
      Logger.error(s"Failed to reindex $stack explainer atoms", x)
      InternalServerError(Json.parse(s"""{ "status": "failed", "documentsIndexed": 0, "documentsExpected": 0 }"""))
  }
}
