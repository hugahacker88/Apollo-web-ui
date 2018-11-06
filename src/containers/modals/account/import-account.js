/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setModalData} from '../../../modules/modals';
import {NotificationManager} from 'react-notifications';
import InfoBox from '../../components/info-box'
import {Form, Text, TextArea, Number, Checkbox} from 'react-form';
import crypto from '../../../helpers/crypto/crypto';
import {setBodyModalParamsAction, saveSendModalState, openPrevModal} from "../../../modules/modals";
import {setAlert} from "../../../modules/modals";
import submitForm from "../../../helpers/forms/forms";
import {getAccountDataAction} from "../../../actions/login";
import {importAccountAction} from "../../../actions/account";
import classNames from "classnames";
import InputForm from "../../components/input-form";
import {CopyToClipboard} from "react-copy-to-clipboard";

import BackForm from '../modal-form/modal-form-container';

const mapStateToProps = state => ({
    account: state.account.account,
    modalData: state.modals.modalData,
    modalsHistory: state.modals.modalsHistory,
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    setAlert: (type, message) => dispatch(setAlert(type, message)),
    validatePassphrase: (passPhrase) => dispatch(crypto.validatePassphrase(passPhrase)),
    getAccountIdAsyncApl: (passPhrase) => dispatch(crypto.getAccountIdAsyncApl(passPhrase)),
    getAccountDataAction: (reqParams) => dispatch(getAccountDataAction(reqParams)),
    saveSendModalState: (Params) => dispatch(saveSendModalState(Params)),
	openPrevModal: () => dispatch(openPrevModal()),
});

