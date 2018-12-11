/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import InputMask from 'react-input-mask';
import classNames from 'classnames';
import {NotificationManager} from "react-notifications";
import uuid from "uuid";
import {connect} from 'react-redux';

class AccountRS extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            contacts: JSON.parse(localStorage.getItem('APLContacts')),
            inputValue: {
                mask: `${this.props.constants ? this.props.constants.accountPrefix : ''}-****-****-****-*****`,
                value: this.props.defaultValue || ''
            },
            isContacts: false
        };
        this.props.setValue(this.props.field, this.props.defaultValue);
    };

    handleFillForm = (account) => {
        this.props.setValue(this.props.field, account);
        this.refs.input.value = account;
        this.setState({
            isContacts: false,
            inputValue: {
                mask: `${this.props.constants ? this.props.constants.accountPrefix : ''}-****-****-****-*****`,
                value: account
            }
        })
    };

    handleContacts = () => {
        if (this.state.contacts && !!this.state.contacts.length) {
            this.setState({
                isContacts: !this.state.isContacts
            })
        } else {
            NotificationManager.info('You have an empty contacts list.', null, 5000)
        }
    };

    setInputValue = (value) => {
        const newState = {
            mask: `${this.props.constants ? this.props.constants.accountPrefix : ''}-****-****-****-*****`,
            value: value.toUpperCase()
        };


        this.props.setValue(this.props.field, value.indexOf(`${this.props.constants ? this.props.constants.accountPrefix : ''}-`) === -1 ? 'APl-' + value : value);
        this.setState({inputValue: newState});
    };

    onChange = (event) => {
        let value;

        if (event.type === 'paste') {
            value = event.clipboardData.getData('text/plain');

            if (value.includes(`${this.props.constants ? this.props.constants.accountPrefix : ''}-`) && value.indexOf(`${this.props.constants ? this.props.constants.accountPrefix : ''}-`) === 0) {
                value = value.replace(`${this.props.constants ? this.props.constants.accountPrefix : ''}-`, '');

                this.setInputValue(value);
            }
        } else {
            value = event.target.value;
            if (value.indexOf('APL-APL') === -1) {

                this.setInputValue(value);
            }
        }
        // event.stopPropagation();
    };

    render () {

        console.log(this.props.constants ? this.props.constants.accountPrefix : '');
        console.log(this.props.constants);
        return (
            <React.Fragment>
                {this.state.inputValue &&
                    <InputMask className="form-control"
                               disabled={this.props.disabled}
                               mask={this.state.inputValue.mask}
                               placeholder={this.props.placeholder || 'Account ID'}
                               ref={'input'}
                               value={this.state.inputValue.value}
                               onPaste={this.onChange}
                               onChange={this.onChange}
                    />
                }
                {!this.props.noContactList &&
                    <a
                        onClick={() => this.handleContacts()}
                        className="input-icon"
                    >
                        <i className="zmdi zmdi-account"/>
                    </a>
                }
                {this.state.contacts &&
                    <div
                        className={classNames({
                            'contacts-list': true,
                            'active': this.state.isContacts
                        })}
                    >
                        <ul>
                            {
                                this.state.contacts.map((el, index) => {
                                    return (
                                        <li key={uuid()}>
                                            <a onClick={() => this.handleFillForm(el.accountRS)}>
                                                {el.name}
                                            </a>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                }
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    constants: state.account.constants
})

export default connect(mapStateToProps)(AccountRS) ;