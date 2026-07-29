import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { MultimediaSlideshowEditor } from '../AtomEdit/CustomEditors/MultimediaSlideshowEditor';
import AtomEditHeader from '../AtomEdit/AtomEditHeader';
import AtomEmbed from '../AtomEmbed/AtomEmbed';

// NOTE: This is a temporary, frontend-only harness for previewing the
// Multimedia Slideshow editor UI before the backend (atom-workshop DB /
// content-atom library bump) supports the new atom type. It renders the
// editor against a mock atom held in local state, so it does NOT create,
// load or save anything via the backend. Remove once the atom type is
// supported end-to-end.

const mockAtom = {
  id: 'preview',
  atomType: 'multimediaslideshow',
  labels: [],
  defaultHtml: '',
  title: '',
  commissioningDesks: [],
  contentChangeDetails: {},
  data: {
    multimediaSlideshow: {
      slides: [],
      title: '',
    },
  },
};

// The embed panel expects workflow actions; in this harness they are no-ops
// because there is no backend atom to track.
const noopWorkflowActions = {
  getWorkflowStatus: () => Promise.resolve(),
  trackInWorkflow: () => {},
};

class MultimediaSlideshowPreview extends React.Component {
  static propTypes = {
    config: PropTypes.shape({
      gridUrl: PropTypes.string.isRequired,
      videoBaseUrl: PropTypes.string.isRequired,
      capiLiveUrl: PropTypes.string.isRequired,
      isEmbedded: PropTypes.bool.isRequired,
    }).isRequired,
  };

  state = {
    atom: mockAtom,
  };

  updateAtom = atom => {
    this.setState({ atom });
  };

  render() {
    return (
      <div className="atom">
        <AtomEmbed
          atom={this.state.atom}
          config={this.props.config}
          workflow="not_tracked"
          workflowActions={noopWorkflowActions}
        />
        <div className="atom__content">
          <div className="atom-editor">
            <AtomEditHeader atom={this.state.atom} onUpdate={this.updateAtom} />
            <form className="atom-editor__form">
              <MultimediaSlideshowEditor
                atom={this.state.atom}
                config={this.props.config}
                onUpdate={this.updateAtom}
                onFormErrorsUpdate={() => {}}
              />
            </form>
          </div>
          <div className="form">
            <div className="form__row">
              <h3 className="form__subheading">Atom data (live)</h3>
              <pre>{JSON.stringify(this.state.atom.data, null, 2)}</pre>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    config: state.config,
  };
}

export default connect(mapStateToProps)(MultimediaSlideshowPreview);
