import React from 'react';
import {PropTypes} from 'prop-types';
import {ManualDataInput} from "./ManualDataInput";

//REDUX CONNECTIONS
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAudioPageData } from '../../../../actions/AtomActions/getAudioPageData.js';
import {atomPropType} from "../../../../constants/atomPropType";


class AutomaticDataFetch extends React.Component {

  static propTypes = {
    getAudioPageData: PropTypes.func,
    onUpdate: PropTypes.func.isRequired,
    onFormErrorsUpdate: PropTypes.func,
    error: PropTypes.string,
    audioPageData: PropTypes.object,
    atom: atomPropType.isRequired,
  };

  state = {
    audioPageUrl: '',
    urlError: ''
  };

  getAudioDataFromCapi () {
    if(this.checkUrlIsAudioPage(this.state.audioPageUrl)){
      this.props.getAudioPageData(this.state.audioPageUrl, this.props.atom);
      this.setState({urlError: ''});
    } else {
      this.setState({urlError: 'The url is not a valid Guardian audio page'});
    }
  }

  checkUrlIsAudioPage (url) {
    return url.startsWith('https://www.theguardian.com') && url.includes('audio');
  }

  handleChange (e) {
    this.setState({audioPageUrl: e.target.value});
  }

  render () {
    return (
      <div>
        <div className="audio--automatic-selection-box">
          <h3>Get audio data automatically</h3>
          <label>Paste the url of a Guardian audio page</label>
          <input id="audio-url" className="form__field" type="text" value={this.state.audioPageUrl} onChange={this.handleChange.bind(this)}></input>
          <button type="button" className="form__btn-heading__btn" onClick={this.getAudioDataFromCapi.bind(this)}>Get values</button>
          { this.state.urlError ? (<p>{ this.state.urlError }</p>) : null }
          <p>{ this.props.audioPageData ? this.props.audioPageData.message : "" }</p>

        </div>

        <div className="audio--manual-selection-box">
          <h3>Or manually add the data in here</h3>
          <ManualDataInput atom={this.props.atom} onUpdate={this.props.onUpdate} />
        </div>
      </div>
    );
  }
}

/* REDUX FUNCTIONS */

function mapStateToProps(state) {
  return {
    config: state.config,
    audioPageUrl: state.audioPageUrl,
    audioPageData: state.audioPageData,
    atom: state.atom
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getAudioPageData: bindActionCreators(getAudioPageData, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AutomaticDataFetch);
