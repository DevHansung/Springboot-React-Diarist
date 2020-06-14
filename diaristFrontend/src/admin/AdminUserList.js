import React, { Component } from 'react';
import { loadAllUser, uploadUserEnabled, uploadRoleEdit } from '../controller/APIUserController';

import { Table, Button } from 'antd';
import { notificationError, notificationSuccess } from '../util/Notification';
import './AdminBoardList.css';

class AdminUserList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      input: '',
      userList: []
    }
    this.onRoleEdit = this.onRoleEdit.bind(this);
    this.onEnabled = this.onEnabled.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.loadUserList();
  }

  loadUserList() {
    loadAllUser()
      .then((res) => {
        this.setState({
          userList: res
        })
      });
  }

  onEnabled = (userid) => {
    try {
      uploadUserEnabled(userid)
        .then(res => {
          if (res.enabled === 0) {
            notificationSuccess("계정이 활성화 되었습니다.")
          }
          else if (res.enabled === 1) {
            notificationSuccess("계정이 비활성화 되었습니다.")
          }
          const { userList } = this.state;
          const index = userList.findIndex(user => user.id === userid);
          const nextUser = [...userList];
          nextUser[index] = res
          this.setState({
            input: '',
            userList: nextUser
          });
        }).catch(error => {
          notificationError("작업을 수행하던 중 문제가 발생하였습니다..")
        });
    } catch (error) {
      notificationError(error.message || '다시 시도해주세요..')
    }
  }

  onRoleEdit = (userid) => {
    try {
      uploadRoleEdit(userid, this.props.username)
        .then(res => {
          if (res.roles[0].name === 'ROLE_ADMIN') {
            notificationSuccess("관리자 권한을 부여 했습니다.")
          }
          else if (res.roles[0].name === 'ROLE_USER') {
            notificationSuccess("일반 유저 권한을 부여 했습니다.")
          }
          const { userList } = this.state;
          const index = userList.findIndex(user => user.id === userid);
          const nextUser = [...userList];
          nextUser[index] = res
          this.setState({
            input: '',
            userList: nextUser
          });
        }).catch(error => {
          notificationError("작업을 수행하던 중 문제가 발생하였습니다..")
        });
    } catch (error) {
      notificationError(error.message || '다시 시도해주세요..')
    }
  }


  handleChange = (e) => {
    this.setState({
      input: e.target.value
    });
  }

  render() {
    const columns = [
      {
        title: 'username',
        dataIndex: 'username',
        key: 'username',
      },
      {
        title: 'email',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: '권한',
        dataIndex: 'roles',
        key: 'role',
        render: (text, record) => (
          this.props.role === 'ROLE_TOPADMIN' ?
            this.props.username === record.username ? null :
              <Button onClick={() => this.onRoleEdit(record.id)}>
                {record.roles[0].name === 'ROLE_ADMIN' ? 'ADMIN' : 'USER'}
              </Button>
            : null
        )
      },
      {
        title: '활성상태',
        dataIndex: 'enabled',
        key: 'enabled',
        render: (text, record) => (
          this.props.role === 'ROLE_TOPADMIN' ?
            this.props.username === record.username ? null :
              <Button onClick={() => this.onEnabled(record.id)}>
                {record.enabled === 0 ? '활성' : '비활성'}
              </Button>
            : record.roles[0].name === 'ROLE_ADMIN' ||
              record.roles[0].name === 'ROLE_TOPADMIN' ||
              this.props.username === record.username ? null :
              <Button onClick={() => this.onEnabled(record.id)}>
                {record.enabled === 0 ? '활성' : '비활성'}
              </Button>
        )
      }
    ];
    return (
      <div>
        <div className="editList-container">
          <Table rowKey={record => record.userid} dataSource={this.state.userList} columns={columns} pagination={{ pageSize: 8 }} />
        </div>
      </div>
    );
  }
}

export default AdminUserList;