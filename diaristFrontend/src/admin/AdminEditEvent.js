import React, { Component } from 'react';
import { Form, Button, Input, Upload, Icon } from 'antd';
import './AdminUploadEvent.css';
import { loadEventDetail, editEventImage, editEvent } from '../controller/APIController';
import { notificationError, notificationSuccess } from '../util/Notification';
const { Dragger } = Upload;
const { TextArea } = Input;

class AdminEditEvent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: {
                value: ''
            },
            text: {
                value: ''
            },
            fileList: [],
            originFileName: ''
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.onEditEvent = this.onEditEvent.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        this.loadEvent();
    }

    loadEvent() {
        loadEventDetail(parseInt(this.props.match.params.id, 10))
            .then(res => {
                this.setState({
                    title: {
                        value: res.title
                    },
                    text: {
                        value: res.text
                    },
                    fileList: [],
                    originFileName: res.fileName
                });
            })
            .catch(error => {
                console.log(error);
            });
    }

    handleInputChange(event) {
        const target = event.target;
        const inputName = target.name;
        const inputValue = target.value;

        this.setState({
            [inputName]: {
                value: inputValue
            }
        })
    }

    onChange = ({ fileList }) => {
        this.setState({ fileList })
    }

onEditEvent() {
    try {
        if (this.state.fileList.length !== 0) {
            editEventImage(parseInt(this.props.match.params.id, 10), this.props.username, this.state.title.value,
                this.state.text.value, this.state.fileList[0].originFileObj)
        }
        else if (this.state.fileList.length === 0) {
        editEvent(parseInt(this.props.match.params.id, 10), this.props.username, this.state.title.value,
            this.state.text.value)
        }
        this.props.history.push("/adminmenu");
        notificationSuccess("수정 되었습니다.")
        } catch(error) {
            notificationError('수정중 문제가발생하였습니다..')
            };
        
}
render() {
    return (
        <div className="newAdd-container">
            <Form onSubmit={this.onEditEvent}>
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

export default AdminEditEvent;