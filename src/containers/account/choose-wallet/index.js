import React from 'react';
import {connect} from 'react-redux';
import SiteHeader from '../../components/site-header';
import CustomTable from '../../components/tables/table';
import InfoBox from '../../components/info-box';
import CurrencyDescriptionComponent from './currency';
import {setBodyModalParamsAction} from "../../../modules/modals";
import {getCurrencyBalance} from "../../../actions/wallet";

class ChooseWallet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            wallets: null
        };
    }

    componentDidMount() {
        let wallets = JSON.parse(localStorage.getItem('wallets'));
        if (!wallets) {
            this.props.setBodyModalParamsAction('LOGIN_EXCHANGE', {});
        } else {
            this.getCurrencyBalance(JSON.parse(wallets));
        }
    }

    componentDidUpdate() {
        if (!this.state.wallets && this.props.wallets) {
            this.getCurrencyBalance(this.props.wallets);
        }
    }

    getCurrencyBalance = async (wallets) => {
        const balances = await this.props.getCurrencyBalance({eth: wallets.eth.address, pax: wallets.pax.address});
        if (balances) {
            wallets.eth.balance = balances.balanceETH;
            wallets.pax.balance = balances.balancePAX;
        }
        this.setState({wallets});
    };

    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Wallets'}
                />
                <div className="exchange page-body container-fluid pl-3">
                    {this.state.wallets ?
                        <div className={'card-block primary form-group-app p-0 mb-3'}>
                            <div className={'form-title form-title-lg d-flex flex-column justify-content-between'}>
                                <p className="title-lg">My Wallets</p>
                            </div>
                            <CustomTable
                                header={[
                                    {
                                        name: 'ETH Wallet',
                                        alignRight: false
                                    }, {
                                        name: 'Amount (ETH)',
                                        alignRight: false
                                    }, {
                                        name: 'Buy ETH',
                                        alignRight: false
                                    }, {
                                        name: 'Sell ETH',
                                        alignRight: false
                                    }, {
                                        name: 'Transactions history',
                                        alignRight: false
                                    }, {
                                        name: 'Withdraw',
                                        alignRight: true
                                    }
                                ]}
                                className={'pt-0 no-min-height no-padding rounded-top'}
                                tableData={[{...this.state.wallets.eth, currency: 'ETH'}]}
                                emptyMessage={'No wallet info found.'}
                                TableRowComponent={CurrencyDescriptionComponent}
                            />
                            <CustomTable
                                header={[
                                    {
                                        name: 'PAX Wallet',
                                        alignRight: false
                                    }, {
                                        name: 'Amount (PAX)',
                                        alignRight: false
                                    }, {
                                        name: 'Buy PAX',
                                        alignRight: false
                                    }, {
                                        name: 'Sell PAX',
                                        alignRight: false
                                    }, {
                                        name: 'Transactions history',
                                        alignRight: false
                                    }, {
                                        name: 'Withdraw',
                                        alignRight: true
                                    }
                                ]}
                                className={'pt-0 no-min-height no-padding'}
                                tableData={[{...this.state.wallets.pax, currency: 'PAX'}]}
                                emptyMessage={'No wallet info found.'}
                                TableRowComponent={CurrencyDescriptionComponent}
                            />
                        </div>
                        :
                        <div>
                            <InfoBox default>
                                You have no wallets at that moment.&nbsp;
                                <a onClick={() => this.props.setBodyModalParamsAction('LOGIN_EXCHANGE', {})}>Log in</a>
                            </InfoBox>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    wallets: state.account.wallets,
});

const mapDispatchToProps = dispatch => ({
    getCurrencyBalance: (params) => dispatch(getCurrencyBalance(params)),
    setBodyModalParamsAction: (type, value) => dispatch(setBodyModalParamsAction(type, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChooseWallet);