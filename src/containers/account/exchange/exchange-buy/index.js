import React from 'react';
import {connect} from "react-redux";
import {Form} from "react-form";
import {NotificationManager} from "react-notifications";
import InputForm from '../../../components/input-form';
import {currencyTypes, formatCrypto, multiply} from "../../../../helpers/format";
import {createOffer} from "../../../../actions/wallet";
import {setBodyModalParamsAction} from "../../../../modules/modals";

class ExchangeBuy extends React.Component {
    feeATM = 200000000;
    state = {
        form: null,
        currentCurrency: null,
    };

    static getDerivedStateFromProps(props, state) {
        if (props.currentCurrency.currency !== state.currentCurrency) {
            if(state.form) state.form.resetAll();
            return {
                currentCurrency: props.currentCurrency.currency,
            };
        }

        return null;
    }

    handleFormSubmit = (values) => {
        if (this.props.wallet) {
            if (values.offerAmount > 0 && values.pairRate > 0) {
                const pairRate = multiply(values.pairRate, 100000000);
                const offerAmount = multiply(values.offerAmount, 100000000);
                const balanceETH = this.props.wallet.wallets[0].balance / Math.pow(10, 18);
                const balanceAPL = (this.props.dashboardAccoountInfo && this.props.dashboardAccoountInfo.unconfirmedBalanceATM) ?
                    parseFloat(this.props.dashboardAccoountInfo.unconfirmedBalanceATM)
                    :
                    parseFloat(this.props.balanceAPL);

                if (balanceETH === 0 || balanceETH < values.total) {
                    NotificationManager.error(`Not enough founds on your ${this.props.wallet.currency.toUpperCase()} balance.`, 'Error', 5000);
                    return;
                }
                if (!this.props.balanceAPL || balanceAPL === 0 || balanceAPL < this.feeATM) {
                    NotificationManager.error('Not enough founds on your APL balance. You need to pay 2 APL fee.', 'Error', 5000);
                    return;
                }

                const params = {
                    offerType: 0, // BUY
                    pairCurrency: currencyTypes['apl'],
                    pairRate,
                    offerAmount,
                    offerCurrency: currencyTypes[this.props.currentCurrency.currency],
                    sender: this.props.account,
                    passphrase: this.props.passPhrase,
                    feeATM: this.feeATM,
                };
                if (this.props.passPhrase) {
                    this.props.createOffer(params);
                    if (this.state.form) this.state.form.resetAll();
                } else {
                    this.props.setBodyModalParamsAction('CONFIRM_CREATE_OFFER', {
                        params,
                        resetForm: this.state.form.resetAll
                    });
                }
            } else {
                NotificationManager.error('Price and amount are required fields', 'Error', 5000);
            }
        } else {
            this.props.handleLoginModal();
        }
    };

    getFormApi = (form) => {
        this.setState({form})
    };

    render() {
        const {currentCurrency: {currency}, wallet} = this.props;
        const balanceFormat = wallet && wallet.wallets && wallet.wallets[0].balance !== "null" && formatCrypto(wallet.wallets[0].balance);
        const currencyName = currency.toUpperCase();
        return (
            <div className={'card-block green card card-medium pt-0 h-400'}>
                <Form
                    onSubmit={values => this.handleFormSubmit(values)}
                    getApi={this.getFormApi}
                    render={({
                                 submitForm, setValue, values
                             }) => (
                        <form className="modal-form modal-send-apollo modal-form" onSubmit={submitForm}>
                            <div className="form-title d-flex justify-content-between align-items-center">
                                <p>Buy APL</p>
                                <span>Fee: {this.feeATM/100000000} APL</span>
                            </div>
                            <div className="form-group row form-group-white mb-15">
                                <label>
                                    Price for 1 APL
                                </label>
                                <div className="input-group input-group-text-transparent">
                                    <InputForm
                                        field="pairRate"
                                        type={"float"}
                                        onChange={(price) => setValue("total", multiply(values.offerAmount, price))}
                                        setValue={setValue}/>
                                    <div className="input-group-append">
                                        <span className="input-group-text">{currencyName}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group row form-group-white mb-15">
                                <label>
                                    I want to Buy
                                </label>
                                <div
                                    className="input-group input-group-text-transparent">
                                    <InputForm
                                        field="offerAmount"
                                        type={"float"}
                                        onChange={(amount) => setValue("total", multiply(amount, values.pairRate))}
                                        setValue={setValue}/>
                                    <div className="input-group-append">
                                        <span className="input-group-text">APL</span>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group row form-group-white mb-15">
                                <label>
                                    I will pay
                                </label>
                                <div
                                    className="input-group input-group-text-transparent">
                                    <InputForm
                                        field="total"
                                        type={"float"}
                                        setValue={setValue}
                                        disabled/>
                                    <div className="input-group-append">
                                        <span className="input-group-text">{currencyName}</span>
                                    </div>
                                </div>
                            </div>
                            {wallet && wallet.wallets && balanceFormat !== false && (
                                <div className={'form-group-text d-flex justify-content-between'}>
                                    of Total Balance: <span><i
                                    className="zmdi zmdi-balance-wallet"/> {balanceFormat}&nbsp;{currencyName}</span>
                                </div>
                            )}
                            <div className="btn-box align-buttons-inside align-center form-footer">
                                <button
                                    type="submit"
                                    name={'closeModal'}
                                    className={'btn btn-lg btn-green submit-button'}
                                >
                                    <span className={'button-text'}>Buy APL</span>
                                </button>
                            </div>
                        </form>
                    )}/>
            </div>
        )
    }
}

const mapStateToProps = ({account, dashboard}) => ({
    account: account.account,
    balanceAPL: account.unconfirmedBalanceATM,
    dashboardAccoountInfo: dashboard.dashboardAccoountInfo,
    passPhrase: account.passPhrase,
});

const mapDispatchToProps = dispatch => ({
    createOffer: (params) => dispatch(createOffer(params)),
    setBodyModalParamsAction: (type, value) => dispatch(setBodyModalParamsAction(type, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ExchangeBuy);