import React, { Component } from 'react';
import {Link} from "react-router-dom";
import { Table, Divider, Button } from 'antd';
import {notificationError, notificationSuccess} from '../../util/Notification';
import { loadAllBoard, deleteUserBoard } from '../../controller/APIController';

class Main extends Component{
    constructor(props){
        super(props);

        const query = new URLSearchParams(props.location.search);
        const category = query.get('category');
        this.state = {
            category : category || 'notice', 
            boardList:[]
        };
        this.onDelete = this.onDelete.bind(this);
    }

    componentDidMount(){
        this.getBoardList();
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

    getBoardList(){
        loadAllBoard()
            .then((res) => {
                this.setState({
                    boardList : res
                })
        });
  
    }

    onDelete = (boid, username) =>{
        deleteUserBoard(boid, username)
            .then(res => {
                this.setState({boardList:this.state.boardList.filter(board => board.boid !== boid)}, function(){
                })
                notificationSuccess("게시글이 삭제 되었습니다.") 
            }).catch(error => {
                notificationError("본인의 글만 삭제 가능합니다..")                                                                   
            });
    }
    render() {
        const list = this.state.boardList.filter(board => ( 
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
              render: (text, record) => <Link to={'userprofile/' + record.writer}>{text}</Link>,
            },
            {
                title: '작성일',
                dataIndex: 'date',
                key: 'date',
            },
            {
                title: '조회수',
                dataIndex: 'count',
                key: 'count',
            },
            {
                title: 'Action',
                key: 'action',
                className: 'action',
                render: (text, record) => (
                    this.props.username === record.writer ?
                    <span>
                      <Button style={{background: '#7ec484'}}>
                          <Link to={'EditBoard/' + record.boid}>수정</Link>
                      </Button>
                      <Divider type="vertical" />
                      <Button style={{background: '#7ec484'}} onClick={()=>this.onDelete(record.boid, this.props.username)}>
                          삭제
                      </Button>
                    </span>
                      :  null
                    )
              }
          ];
        return (
            
            <div className="editList-container">
                <h2> <strong>{this.state.category}</strong> </h2>
                <Table rowKey={record => record.boid} dataSource={list} columns={columns} pagination={{ pageSize: 8 }}/>

                {this.state.category !== 'notice' && this.props.username !== null ?
                <Button style={{background: '#7ec484'}}>
                    <Link to={"/boardinsert?category=" + this.state.category}>게시글 작성</Link>
                </Button> : null}
                
                {this.state.category === 'notice' && this.props.role === 'ROLE_ADMIN' || this.props.role === 'ROLE_TOPADMIN' ? 
                <Button style={{background: '#7ec484'}}>
                    <Link to={"/boardinsert?category=" + this.state.category}>공지사항 작성</Link>
                </Button> : null}
            </div>
        );
    }
}

export default Main;