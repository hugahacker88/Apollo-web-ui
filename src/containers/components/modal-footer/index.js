import React from 'react';
import InputForm from '../../components/input-form'
import {connect} from 'react-redux'

const mapStateToProps = state => ({
    is2fa: state.account.is2FA
});

class ModalFooter extends React.Component {
    constructor(props) {
        super(props)
    }

    render () {
        const setValue = this.props.setValue;

        return (
            <React.Fragment>
                <div className="form-group row form-group-white mb-15">
                    <label className="col-sm-3 col-form-label">
                        Secret phrase&nbsp;<i className="zmdi zmdi-portable-wifi-changes"/>
                    </label>
                    <div className="col-sm-9">

                        <InputForm
                            type="password"
                            field="secretPhrase"
                            placeholder="Secret Phrase"
                            setValue={setValue}/>
                    </div>
                </div>
                {
                    this.props.is2fa &&
                    <div className="form-group row form-group-white mb-15">
                        <label className="col-sm-3 col-form-label">
                            2FA code
                        </label>
                        <div className="col-sm-9">
                            <InputForm
                                type="password"
                                field="code2FA"
                                placeholder="2FA code"
                                setValue={setValue}
                            />
                        </div>
                    </div>
                }
            </React.Fragment>
        )
    }
}

export default connect(mapStateToProps)(ModalFooter)