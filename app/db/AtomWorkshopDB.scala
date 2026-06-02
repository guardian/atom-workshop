package db

import com.gu.atom.data.{DataStoreResultUtil, DynamoDataStoreV2, IDNotFound, VersionConflictError}
import com.gu.contentatom.thrift.{Atom, AtomType}
import com.gu.pandomainauth.model.User
import models.{AtomAPIError, AtomWorkshopDynamoConflictError, AtomWorkshopDynamoDatastoreError, UnknownAtomError}
import play.api.Logging
import util.AtomLogic._

trait AtomWorkshopDBAPI extends Logging {

  def transformAtomLibResult[T](atomType: AtomType, id: String, result: DataStoreResultUtil.DataStoreResult[T]): Either[AtomAPIError, T] = result match {
    case Left(IDNotFound) => Left(UnknownAtomError(atomType, id))
    case Left(VersionConflictError(_)) => Left(AtomWorkshopDynamoConflictError)
    case Left(e) => Left(AtomWorkshopDynamoDatastoreError(e.msg))
    case Right(r) =>
      logger.info(s"Successfully updated atom of type ${atomType.name} with id $id")
      Right(r)
  }

  def createAtom(datastore: DynamoDataStoreV2, atomType: AtomType, user: User, atom: Atom): Either[AtomAPIError, Atom]

  def getAtom(datastore: DynamoDataStoreV2, atomType: AtomType, id: String): Either[AtomAPIError, Atom]

  def publishAtom(datastore: DynamoDataStoreV2, user: User, newVersion: Atom): Either[AtomAPIError, Atom]

  def updateAtom(datastore: DynamoDataStoreV2, atom: Atom): Either[AtomAPIError, Atom]

  def deleteAtom(datastore: DynamoDataStoreV2, atomType: AtomType, id: String): Either[AtomAPIError, Atom]
}

class AtomWorkshopDB() extends AtomWorkshopDBAPI with Logging {

  def createAtom(datastore: DynamoDataStoreV2, atomType: AtomType, user: User, atom: Atom): Either[AtomAPIError, Atom] = {
    logger.info(s"Attempting to create atom of type ${atomType.name} with id ${atom.id}")
    try {
      val result = datastore.createAtom(buildKey(atomType, atom.id), atom)
      logger.info(s"Successfully created atom of type ${atomType.name} with id ${atom.id}")
      transformAtomLibResult(atomType, atom.id, result)
    } catch {
      case e: Exception => processException(e)
    }
  }

  def getAtom(datastore: DynamoDataStoreV2, atomType: AtomType, id: String) =
    transformAtomLibResult(atomType, id, datastore.getAtom(buildKey(atomType, id)))

  def updateAtom(datastore: DynamoDataStoreV2, atom: Atom): Either[AtomAPIError, Atom] = {
    try {
      val result = datastore.updateAtom(atom)
      transformAtomLibResult(atom.atomType, atom.id, result)
    } catch {
      case e: Exception => processException(e)
    }
  }

  def publishAtom(datastore: DynamoDataStoreV2, user: User, newAtom: Atom): Either[AtomAPIError, Atom] = {

    def checkAtomExistsInDatastore(datastore: DynamoDataStoreV2, atomType: AtomType, id: String): Either[AtomAPIError, Boolean] =
      datastore.getAtom(buildKey(atomType, id)).fold({
        case IDNotFound => Right(false)
        case e => Left(AtomWorkshopDynamoDatastoreError(e.msg))
      }, _ => Right(true))

    checkAtomExistsInDatastore(datastore, newAtom.atomType, newAtom.id).fold(err => Left(err), result => {
      if (result) updateAtom(datastore, newAtom)
      else createAtom(datastore, newAtom.atomType, user, newAtom)
    })
  }

  def deleteAtom(datastore: DynamoDataStoreV2, atomType: AtomType, id: String) =
    transformAtomLibResult(atomType, id, datastore.deleteAtom(buildKey(atomType, id)))
}
