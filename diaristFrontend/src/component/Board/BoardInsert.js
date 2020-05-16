import React, { Component } from 'react';
import { boardinsert} from '../../controller/APIController';
import './BoardInsert.css';
import { Link } from 'react-router-dom';
import {notificationError, notificationSuccess} from '../../util/Notification';
import { Form, Input, Button } from 'antd';
import { 
    TEXT_MIN_LENGTH, 
    TITLE_MIN_LENGTH,
} from '../../constants/property';

const FormItem = Form.Item;
const { TextArea } = Input;

class BoardInsert extends Component {
    constructor(props) {
        super(props);
        const query = new URLSearchParams(props.location.search); 
        const category = query.get('category'); 
        this.state = {
            title: {
                value: ''
            },
            text: {
                value: ''
            },
            writer: {
                value: this.props.username
            },
            categoryItem:category
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
        this.onCategoryChange = this.onCategoryChange.bind(this);

        
    }

    onCategoryChange = value =>{
        this.setState({ category: value}, function () {
        });
    }

    handleInputChange(event, validationFun) {
        const target = event.target;
        const inputName = target.name;        
        const inputValue = target.value;

        this.setState({
            [inputName] : {
                value: inputValue,
                ...validationFun(inputValue)
            }
        });
    }

    handleSubmit(event) {
        event.preventDefault();
    
        const board = {
            writer: this.state.writer.value,
            text: this.state.text.value,
            title: this.state.title.value,
            category: this.state.categoryItem
        };
        boardinsert(board)
        .then(response => {
            notificationSuccess("게시글이 성공적으로 작성 되었습니다.")    
        }).catch(error => {
            notificationError(error.message || '문제가 발생하였습니다. 다시 시도해주세요.')
        });
        this.props.history.push("/");
    }

    isFormInvalid() {
        return !(
            this.state.title.validateStatus === 'success' &&
            this.state.text.validateStatus === 'success'
        );
    }

    render() {
        return (
            <div className="signup-container">
                <h1 className="page-title">게시글 작성</h1>
                <div className="signup-content">
                    <Form onSubmit={this.handleSubmit} className="signup-form">
                        <FormItem 
                            label="Title"
                            validateStatus={this.state.title.validateStatus}
                            help={this.state.title.errorMsg}>
                            <Input
                                size="large"
                                name="title"
                                autoComplete="off"
                                placeholder="최소 6 글자 이상 입력해주세요."
                                value={this.state.title.value}
                                onChange={(event) => this.handleInputChange(event, this.validateTitle)}/>        
                        </FormItem>
                        <Form.Item>
                            <Input
                                size="large"
                                name="category"
                                type="hidden"
                                value={this.state.categoryItem}
                                onChange={(event) => this.handleInputChange(event, this.validateTitle)}/>
                        </Form.Item>
                        <FormItem 
                            label="Text"
                            validateStatus={this.state.text.validateStatus}
                            help={this.state.text.errorMsg}>                            
                            <TextArea 
                                size="large"
                                name="text" 
                                type="text" 
                                rows={4}
                                autoComplete="off"
                                placeholder="Your email"
                                value={this.state.text.value}
                                onChange={(event) => this.handleInputChange(event, this.validateText)} />
                        </FormItem>
                        <FormItem>
                            <Button type="primary" 
                                htmlType="submit" 
                                size="large" 
                                className="signup-form-button" disabled={this.isFormInvalid()}>Sumit</Button>
                            <Link to="/board">go to board</Link>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }

    validateTitle = (title) => {
        if(title.length < TITLE_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `너무 짧습니다. 최소 ${TITLE_MIN_LENGTH} 글자 이상 입력해주세요.`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
            };            
        }
    }

    validateText = (text) => {
        if(text.length < TEXT_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `너무 짧습니다. 최소 ${TEXT_MIN_LENGTH} 글자 이상 입력해주세요.`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
            };            
        }
    }

}

export default BoardInsert;