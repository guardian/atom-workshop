import React from 'react';
import {PropTypes} from 'prop-types';

export default class Modal extends React.Component {

    static propTypes = {
      isOpen: PropTypes.bool.isRequired,
      dismiss: PropTypes.func.isRequired,
      children: PropTypes.element.isRequired
    };

    preventClosingClick (event) {
        event.stopPropagation();
    }

    render() {
        if(!this.props.isOpen) {
            return false;
        }

        return (
            <div className="modal" onClick={this.props.dismiss}>
                <div className="modal__content" onClick={this.preventClosingClick}>
                    <div className="modal__content__header">
                        <button className="i-cross modal__dismiss" onClick={this.props.dismiss}>
                            Close
                        </button>
                    </div>
                    {this.props.children}
                </div>
            </div>
        );

    }
}
