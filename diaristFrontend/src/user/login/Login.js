import React, { Component } from 'react';
import { login } from '../../controller/APIUserController';
import { Link } from 'react-router-dom';
import {notificationError} from '../../util/Notification';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../constants/property';
import './Login.css';

import { Form, Input, Button, Icon } from 'antd';
const FormItem = Form.Item;

class Login extends Component {
    render() {
        const AntWrappedLoginForm = Form.create()(LoginForm)
        return (
            <div className="login-container">
                <h1 className="page-title">Login</h1>
                <div className="login-content">
                    <AntWrappedLoginForm onLogin={this.props.onLogin} />
                </div>
            </div>
        );
    }
}

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();   
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const loginRequest = Object.assign({}, values);
                login(loginRequest)
                .then(response => {
                    sessionStorage.setItem(ACCESS_TOKEN, response.accessToken);
                    sessionStorage.setItem(REFRESH_TOKEN, response.refreshToken);
                    this.props.onLogin();
                }).catch(error => {
                    if(error.status === 401) {     
                        notificationError("아이디 혹은 비밀번호가 일치하지 않습니다. 다시 시도해주세요.") 
                    } else {    
                        notificationError(error.message || '다시 시도해주세요.')              
                    }
                });
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem>
                    {getFieldDecorator('usernameOrEmail', {
                        rules: [{ required: true, message: '아이디 혹은 이메일을 입력해주세요.' }],
                    })(
                    <Input 
                        prefix={<Icon type="user" />}
                        size="large"
                        name="usernameOrEmail" 
                        placeholder="Username or Email" />    
                    )}
                </FormItem>
                <FormItem>
                {getFieldDecorator('password', {
                    rules: [{ required: true, message: '비밀번호를 입력해주세요.' }],
                })(
                    <Input 
                        prefix={<Icon type="lock" />}
                        size="large"
                        name="password" 
                        type="password" 
                        placeholder="Password"  />                        
                )}
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit" size="large" className="login-form-button">Login</Button>
                    <Link to="/signup">register</Link>
                </FormItem>
            </Form>
        );
    }
}


export default Login;