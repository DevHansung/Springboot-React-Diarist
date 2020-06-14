import React, { Component } from 'react';
import { loadAllBoard, deleteBoard } from '../controller/APIController';
import { Table, Divider, Button, notification } from 'antd';
import {Link} from "react-router-dom";
import './AdminBoardList.css';

class BoardList extends Component {
    constructor(props) {
        const query = new URLSearchParams(props.location.search);
        const category = query.get('category'); 
        super(props)
        this.state = {
            category : category || 'notice', 
            boards: []
        }

        this.loadBoard = this.loadBoard.bind(this);
        this.onDelete = this.onDelete.bind(this);

    }

    componentDidMount() {
        this.loadBoard();
    }

    componentDidUpdate(prevProps){
        
        let prevQuery = new URLSearchParams(prevProps.location.search);
        let prevCategory = prevQuery.get('category');

        let query = new URLSearchParams(this.props.location.search);
        let category = query.get('category');

        if(prevCategory !== category){
            this.setState({
                category
            })
        };
    }

    loadBoard() {
        loadAllBoard()
            .then((res) => {
                this.setState({boards: res}, function(){
                })
            });
    }

    onDelete = (boid) =>{
        deleteBoard(boid)
            .then(res => {
                this.setState({boards:this.state.boards.filter(board => board.boid !== boid)}, function(){
                    notification.success({
                        message: 'Notice',
                        description: "게시글이 삭제 되었습니다.",
                    });       
                })
            }).catch(error => {
                notification.error({
                    message: 'Notice',
                    description: error.message || '게시글을 작성하는도중 문제가 발생하였습니다. 다시 시도해주세요.'
                });
            });
    }

    render() {
        const list = this.state.boards.filter(board => ( 
            board.category === this.state.category
        ));   
        const columns = [
            {
              title: '제목',
              dataIndex: 'title',
              key: 'title',
              render: (text, record) => <Link to={'detailboard/' + record.boid}>{text}</Link>,
            },
            {
              title: '작성자',
              dataIndex: 'writer',
              key: 'writer',
            },

            {
                title: '내용',
                dataIndex: 'text',
                key: 'text',
            },
            {
                title: '작성일',
                dataIndex: 'date',
                key: 'date',
            },
            {
                title: 'Action',
                key: 'action',
                className: 'action',
                render: (text, record) => (
                  <span>
                    <Button>
                        <Link to={'editboard/' + record.boid}>수정</Link>
                    </Button>
                    <Divider type="vertical" />
                    <Button onClick={()=>this.onDelete(record.boid)}>
                        삭제
                    </Button>
                  </span>
                ),
              }
          ];
        return (
            <div className="editList-container">
                <Table rowKey={record => record.boid} dataSource={list} columns={columns} pagination={{ pageSize: 8 }}/>
            </div>
        );
    }
}

export default BoardList;