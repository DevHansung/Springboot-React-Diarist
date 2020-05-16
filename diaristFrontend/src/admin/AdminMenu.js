import React, { Component } from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import './AdminMenu.css';

class AdminMenu extends Component {
    render() {
        return (
            <div className="admin-menu-container">
                <h2>관리자 페이지 입니다.</h2>
                <Button type="primary" block size="large">
                    <Link to="/boardinsert?category=notice">
                    공지사항 등록
                    </Link>
                </Button>
                <Button type="primary" block size="large">
                    <Link to="/boardcategory">
                    게시판 관리
                    </Link>
                </Button>
                <Button type="primary" block size="large">
                    <Link to="/event">
                    이벤트 관리
                    </Link>
                </Button>
                <Button type="primary" block size="large">
                    <Link to="/userlist">
                    회원 관리
                    </Link>
                </Button>
            </div>
        );
    }
}

export default AdminMenu;