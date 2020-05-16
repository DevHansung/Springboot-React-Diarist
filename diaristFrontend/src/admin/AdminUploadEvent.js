import React, { Component } from 'react';
import { Form, Button, Input, Upload, Icon, notification } from 'antd';
import './AdminUploadEvent.css';
import {uploadEvent} from '../controller/APIController';
const { Dragger } = Upload;
const { TextArea } = Input;

class NewAdd extends Component {
    constructor(props){
        super(props);
    this.state = {
        title:{
            value:''
        },
        text:{
            value:''
        },
        fileList:[]
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.onUploadEvent = this.onUploadEvent.bind(this);
        this.onChange = this.onChange.bind(this);
}

handleInputChange(event){
    const target = event.target;
    const inputName=target.name;
    const inputValue = target.value;

    this.setState({
        [inputName] : {
            value : inputValue
        }
    })
}

onChange=({ fileList })=> {
    this.setState({ fileList })
 }

onUploadEvent() {
    try {
        uploadEvent(this.props.username, this.state.title.value, this.state.text.value, this.state.fileList[0].originFileObj)
        this.props.history.push("/adminmenu");
        notification.success({
            message: 'Notice',
            description: "정상적으로 저장되었습니다.",
          });

    } catch(error) {
            notification.error({
                message: 'Notice',
                description: error.message || '다시 시도해주세요.'
            });
        }
    }
    render() {
        return (
            <div className="newAdd-container">
                <Form onSubmit={this.onUploadEvent}>
                    <Form.Item label="이벤트 제목">
                            <Input type="text" name="title" size="large" placeholder="Title" 
                                value={this.state.title.value} onChange={this.handleInputChange}></Input>
                        </Form.Item>
                        <Form.Item label="내용">
                            <TextArea rows={4} type="text" name="text" size="large" placeholder="text" 
                                value={this.state.text.value} onChange={this.handleInputChange} />
                        </Form.Item>

                        <Form.Item label="이미지">
                            <Dragger onChange={this.onChange} beforeUpload={() => false} multiple={true}>
                                <p className="ant-upload-drag-icon">
                                <Icon type="inbox" />
                                </p>
                                <p className="ant-upload-text">Click or Drag Image File</p>
                                <p className="ant-upload-hint">
                                Image fils only
                                </p>
                            </Dragger>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" className="newAddButton" size="large" htmlType="submit">Save</Button>
                        </Form.Item>
                </Form>
            </div>
        );
    }
}

export default NewAdd;