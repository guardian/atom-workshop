package controllers

import com.gu.contentapi.client.IAMSigner
import config.{AWS, Config}
import play.api.Logging
import play.api.libs.ws.WSClient
import play.api.mvc.{BaseController, ControllerComponents, Result}

import java.net.URI
import scala.concurrent.Future

class Support(val controllerComponents: ControllerComponents, val wsClient: WSClient, config: Config, val pandaAuthActions: PanDomainAuthActions) extends BaseController with Logging {
  import pandaAuthActions.APIAuthAction

  implicit val executionContext = controllerComponents.executionContext

  private val signer = new IAMSigner(
    credentialsProvider = config.capiPreviewCredentials,
    awsRegion = AWS.region.getName
  )

  private def getHeaders(url: String): Seq[(String,String)] = signer.addIAMHeaders(headers = Map.empty, uri = URI.create(url)).toSeq

  def capiProxy(path: String) = APIAuthAction.async { request =>
    query(s"${config.capiLiveUrl}/$path?api-key=${config.capiApiKey}&${request.rawQueryString}", Seq.empty)
  }

  def previewCapiProxy(path: String) = APIAuthAction.async { request =>
    val url = s"${config.capiPreviewIAMUrl}/$path?${request.rawQueryString}"
    query(url, getHeaders(url))
  }

  def query(url: String, headers: Seq[(String, String)]): Future[Result] = {
    val req = wsClient
      .url(url)
      .withHttpHeaders(headers: _*)
      .get()

    req.map(response => response.status match {
      case 200 => Ok(response.json)
      case _ =>
        logger.warn(s"CAPI error response: ${response.status} / ${response.body}")
        BadGateway(s"CAPI returned error code ${response.status}")
    })
  }
}
