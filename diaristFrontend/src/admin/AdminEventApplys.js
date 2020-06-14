import React, { Component } from 'react';
import { Table, Button } from 'antd';
import {notificationError, notificationSuccess} from '../util/Notification';
import {downloadExcelByEvent, loadEventApply } from '../controller/APIController';

class AdminEventList extends Component{
    constructor(props){
        super(props);
        this.state = {
            EventApplyList:[]
        };
        this.onDownloadExcelByEvent = this.onDownloadExcelByEvent.bind(this);
    }

    componentDidMount(){
        this.loadEventApply();
    }
    
    loadEventApply(){
        loadEventApply(this.props.match.params.id)
            .then((res) => {
                this.setState({
                    EventApplyList : res
                })
        });
    }

    onDownloadExcelByEvent(){
        downloadExcelByEvent(this.props.match.params.id)
            .then((res) => {
                notificationSuccess("접수자 리스트를 다운로드 하였습니다.")                                                                                
        }).catch(error => {
            notificationError("작업을 수행하던 중 문제가 발생하였습니다..")                                                                                
      });
    }

    render() {
        const list = this.state.EventApplyList
        const columns = [
            {
              title: '접수자',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: '주소',
              dataIndex: 'address',
              key: 'address',
            },
            {
                title: '연락처',
                dataIndex: 'phone',
                key: 'phone',
            },
            {
                title: '생년월일',
                dataIndex: 'birth',
                key: 'birth',
            },
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email',
            }
          ];
        return (
            <div className="editList-container">
                <h2> <strong>{this.state.category}</strong> </h2>
                <Table rowKey={record => record.eaid} dataSource={list} columns={columns} pagination={{ pageSize: 10 }}/>
                {this.props.role === 'ROLE_ADMIN' || 'ROLE_TOPADMIN' ?
                <Button onClick={()=>this.onDownloadExcelByEvent()} style={{background: '#7ec484'}}>
                    Download Excel
                </Button> : null}
            </div>
        );
    }
}

export default AdminEventList;