/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {setBodyModalParamsAction} from "../../../../modules/modals";
import {connect} from 'react-redux';
import crypto from '../../../../helpers/crypto/crypto'
import {formatTimestamp} from "../../../../helpers/util/time";
import submitForm from "../../../../helpers/forms/forms";

const mapStateToProps = state => ({
    account: state.account
});

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    tryToDecryptMessageAPL: (data, options) => dispatch(crypto.tryToDecryptMessageAPL(data, options)),
    formatTimestamp: (time) => dispatch(formatTimestamp(time)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
});

class MessageItem extends React.Component {
    state = {
        message: null
    };

    componentWillReceiveProps(newProps) {
        if (newProps.account.passPhrase !== this.props.account.passPhrase) {
            this.tryToDecrypt(newProps);
        }
    }

    tryToDecrypt = (newState) => {
        if (newState.account.passPhrase) {
            this.decryptMessage(this.props, newState.account.passPhrase);
        }
    };

    decryptMessage = async (data, passPhrase) => {
        if (passPhrase) {
            const message = await this.props.submitForm({
                requestType: 'readMessage',
                secretPhrase: passPhrase,
                transaction: this.props.transaction,
                createNoneTransactionMethod: true
            }, 'readMessage');

            if (message) {
                this.setState({
                    message: message.decryptedMessage
                });
            }
        }
    };

    render() {
        const {
            publicMessage,
            decryptedMessage,
            messageIsPrunable,
            transaction,
            recipient,
            sender,
            recipientRS,
            senderRS,
            timestamp,
            isDescrypted,
            attachment,

            formatTimestamp,
            setBodyModalParamsAction
        } = this.props;
        
        return (
            <tr>
                <></>
                <td className="blue-link-text">{formatTimestamp(timestamp)}</td>
                <td className="blue-link-text">
                    <a onClick={() => setBodyModalParamsAction('INFO_ACCOUNT', sender)}>{senderRS}</a>
                </td>
                <td className="blue-link-text">
                    <a onClick={() => setBodyModalParamsAction('INFO_ACCOUNT', recipient)}>{recipientRS}</a>
                </td>
               <td>
                    {
                        publicMessage && 
                        publicMessage
                    }
                    {
                        isDescrypted && 
                        decryptedMessage && 
                        decryptedMessage !== 'false' && 
                        <div>
                            <i className="zmdi zmdi-lock-open"/>&nbsp;&nbsp;&nbsp;<span>{decryptedMessage}</span>
                        </div>
                    }
                    {
                        isDescrypted &&
                        !publicMessage &&
                        !decryptedMessage &&
                        <div>
                            <i className="zmdi zmdi-alert-triangle"/>&nbsp;&nbsp;&nbsp;
                            <span>Empty Message.</span>
                        </div>
                    }
                    {
                        isDescrypted &&
                        !publicMessage &&
                        !decryptedMessage &&
                        <div>
                            <i className="zmdi zmdi-scissors"/>
                                &nbsp;&nbsp;&nbsp;
                            <span>Message is pruned.</span>
                        </div>
                    }
                    {
                        !isDescrypted &&
                        !publicMessage &&
                        !decryptedMessage &&
                        <>
                            <a
                                onClick={() => setBodyModalParamsAction('DECRYPT_MESSAGES')}
                            >
                                < i className="zmdi zmdi-lock" />
                            </a>
                            <span className="message-text">&nbsp;&nbsp;Message is encrypted</span>
                        </>
                    }
                    
                </td>
                <td className="align-right">
                    <div className={'btn-box inline'}>
                        {
                            !isDescrypted &&
                            !publicMessage &&
                            !decryptedMessage &&
                            <button
                                type={'button'}
                                onClick={() => setBodyModalParamsAction('DECRYPT_MESSAGES')}
                                className="btn btn-default"
                            >
                                Decrypt
                            </button>
                        }
                    </div>
                </td>
            </tr>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageItem);