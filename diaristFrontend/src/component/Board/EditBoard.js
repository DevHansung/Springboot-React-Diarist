import React, { Component } from 'react';
import { Form, Button, Input } from 'antd';
import { notificationError, notificationSuccess } from '../../util/Notification';
import './EditBoard.css';
import { loadBoardByBoid, editBoard, editUserBoard } from '../../controller/APIController';

class EditBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            text: ''
        };
        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        this.loadBoard = this.loadBoard.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    onChangeTitle = (e) => {
        this.setState({ title: e.target.value }, function () {
        })
    }


    onChangeText = (e) => {
        this.setState({ text: e.target.value }, function () {
        })
    }

    componentDidMount() {
        this.loadBoard();
    }

    loadBoard() {
        loadBoardByBoid(parseInt(this.props.match.params.id, 10))
            .then((res) => {
                this.setState({
                    title: res.title,
                    text: res.text
                })
            });
    }

    handleSubmit(event) {
        event.preventDefault();

        const board = {
            text: this.state.text,
            title: this.state.title,
        };
        const role = this.props.role

        if (role === 'ROLE_ADMIN') {
            editBoard(parseInt(this.props.match.params.id, 10), board)
                .then(response => {
                    notificationSuccess("게시글이 수정 되었습니다.")
                }).catch(error => {
                    notificationError('본인이 작성한 글만 수정 가능합니다.')
                });
            this.props.history.push("/");

        }
        else if (role === 'ROLE_USER') {
            editUserBoard(parseInt(this.props.match.params.id, 10), board, this.props.username)
                .then(response => {
                    notificationSuccess("게시글이 수정 되었습니다.")
                }).catch(error => {
                    notificationError(error.message || '게시글을 작성하는도중 문제가 발생하였습니다. 다시 시도해주세요.')
                });
            this.props.history.push("/");

        }
    }

    render() {
        return (
            <div className="EditBoard-container">
                <Form onSubmit={this.handleSubmit}>
                    <Form.Item label="제목">
                        <Input type="text" name="title" size="large" placeholder="Title.." value={this.state.title} onChange={this.onChangeTitle}></Input>
                    </Form.Item>
                    <Form.Item label="내용">
                        <Input type="text" name="text" size="large" placeholder="Text.." value={this.state.text} onChange={this.onChangeText}></Input>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" className="EditBoardButton" size="large" htmlType="submit">Save</Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

export default EditBoard;