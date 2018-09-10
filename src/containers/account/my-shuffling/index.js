import React from 'react';
import SiteHeader from '../../components/site-header'
import {connect} from 'react-redux';
import {getBlocksAction} from "../../../actions/blocks";

import classNames from "classnames";
import ShufflingItem from '../active-shufflings/shuffling-item/'
import uuid from "uuid";
import submitForm from "../../../helpers/forms/forms";
import {NotificationManager} from "react-notifications";
import {getAccountShufflingsAction} from "../../../actions/shuffling";


class MyShufling extends React.Component {
    constructor(props) {
        super(props);

        this.getBlocks = this.getBlocks.bind(this);

        this.state = {
            page: 1,
            firstIndex: 0,
            lastIndex: 14,
            blocks: []
        };
    }

    componentDidMount() {
        this.getAccountShufflings({
            account: this.props.account,
            firstIndex: this.state.firstIndex,
            lastIndex: this.state.lastIndex
        });
    }

    componentWillReceiveProps(newState) {
        this.getAccountShufflings({
            account: newState.account,
            firstIndex: newState.firstIndex,
            lastIndex: newState.lastIndex
        });
    }


    async getBlocks(requestParams) {
        const ledger = await this.props.getBlocksAction(requestParams);
        this.setState({
            ...this.props,
            blocks: ledger.blocks
        });
    }

    onPaginate (page) {
        this.setState({
            page: page,
            account: this.props.account,
            firstIndex: page * 15 - 15,
            lastIndex:  page * 15 - 1
        }, () => {
            this.getBlocks({
                account: this.props.account,
                firstIndex: this.state.firstIndex,
                lastIndex: this.state.lastIndex
            })
        });
    }

    getAccountShufflings = async (reqParams) => {
        const shufflings = await this.props.getAccountShufflingsAction({
            account: reqParams.account,
            firstIndex: reqParams.firstIndex,
            lastIndex:  reqParams.lastIndex
        });

        if (shufflings) {
            this.setState({
                shufflings : shufflings.shufflings
            });
        }
    };

    getShufflers = async () => {
        this.props.submitForm(null, null, {

        }, 'getShufflers')
            .done((res) => {
                if (res.errorCode) {
                    NotificationManager.error(res.errorDescription, 'Error', 5000)
                } else {
                    this.props.setBodyModalParamsAction(null, {});

                    NotificationManager.success('Transaction has been submitted!', null, 5000);
                }
            });
    };

    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'My shuffling'}
                />
                <div className="page-body container-fluid">
                    <div className="transaction-table">
                        <div className="transaction-table no-min-height">
                            {
                                this.state.shufflings && !this.state.shufflings.length &&
                                <div className="info-box info">
                                    <p>After creating or joining a shuffling, you must keep your node online and your shuffler running, leaving enough funds in your account to cover the shuffling fees, until the shuffling completes! If you don't and miss your turn, you will be fined.</p>
                                </div>
                            }
                            {
                                this.state.shufflings && !!this.state.shufflings.length &&
                                <div className="transaction-table-body">
                                    <table>
                                        <thead>
                                        <tr>
                                            <td>Code</td>
                                            <td>Name</td>
                                            <td>Type</td>
                                            <td className="align-right">Current Supply</td>
                                            <td className="align-right">Max Supply</td>
                                            <td className="align-right">Actions</td>
                                        </tr>
                                        </thead>
                                        <tbody key={uuid()}>
                                        {
                                            this.state.shufflings &&
                                            this.state.shufflings.map((el, index) => {
                                                return (
                                                    <ShufflingItem
                                                        {...el}
                                                        getTransaction={this.getTransaction}
                                                    />
                                                );
                                            })
                                        }
                                        </tbody>
                                    </table>

                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    account: state.account.account
});

const mapDispatchToProps = dispatch => ({
    getBlocksAction : (requestParams) => dispatch(getBlocksAction(requestParams)),
    getAccountShufflingsAction : (requestParams) => dispatch(getAccountShufflingsAction(requestParams)),
    submitForm: (modal, btn, data, requestType) => dispatch(submitForm.submitForm(modal, btn, data, requestType)),

})

export default connect(mapStateToProps, mapDispatchToProps)(MyShufling);