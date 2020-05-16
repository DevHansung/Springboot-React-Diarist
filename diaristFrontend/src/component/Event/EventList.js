import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Table } from 'antd';
import { loadAllEvent } from '../../controller/APIController';

class EventList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            EventList: []
        };
    }

    componentDidMount() {
        this.loadEventList();
    }

    loadEventList() {
        loadAllEvent()
            .then((res) => {
                this.setState({
                    EventList: res
                })
            });
    }

    render() {
        const list = this.state.EventList
        const columns = [
            {
                title: '제목',
                dataIndex: 'title',
                key: 'title',
                render: (text, record) => <Link to={'eventdetail/' + record.eventid}>{text}</Link>,
            },
            {
                title: '작성자',
                dataIndex: 'writer',
                key: 'writer',
                render: () => "관리자",
            },
            {
                title: '작성일',
                dataIndex: 'updatedAt',
                key: 'updatedAt',
            }
        ];
        return (
            <div className="editList-container">
                <h2> <strong>{this.state.category}</strong> </h2>
                <Table rowKey={record => record.eventid} dataSource={list} columns={columns} pagination={{ pageSize: 8 }} />
            </div>
        );
    }
}

export default EventList;