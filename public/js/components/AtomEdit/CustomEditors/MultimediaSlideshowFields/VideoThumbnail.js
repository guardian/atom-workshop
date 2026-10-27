import React from 'react';
import { PropTypes } from 'prop-types';
import { fetchCapiAtom } from '../../../../services/capi';
import { findSmallestAssetAboveWidth } from '../../../../util/imageHelpers';
import { logError } from '../../../../util/logger';

// Shared across slides, which all remount whenever the list is reordered.
const posterUrlRequests = {};

function fetchPosterUrl(mediaAtomId) {
  if (!posterUrlRequests[mediaAtomId]) {
    posterUrlRequests[mediaAtomId] = fetchCapiAtom('media', mediaAtomId)
      .then((atom) => {
        const media = atom.data.media;
        return media.posterImage
          ? findSmallestAssetAboveWidth(media.posterImage.assets, 100).file
          : media.posterUrl;
      })
      .catch((error) => {
        delete posterUrlRequests[mediaAtomId];
        throw error;
      });
  }
  return posterUrlRequests[mediaAtomId];
}

// Loads the poster once per mount, so render it with key={mediaAtomId}.
export class VideoThumbnail extends React.Component {
  static propTypes = {
    mediaAtomId: PropTypes.string.isRequired,
  };

  state = {
    posterUrl: null,
  };

  componentDidMount() {
    fetchPosterUrl(this.props.mediaAtomId)
      .then((posterUrl) => {
        if (!this.unmounted) {
          this.setState({ posterUrl });
        }
      })
      .catch((error) =>
        logError(
          `Could not load the poster for media atom ${this.props.mediaAtomId}`,
          error
        )
      );
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  render() {
    return (
      <span className="slide__thumbnail slide__thumbnail--video">
        {this.state.posterUrl ? (
          <img src={this.state.posterUrl} alt="" />
        ) : (
          false
        )}
      </span>
    );
  }
}
