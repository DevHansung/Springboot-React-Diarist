import React, { Component } from 'react';
import { loadAllCategory, uploadCategory, deleteCatetory, uploadEnabled } from '../controller/APIController';

import { Table, Divider, Button, notification } from 'antd';
import { notificationError, notificationSuccess } from '../util/Notification';
import { Link } from "react-router-dom";
import './AdminBoardList.css';

class BoardCategory extends Component {


  constructor(props) {
    super(props)
    this.state = {
      input: '',
      categoryList: []
    }
    this.onDeleteCategory = this.onDeleteCategory.bind(this);
    this.onEnabled = this.onEnabled.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.loadCategoryList();
  }

  loadCategoryList() {
    loadAllCategory()
      .then((res) => {
        this.setState({
          categoryList: res
        })
      });
  }

  onUploadCategory = () => {
    try {
      uploadCategory(this.state.input)
        .then(res => {
          notificationSuccess("게시판을 추가 하였습니다.")
          const { categoryList } = this.state;
          this.setState({
            input: '',
            categoryList: categoryList.concat(res)
          });
        }).catch(error => {
          notificationError("문제가 발생하였습니다..")
        });
    } catch (error) {
      notificationError(error.message || '다시 시도해주세요..')
    }
  }

  onEnabled = (cateid, enabled) => {
    try {
      uploadEnabled(cateid)
        .then(res => {
          if (res.enabled === 1) {
            notificationSuccess("게시판이 활성화 되었습니다.")
          }
          else if (res.enabled === 0) {
            notificationSuccess("게시판이 비활성화 되었습니다.")
          }
          const { categoryList } = this.state;
          const index = categoryList.findIndex(category => category.cateid === cateid);
          const nextCategory = [...categoryList];
          nextCategory[index] = res
          this.setState({
            input: '',
            categoryList: nextCategory
          });
        }).catch(error => {
          notificationError("작업을 수행하던 중 문제가 발생하였습니다..")
        });
    } catch (error) {
      notificationError(error.message || '다시 시도해주세요..')
    }
  }

  onDeleteCategory = (cateid) => {
    deleteCatetory(cateid)
      .then(res => {
        this.setState({ categoryList: this.state.categoryList.filter(category => category.cateid !== cateid) }, function () {
          notification.success({
            message: 'Notice',
            description: "게시판이 삭제 되었습니다.",
          });
        })
      }).catch(error => {
        notification.error({
          message: 'Notice',
          description: error.message || '문제가 발생하였습니다.'
        });
      });
  }

  handleChange = (e) => {
    this.setState({
      input: e.target.value
    });
  }

  render() {
    const columns = [
      {
        title: '게시판명',
        dataIndex: 'category',
        key: 'category',
        render: (text, record) => <Link to={'boardlist?category=' + record.category}>{text}</Link>,
      },
      {
        title: 'Action',
        key: 'action',
        className: 'action',
        render: (text, record) => (
          <span>
            <Button onClick={() => this.onEnabled(record.cateid)}>
              {record.enabled === 1 ? '활성' : '비활성'}
            </Button>
            <Divider type="vertical" />
            {record.category !== 'notice' ?
              <Button onClick={() => this.onDeleteCategory(record.cateid)}>
                삭제
                    </Button> : null}
          </span>
        ),
      }
    ];
    return (
      <div>
        <div className="form">
          <input value={this.state.input} onChange={this.handleChange} />
          <div className="create-button" onClick={this.onUploadCategory}>
            게시판 추가
          </div>
        </div>
        <div className="editList-container">
          <Table rowKey={record => record.cateid} dataSource={this.state.categoryList} columns={columns} pagination={{ pageSize: 8 }} />
        </div>
      </div>
    );
  }
}

export default BoardCategory;