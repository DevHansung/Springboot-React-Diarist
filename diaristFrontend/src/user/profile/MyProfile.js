import React, { Component } from 'react';
import NotFound from '../../common/NotFound';
import ServerError from '../../common/ServerError';
import LoadingIndicator from '../../common/LoadingIndicator';
import { Avatar, Table, Button, Form, Input } from 'antd';
import { getAvatarColor } from '../../util/Colors';
import { getUserProfile, deleteUser } from '../../controller/APIUserController';
import { loadScrapByUsername, deleteScrapByBsid, loadFollows, deleteFollow } from '../../controller/APIController';
import { notificationError, notificationSuccess } from '../../util/Notification';
import { Link } from "react-router-dom";
import "./MyProfile.css";

class MyProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            isLoading: false,
            scraps: [],
            follows: [],
            showInput: false,
            passwordInput: ""
        }
        this.loadUserProfile = this.loadUserProfile.bind(this);
        this.loadScrap = this.loadScrap.bind(this);
        this.onDeleteScrap = this.onDeleteScrap.bind(this);
        this.onUserDeleteInput = this.onUserDeleteInput.bind(this);
        this.onUserDelete = this.onUserDelete.bind(this);
    }

    componentDidMount() {
        this.loadUserProfile(this.props.username);
        this.loadScrap(this.props.username);
        this.loadFollows(this.props.username);
    }

    componentDidUpdate(nextProps) {
        if (this.props.username !== nextProps.username) {
            this.loadUserProfile(nextProps.username);
        }
    }

    onDeleteScrap(bsid) {
        deleteScrapByBsid(bsid)
            .then(res => {
                this.setState({ scraps: this.state.scraps.filter(fav => fav.bsid !== bsid) })
                notificationSuccess("스크랩이 취소 되었습니다.")
            }).catch(error => {
                notificationError('작업중 문제가 발생하였습니다..')
            });
    }

    loadScrap(username) {
        loadScrapByUsername(username)
            .then(res => {
                this.setState({
                    scraps: res
                });
            })
            .catch(error => {
                console.log(error);
            });
    }

    loadFollows(username) {
        loadFollows(username)
            .then(res => {
                this.setState({
                    follows: res
                });
            })
    }

    onDeleteFollow(followid) {
        deleteFollow(followid)
            .then((res) => {
                this.setState({ follows: this.state.follows.filter(follow => follow.followid !== followid) })
                notificationSuccess("팔로우가 취소 되었습니다.")
            }).catch(error => {
                notificationError("작업중 문제가 발생 하였습니다..")
            })
    }

    loadUserProfile(username) {
        this.setState({
            isLoading: true
        });

        getUserProfile(username)
            .then(response => {
                this.setState({
                    user: response,
                    isLoading: false
                });
            }).catch(error => {
                if (error.status === 404) {
                    this.setState({
                        notFound: true,
                        isLoading: false
                    });
                } else {
                    this.setState({
                        serverError: true,
                        isLoading: false
                    });
                }
            });
    }

    onUserDeleteInput() {
        this.setState({
            showInput: true,
        })
    }

    onUserDelete() {
        deleteUser(this.props.username, this.state.passwordInput)
            .then((res) => {
                this.props.onLogout();
                notificationSuccess("회원 탈퇴 되었습니다.")
            }).catch(error => {
                notificationError("작업중 문제가 발생 하였습니다..")
            })
    }

    onPasswordInput = (e) => {
        this.setState({ passwordInput: e.target.value });
    }

    render() {

        if (this.state.isLoading) {
            return <LoadingIndicator />;
        }

        if (this.state.notFound) {
            return <NotFound />;
        }

        if (this.state.serverError) {
            return <ServerError />;
        }

        const scrapColumns = [
            {
                title: '제목',
                dataIndex: 'title',
                key: 'title',
                render: (text, record) => <Link to={'/detailboard/' + record.boardid}>{text}</Link>
            },
            {
                title: 'Action',
                key: 'action',
                className: 'action',
                render: (text, record) => (
                    <span>
                        <Button onClick={() => this.onDeleteScrap(record.bsid)}>
                            삭제
                    </Button>
                    </span>
                ),
            }
        ]

        const followColumns = [
            {
                title: '팔로우',
                dataIndex: 'followname',
                key: 'followname',
                render: (text, record) => <Link to={'/userprofile/' + record.followname}>{text}</Link>
            },
            {
                title: 'Action',
                key: 'action',
                className: 'action',
                render: (text, record) => (
                    <span>
                        <Button onClick={() => this.onDeleteFollow(record.followid)}>
                            팔로우 취소
                    </Button>
                    </span>
                ),
            }
        ]
        return (
            <div className="profile">
                {
                    this.state.user ? (
                        <div className="profile_container">
                            <div className="user-profile">
                                <div className="user-details">
                                    <div className="user-avatar">
                                        <Avatar className="user-avatar-circle" style={{ backgroundColor: getAvatarColor(this.state.user.name) }}>
                                            {this.state.user.name[0].toUpperCase()}
                                        </Avatar>
                                    </div>
                                    <div className="user-summary">
                                        <div className="full-name">{this.state.user.name}</div>
                                        <div className="username">@{this.state.user.username}</div>
                                        <div>
                                            <Button onClick={() => this.onUserDeleteInput()} >회원 탈퇴</Button>
                                            {this.state.showInput ?
                                                <div className="editForm-container">
                                                    <Form>
                                                        <Form.Item>
                                                            비밀번호 입력
                                                            <Input
                                                                size="large"
                                                                name="checkPassword"
                                                                type="password"
                                                                autoComplete="off"
                                                                placeholder="비밀번호를 입력하면 회원 탈퇴 됩니다."
                                                                onChange={this.onPasswordInput} />
                                                        </Form.Item>

                                                        <Form.Item>
                                                            <Button type="primary" className="commentButton" onClick={() => this.onUserDelete()}>
                                                                탈퇴
                                                    </Button>
                                                        </Form.Item>
                                                    </Form>
                                                </div> : null}
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="favTable_container">
                                <div className="favTitle_container">
                                    <span className="favTitle">스크랩</span>
                                </div>
                                <div><Table dataSource={this.state.scraps} columns={scrapColumns} pagination={{ pageSize: 5 }} /></div>
                            </div>
                            <div className="favTable_container">
                                <div className="favTitle_container">
                                    <span className="favTitle">팔로워</span>
                                </div>
                                <div><Table dataSource={this.state.follows} columns={followColumns} pagination={{ pageSize: 5 }} /></div>
                            </div>
                        </div>
                    ) : null
                }
            </div>
        );
    }
}

export default MyProfile;