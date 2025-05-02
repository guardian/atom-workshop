package util

import com.gu.contentatom.thrift.atom.cta.CTAAtom
import com.gu.contentatom.thrift.atom.qanda.{QAndAAtom, QAndAItem}
import com.gu.contentatom.thrift.atom.profile.ProfileAtom
import com.gu.contentatom.thrift.atom.guide.GuideAtom
import com.gu.contentatom.thrift.atom.timeline.TimelineAtom
import com.gu.contentatom.thrift.atom.explainer.{DisplayType, ExplainerAtom}
import com.gu.contentatom.thrift.atom.commonsdivision.{CommonsDivision, Votes}
import com.gu.contentatom.thrift.atom.audio.{AudioAtom, OffPlatform}
import com.gu.contentatom.thrift.{User, _}
import com.gu.pandomainauth.model.{User => PandaUser}
import models.CreateAtomFields
import org.joda.time.{DateTime, DateTimeZone}
import org.joda.time.format.DateTimeFormat

object AtomElementBuilders {

  def buildContentChangeDetails(user: PandaUser, existingContentChangeDetails: Option[ContentChangeDetails], updateCreated: Boolean = false,
    updateLastModified: Boolean = false, updatePublished: Boolean = false, updateTakenDown: Boolean = false): ContentChangeDetails = {

    def pandaUserToAtomUser(user: PandaUser): User = {
      User(user.email, Some(user.firstName), Some(user.lastName))
    }
    def buildChangeRecord(existingRecord: Option[ChangeRecord], shouldUpdate: Boolean) = {
      if (shouldUpdate) {
        Some(ChangeRecord(DateTime.now.getMillis, user=Some(pandaUserToAtomUser(user))))
      } else if (existingRecord.isDefined) existingRecord else None
    }
    ContentChangeDetails(
      created      = buildChangeRecord(existingContentChangeDetails.flatMap(_.created)     , updateCreated),
      lastModified = buildChangeRecord(existingContentChangeDetails.flatMap(_.lastModified), updateLastModified),
      published    = buildChangeRecord(existingContentChangeDetails.flatMap(_.published)   , updatePublished),
      takenDown    = buildChangeRecord(existingContentChangeDetails.flatMap(_.takenDown)   , updateTakenDown),
      revision     = existingContentChangeDetails.map(_.revision).getOrElse(0L) + 1
    )
  }

  def buildDefaultAtom(atomType: AtomType, user: PandaUser, createAtomFields: Option[CreateAtomFields]): Atom = {
    val title = createAtomFields.flatMap(_.title).getOrElse("-")
    val id = createAtomFields.flatMap(_.id).getOrElse(java.util.UUID.randomUUID.toString)

    val defaultAtoms: Map[AtomType, AtomData] = Map(
      AtomType.Cta -> AtomData.Cta(CTAAtom("-")),
      AtomType.Explainer -> AtomData.Explainer(ExplainerAtom(title, "-", DisplayType.Flat)),
      AtomType.Qanda -> AtomData.Qanda(QAndAAtom(Some("Q&A"), None, QAndAItem(None, "Body"))),
      AtomType.Guide -> AtomData.Guide(GuideAtom(None, None, Nil)),
      AtomType.Profile -> AtomData.Profile(ProfileAtom(None, None, Nil, None)),
      AtomType.Timeline -> AtomData.Timeline(TimelineAtom()),
      AtomType.Commonsdivision -> AtomData.CommonsDivision(CommonsDivision("-", None, DateTime.now.getMillis, Votes())),
      AtomType.Audio -> AtomData.Audio(AudioAtom(
        kicker = title,
        coverUrl = "-",
        trackUrl = "-",
        duration = 0,
        contentId = "-",
        offPlatformLinks = None
      ))
    )

    Atom(
      title = createAtomFields.flatMap(_.title),
      commissioningDesks = createAtomFields.map(_.commissioningDesks).getOrElse(Nil),
      id = id,
      atomType = atomType,
      defaultHtml = createAtomFields.flatMap(_.defaultHtml).getOrElse(buildDefaultHtml(atomType = atomType, atomData = defaultAtoms(atomType))),
      data = defaultAtoms(atomType),
      contentChangeDetails = buildContentChangeDetails(user, None, updateCreated = true)
    )
  }

  def buildDefaultHtml(atomType: AtomType, atomData: AtomData): String = {
    s"""<div class="atom-${atomType.name}">${buildHtml(atomType, atomData).getOrElse("")}</div>"""
  }

  def buildHtml(atomType: AtomType, atomData: AtomData): Option[String] = atomData match {
    case x: AtomData.Guide          => buildGuideHtml(x.guide)
    case x: AtomData.Profile        => buildProfileHtml(x.profile)
    case x: AtomData.Qanda          => buildQAndAHtml(x.qanda)
    case x: AtomData.Timeline       => buildTimelineHtml(x.timeline)
    case _ => None
  }

  def buildGuideHtml(atom: GuideAtom): Option[String] =
    Some(
      atom.items.map{ item =>
        item.title.map(title => s"<p><strong>$title</strong></p>").getOrElse("") ++
        s"<p>${item.body}</p>"
      }.mkString("")
    )

  def buildProfileHtml(atom: ProfileAtom): Option[String] =
    Some(
      atom.items.map{ item =>
        item.title.map(title => s"<p><strong>$title</strong></p>").getOrElse("") ++
        s"<p>${item.body}</p>"
      }.mkString("")
    )

  def buildQAndAHtml(atom: QAndAAtom): Option[String] =
    Some(atom.item).map { item =>
      item.title.map(title => s"<p><strong>$title</strong></p>").getOrElse("") ++
      s"<p>${item.body}</p>"
    }

  def buildTimelineHtml(atom: TimelineAtom): Option[String] =
    Some(
      atom.events.map{ item =>
        val date = new DateTime(item.date)
        s"<p><i>(${DateTimeFormat.longDate.print(date)})</i>&nbsp;<strong>${item.title}</strong></p>" ++
        item.body.map(body => s"<p>${body}</p>").getOrElse("")
      }.mkString("")
    )
}
