import React, { Component } from 'react';
import {Link} from "react-router-dom";
import { Table, Divider, Button } from 'antd';
import {notificationError, notificationSuccess} from '../util/Notification';
import { loadAllEvent, deleteEvent } from '../controller/APIController';

class AdminEventList extends Component{
    constructor(props){
        super(props);
        this.state = {
            EventList:[]
        };
        this.onDelete = this.onDelete.bind(this);
    }

    componentDidMount(){
        this.loadAllEvent();
    }

    componentDidUpdate(prevProps){
    }

    loadAllEvent(){
        loadAllEvent()
            .then((res) => {
                this.setState({
                    EventList : res
                })
        });
  
    }

    onDelete = (eventid, username) =>{
        deleteEvent(eventid)
            .then(res => {
                this.setState({EventList:this.state.EventList.filter(event => event.eventid !== eventid)}, function(){
                })
                notificationSuccess("삭제 되었습니다.") 
            }).catch(error => {
                notificationError("삭제 도중 문제가 발생하였습니다..")                                                                   
            });
    }
    
    render() {
        const list = this.state.EventList

        const columns = [
            {
              title: '제목',
              dataIndex: 'title',
              key: 'title',
              render: (text, record) => <Link to={'eventapplys/' + record.eventid}>{text}</Link>,
            },
            {
              title: '작성자',
              dataIndex: 'writer',
              key: 'writer',
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
                    this.props.role === "ROLE_ADMIN" || "ROLE_TOPADMIN"  ?
                    <span>
                      <Button style={{background: '#7ec484'}}>
                          <Link to={'EditEvent/' + record.eventid}>수정</Link>
                      </Button>
                      <Divider type="vertical" />
                      <Button style={{background: '#7ec484'}} onClick={()=>this.onDelete(record.eventid)}>
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
                <Table rowKey={record => record.eventid} dataSource={list} columns={columns} pagination={{ pageSize: 8 }}/>

                {this.props.role === 'ROLE_ADMIN' || "ROLE_TOPADMIN" ?
                <Button style={{background: '#7ec484'}}>
                    <Link to="/addevent">이벤트 등록</Link>
                </Button> : null}
            </div>
        );
    }
}

export default AdminEventList;