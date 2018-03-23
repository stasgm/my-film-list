import React, { Component } from 'react';
import { login, resetPassword } from '../helpers/auth';

function setErrorMsg(error) {
    return {
        loginMessage: error
    };
}

export default class Login extends Component {
    state = { loginMessage: null };

    handleSubmit = (e) => {
        e.preventDefault();
        login(this.email.value, this.pw.value)
            .catch((error) => {
                this.setState(setErrorMsg('Не верный пользователь/пароль.'))
            })
    };

    resetPassword = () => {
        resetPassword(this.email.value)
            .then(() => this.setState(setErrorMsg(`Пароль был выслан на email:  ${this.email.value}.`)))
            .catch((error) => this.setState(setErrorMsg(`Email не найден.`)))
    };

    render () {
        return (
            <div className="col-sm-6 col-sm-offset-3">
                <h1> Вход </h1>
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
                        this.state.loginMessage &&
                        <div className='alert alert-danger' role='alert'>
                            <span className='glyphicon glyphicon-exclamation-sign' aria-hidden="true" />
                            <span className="sr-only">Ошибка:</span>
                            &nbsp;{this.state.loginMessage} <a href="#" onClick={this.resetPassword} className="alert-link">Забыл пароль?</a>
                        </div>
                    }
                    <button type="submit" className="btn btn-primary">Войти</button>
                </form>
            </div>
        )
    }
}