class ImportAccount extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            generatedPassphrase: null,
            generatedAccount: null,
            isValidating: false,
            isAccountLoaded: false
        }
    };

    componentWillReceiveProps(newProps) {
        if (newProps.account) {
            this.props.closeModal();
        }
    }

    handleFormSubmit = async (values) => {

        const importAccount = await importAccountAction(values);

        if (importAccount) {
            if (importAccount.errorCode) {
                NotificationManager.error(importAccount.errorDescription, 'Error', 5000);
            } else {
                this.setState({
                    isGenerated: true,
                    importAccount
                });
            }
        }
    };

    goToValidation = () => {
        this.setState({
            isValidating: true
        })
    }

    hnandleEnterAccount = (values) => {
        if (values.account !== this.state.importAccount.accountRS) {
            NotificationManager.error('Account do not match each other', 'Error', 5000);
            return;
        }
        if (values.passphrase !== this.state.importAccount.passphrase) {
            NotificationManager.error('Your entered secret phrase do not match the generated one', 'Error', 5000);
            return;
        }

        this.setState({
            isPending: true
        })

        const account = this.props.getAccountDataAction({account: values.account});
    }


    componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({ hasError: true });
        // You can also log the error to an error reporting service
    }

    render() {
        if (this.state.hasError) {
            return (<h2>Oops something went wrong. Please reload page</h2>)
        } else {
            return (
                <div className="modal-box">
                    {
                        !this.state.isValidating &&
                        <BackForm
	                        nameModal={this.props.nameModal}
                            onSubmit={(values) => this.handleFormSubmit(values)}
                            render={({submitForm, values, addValue, removeValue, getFormState}) => (
                                <form className="modal-form" onChange={() => this.props.saveSendModalState(values)} onSubmit={submitForm}>

                                    <div className="form-group-app">
                                        <a onClick={() => this.props.closeModal()} className="exit"><i
                                            className="zmdi zmdi-close"/></a>

                                        <div className="form-title">
	                                        {this.props.modalsHistory.length > 1 &&
	                                        <div className={"backMy"} onClick={() => {this.props.openPrevModal()}}></div>
	                                        }
                                            <p>Import Account</p>
                                        </div>
                                        <InfoBox info>
                                            Please enter your account secret key.
                                        </InfoBox>

                                        <React.Fragment>

                                            <div className="form-group row form-group-grey mb-15">
                                                <label className="col-sm-3 col-form-label align-self-start">
                                                    Secret Key
                                                </label>
                                                <div className="col-sm-9">
                                                    <TextArea className="form-control" placeholder="Secret Key" field="secretBytes" cols="30" rows="3" />
                                                </div>
                                            </div>

                                            {
                                                this.state &&
                                                this.state.importAccount &&
                                                <InfoBox attentionLeft>
                                                    Secret Phrase:  <span className={'itatic'}>{this.state.importAccount.passphrase}</span>
                                                    <br/>
                                                    <br/>
                                                    Account ID: <span className={'itatic'}>{this.state.importAccount.accountRS}</span>
                                                    <br/>
                                                    <br/>
                                                    <CopyToClipboard
                                                        text={
                                                            `Secret Phrase: ${this.state.importAccount.passphrase}\n` +
                                                            `Account ID: ${this.state.importAccount.accountRS}\n`
                                                        }
                                                        onCopy={() => {
                                                            NotificationManager.success('The account data has been copied to clipboard.')
                                                        }}
                                                    >
                                                        <a
                                                            className="btn blue static"
                                                        >
                                                            Copy account data to clipboard.
                                                        </a>
                                                    </CopyToClipboard>
                                                </InfoBox>
                                            }
                                            {
                                                this.state &&
                                                this.state.importAccount &&
                                                <InfoBox danger>
                                                    <strong>Remember</strong> to store your Account ID, secret phrase, and Secret Key in a secured place.
                                                    Make sure to write down this secret phrase and store it securely (the secret phrase is order and case sensitive). This secret phrase is needed to use your wallet.
                                                </InfoBox>
                                            }
                                            <div className="btn-box align-buttons-inside absolute right-conner">


                                                {
                                                    !this.state.isGenerated &&
                                                    <button
                                                        type="submit"
                                                        name={'closeModal'}
                                                        className="btn absolute btn-right blue round round-top-left round-bottom-right"
                                                    >
                                                        Restore account
                                                    </button>
                                                }
                                                {
                                                    this.state.isGenerated &&
                                                    <a
                                                        onClick={() => this.props.closeModal()}
                                                        name={'closeModal'}
                                                        className="btn absolute btn-right default round round-top-left round-bottom-right"
                                                    >
                                                        Close
                                                    </a>
                                                }

                                            </div>
                                        </React.Fragment>


                                    </div>
                                </form>
                            )}
                        />
                    }
                    {
                        this.state.isValidating &&
                        <div className="modal-form">
                            <Form
                                onSubmit={(values) => this.hnandleEnterAccount(values)}
                                render={({
                                             submitForm, setValue, values, getFormState
                                         }) => (
                                    <form
                                        className={classNames({
                                            "tab-body": true,
                                            "active": this.state.activeTab === 0
                                        })}
                                        onSubmit={submitForm}
                                    >

                                        <div className="form-group-app">
                                            <div className="form-title">
                                                <p>Restore Your Wallet</p>
                                            </div>

                                            <div className="form-group row form-group-white mb-15">
                                                <label className="col-sm-3 col-form-label">
                                                    Account
                                                </label>
                                                <div className="col-sm-9">
                                                    <InputForm
                                                        type="text"
                                                        field="account"
                                                        placeholder="Account ID"
                                                        setValue={setValue}
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group row form-group-white mb-15">
                                                <label className="col-sm-3 col-form-label">
                                                    Secret phrase
                                                </label>
                                                <div className="col-sm-9">
                                                    <InputForm
                                                        type="password"
                                                        field="passphrase"
                                                        placeholder="Secret Phrase"
                                                        setValue={setValue}
                                                    />
                                                </div>
                                            </div>

                                            <div className="btn-box align-buttons-inside absolute right-conner">
                                                <button
                                                    style={{
                                                        width: 121.5
                                                    }}
                                                    type="submit"
                                                    name={'closeModal'}
                                                    className="btn absolute btn-right blue round round-top-left round-bottom-right"
                                                >
                                                    Confirm restore
                                                </button>

                                                {
                                                    !!this.state.isPending ?
                                                        <div
                                                            style={{
                                                                width: 121.5
                                                            }}
                                                            className="btn absolute btn-right blue round round-top-left round-bottom-right"
                                                        >
                                                            <div className="ball-pulse">
                                                                <div></div>
                                                                <div></div>
                                                                <div></div>
                                                            </div>
                                                        </div> :
                                                        <button

                                                            type="submit"
                                                            name={'closeModal'}
                                                            className="btn absolute btn-right blue round round-top-left round-bottom-right"
                                                        >
                                                            Create new Account
                                                        </button>
                                                }

                                            </div>
                                        </div>

                                    </form>
                                )}
                            />
                        </div>
                    }
                </div>
            );
        }

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImportAccount);