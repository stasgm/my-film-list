import React, { Component } from 'react'
import { auth } from '../helpers/auth'

function setErrorMsg(error) {
    return {
        registerError: error.message
    }
}

export default class Register extends Component {
    state = { registerError: null }
    handleSubmit = (e) => {
        e.preventDefault();
        auth(this.email.value, this.pw.value)
            .catch(e => this.setState(setErrorMsg(e)))
    };

    render () {
        return (
            <div className="col-sm-6 col-sm-offset-3">
                <h1>Регистрация</h1>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input className="form-control" ref={(email) => this.email = email} placeholder="Email"/>
                    </div>
                    <div className="form-group">
                        <label>Пароль</label>
                        <input type="password" className="form-control" placeholder="Пароль" ref={(pw) => this.pw = pw} />
                    </div>
                    {
                        this.state.registerError &&
                        <div className="alert alert-danger" role="alert">
                            <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true" />
                            <span className="sr-only">Ошибка:</span>
                            &nbsp;{this.state.registerError}
                        </div>
                    }
                    <button type="submit" className="btn btn-primary">Register</button>
                </form>
            </div>
        )
    }
}

