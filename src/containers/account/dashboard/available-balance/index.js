import React, {Component} from 'react';
import {connect} from 'react-redux';
import ContentLoader from '../../../components/content-loader';
import {formatTimestamp} from "../../../../helpers/util/time";
import { setBodyModalParamsAction } from '../../../../modules/modals';

class AvailableBalance extends Component {
    render () {
        const {dashboardAccoountInfo, actualBlock, setBodyModalParamsAction, blockchainStatus, positionState1, position1, formatTimestamp} = this.props;
        
        return (
            <div
                className={`card header ballance chart-sprite justify-content-start position-1 ${positionState1 ? "show-hide-content" : ""}`}>
                <div className="card-title">Available Balance</div>
                <div className="arrow-block" onClick={position1}>
                    <div className="arrow"/>
                </div>
                {
                    dashboardAccoountInfo &&
                    <React.Fragment>
                        <div className="page-body-item-content">

                            <div
                                onClick={() => setBodyModalParamsAction('ACCOUNT_DETAILS')}
                                style={{cursor: 'pointer', paddingRight: 0}}
                                className="amount"
                            >
                                {
                                    dashboardAccoountInfo.unconfirmedBalanceATM &&
                                    Math.round(dashboardAccoountInfo.unconfirmedBalanceATM / 100000000).toLocaleString('en')
                                    || 0
                                }
                                <span className="currency">
                            &nbsp;APL
                        </span>
                            </div>
                            <div className="account-sub-titles">
                                {dashboardAccoountInfo.accountRS}
                            </div>
                            {
                                actualBlock &&
                                <div className="account-sub-titles">
                                    Block:&nbsp;{actualBlock.height}&nbsp;/&nbsp;{actualBlock}
                                </div>
                            }
                            {
                                blockchainStatus &&
                                blockchainStatus.blockTime &&
                                <div className="account-sub-titles">
                                    Transaction Time :&nbsp;{blockchainStatus.blockTime} s
                                </div>
                            }
                        </div>
                    </React.Fragment>  ||
                    <ContentLoader white noPaddingOnTheSides/>
                }
            </div>
        )
    }
}

const mapStateToProps = state => ({
    dashboardAccoountInfo: state.dashboard.dashboardAccoountInfo,
    actualBlock: state.account.actualBlock,    
    blockchainStatus: state.account.blockchainStatus,
})

const mapDispatchToProps = dispatch => ({
    formatTimestamp: (time) => dispatch(formatTimestamp(time)),    
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AvailableBalance)