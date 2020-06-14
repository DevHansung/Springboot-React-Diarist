import React, { Component } from 'react';
import NotFound from '../../common/NotFound';
import ServerError from '../../common/ServerError';
import LoadingIndicator from '../../common/LoadingIndicator';
import { Avatar, Table, Button } from 'antd';
import { getAvatarColor } from '../../util/Colors';
import { getUserProfile } from '../../controller/APIUserController';
import { loadBoardByUsername, uploadFollow, loadFollow, deleteFollow } from '../../controller/APIController';
import { notificationError, notificationSuccess } from '../../util/Notification';
import { Link } from "react-router-dom";
import "./UserProfile.css";

class UserProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            isLoading: false,
            boardList: [],
            followid: null,
        }
        this.loadUserProfile = this.loadUserProfile.bind(this);
        this.loadFollow = this.loadFollow.bind(this);
        this.onDeleteFollow = this.onDeleteFollow.bind(this);
        this.onUploadFollow = this.onUploadFollow.bind(this);
    }

    componentDidMount() {
        this.loadUserProfile(this.props.match.params.username);
        this.loadFollow();
        this.loadBoardByUsername()
    }

    componentDidUpdate(nextProps) {
        if (this.props.match.params.username !== nextProps.match.params.username) {
            this.loadUserProfile(nextProps.match.params.username);
        }
    }

    loadBoardByUsername() {
        loadBoardByUsername(this.props.match.params.username)
            .then((res) => {
                this.setState({
                    boardList: res
                })
            });
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

    loadFollow() {
        loadFollow(this.props.username, this.props.match.params.username)
            .then((res) => {
                this.setState({
                    followid: res
                })
            }).catch(error => {
                this.setState({
                    followid: null
                })
            })
    }

    onUploadFollow() {
        uploadFollow(this.props.username, this.props.match.params.username)
            .then((res) => {
                this.setState({
                    followid: res
                })
                notificationSuccess("팔로우 하였습니다.")
            }).catch(error => {
                this.setState({
                    follow: false
                })
                notificationError('작업중 문제가 발생하였습니다..')
            })
    }

    onDeleteFollow() {
        deleteFollow(this.state.followid)
            .then((res) => {
                this.setState({
                    followid: null,
                    isFollow: false
                })
                notificationSuccess("팔로우 취소 하였습니다.")
            }).catch(error => {
                this.setState({
                    follow: false
                })
                notificationError('작업중 문제가 발생하였습니다..')
            })
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
        const columns = [
            {
                title: '제목',
                dataIndex: 'title',
                key: 'title',
                render: (text, record) => <Link to={'/detailboard/' + record.boid}>{text}</Link>
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
                                        {this.props.match.params.username === this.props.username ? null
                                            : this.state.followid === null ?
                                                <Button onClick={() => this.onUploadFollow()}>
                                                    팔로우
                                        </Button> :
                                                <Button onClick={() => this.onDeleteFollow()}>
                                                    팔로우 취소
                                        </Button>}
                                    </div>
                                </div>
                            </div>
                            <div className="favTable_container">
                                {this.state.followid !== null || this.props.match.params.username === this.props.username ?
                                    <div>
                                        <div className="favTitle_container">
                                            <span className="favTitle">작성한 게시글 목록</span>
                                        </div>
                                        <Table rowKey={record => record.boid} dataSource={this.state.boardList} columns={columns} pagination={{ pageSize: 10 }} />
                                    </div>
                                    : <div className="favTitle_container">
                                        <span className="favTitle">팔로우 하면 작성한 게시글 목록이 보입니다.</span>
                                    </div>}
                            </div>
                        </div>
                    ) : null
                }
            </div>
        );
    }
}

export default UserProfile;