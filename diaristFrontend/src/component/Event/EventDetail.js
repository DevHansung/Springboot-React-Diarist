import React, { Component } from 'react';
import {loadEventDetail, uploadEventApply}
        from '../../controller/APIController';
import { Form, Button, Input, Modal} from 'antd';
import {notificationError, notificationSuccess} from '../../util/Notification';
import "./EventDetail.css";
import { TEXT_MIN_LENGTH } from '../../constants/property';

class EventDetail extends Component{
    constructor(props){
        super(props)

        this.state = {
            event : {},
            loading: false,
            visible: false,
            username: null,
            name: {
                value: ''
            },
            phone: {
                value: ''
            },
            birth: {
                value: ''
            },
            email: {
                value: ''
            },
            address: {
                value: ''
            }
        }
        this.loadEvent = this.loadEvent.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        this.loadEvent();
    }

    showModal = () => {
        this.setState({
          visible: true,
        });
      };

    
      handleCancel = () => {
        this.setState({ visible: false });
      };
    

  isFormInvalid() {
    return !(
        this.state.name.validateStatus === 'success' &&
        this.state.phone.validateStatus === 'success' &&
        this.state.birth.validateStatus === 'success' &&
        this.state.email.validateStatus === 'success' &&
        this.state.address.validateStatus === 'success'
        );
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({ loading: true });
        setTimeout(() => {
            this.setState({ loading: false, visible: false });
        }, 500);
        const apply  = {
            username: this.props.username,
            name: this.state.name.value,
            phone: this.state.phone.value,
            birth: this.state.birth.value,
            email: this.state.email.value,
            address: this.state.address.value
        };
        uploadEventApply(this.props.match.params.id, apply)
        .then(response => {
            notificationSuccess("이벤트에 응모 하였습니다.")    
        }).catch(error => {
            notificationError('이미 신청 하였거나 응모중 문제가 발생하였습니다..')
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

    loadEvent() {
        loadEventDetail(parseInt(this.props.match.params.id, 10))
            .then(res => {
                this.setState({
                    event : res
                });
            })
            .catch(error => {
                console.log(error);
            });
    }
    
    render(){
        const event = this.state.event;
        const { visible, loading } = this.state;
        return (
            <div className="wrap_viewer">
            { event.eventid ? (
                <div>
                    <div className="top_viewer">
                        {event.title}
                        
                    </div>
                    <div className="wrap_images">
                        <img src={event.eventImage.fileUri} width="100%" height="100%" alt={event.title} />
                    </div>
                    {this.props.username !== null ? <Button onClick={this.showModal}> 이벤트 접수 </Button> : "이벤트 접수를 진행하려면 로그인 하세요."}
                    
                    <Modal
                        visible={visible}
                        title="Title"
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        footer={[

                             <Button key="submit" type="primary" htmlType="submit" 
                                loading={loading} disabled={this.isFormInvalid()}
                                onClick={this.handleSubmit}>Sumit
                            </Button>,
                            <Button key="back" onClick={this.handleCancel}>
                                Return
                            </Button>
                        ]}>
                        <div class="row">
                        <div class="col-75">
                            <div class="container">
                                <Form>
                                    <div class="row">
                                        <div class="col-50">
                                            <Form.Item label="이름"
                                                validateStatus={this.state.name.validateStatus}
                                                help={this.state.name.errorMsg}>
                                                <Input
                                                    size="large"
                                                    name="name"
                                                    type="name"
                                                    value={this.state.name.value}
                                                    onChange={(event) => this.handleInputChange(event, this.validateText)}/>
                                            </Form.Item>
                                            <Form.Item label="Email"
                                                validateStatus={this.state.email.validateStatus}
                                                help={this.state.email.errorMsg}>
                                                <Input
                                                    size="large"
                                                    name="email"
                                                    type="name"
                                                    value={this.state.email.value}
                                                    onChange={(event) => this.handleInputChange(event, this.validateText)}/>
                                            </Form.Item>
                                            <Form.Item label="주소"
                                                validateStatus={this.state.address.validateStatus}
                                                help={this.state.address.errorMsg}>
                                                <Input
                                                    size="large"
                                                    name="address"
                                                    type="name"
                                                    value={this.state.address.value}
                                                    onChange={(event) => this.handleInputChange(event, this.validateText)}/>
                                            </Form.Item>
                                        </div>

                                        <div class="col-50">

                                            <Form.Item label="연락처"
                                                validateStatus={this.state.phone.validateStatus}
                                                help={this.state.phone.errorMsg}>
                                                <Input
                                                    size="large"
                                                    name="phone"
                                                    type="name"
                                                    value={this.state.phone.value}
                                                    onChange={(event) => this.handleInputChange(event, this.validateText)}/>
                                            </Form.Item>
                                            <Form.Item label="생년월일"
                                                validateStatus={this.state.birth.validateStatus}
                                                help={this.state.birth.errorMsg}>
                                                <Input
                                                    size="large"
                                                    name="birth"
                                                    type="name"
                                                    value={this.state.birth.value}
                                                    onChange={(event) => this.handleInputChange(event, this.validateText)}/>
                                            </Form.Item>
                                            
                                        </div>
                                    </div>
                                </Form>
                            </div>
                        </div>
                        </div>    
                        <p>이용 약관...</p>
                    </Modal>
                </div>
            ) : (
                <span>LOADING...</span>
            ) }
        </div>
        )
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
export default EventDetail;