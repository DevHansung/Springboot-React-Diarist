import React, { Component } from 'react';
import {
  Route,
  withRouter,
  Switch
} from 'react-router-dom';
import { Layout, notification } from 'antd';

import { getCurrentUser, refreshRequest, logout } from '../controller/APIUserController';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants/property';

import './App.css';

import PrivateRoute from './PrivateRoute';

import Login from "../user/login/Login";
import Signup from "../user/signup/Signup";
import MyProfile from '../user/profile/MyProfile';

import AppHeader from '../common/AppHeader';
import NotFound from '../common/NotFound';
import LoadingIndicator from '../common/LoadingIndicator';

import AdminMenu from '../admin/AdminMenu';
import AdminEditEvent from '../admin/AdminEditEvent';
import AdminUploadEvent from '../admin/AdminUploadEvent';
import BoardList from '../admin/AdminBoardList';
import BoardCategory from '../admin/AdminBoardCategory';
import AdminEventList from '../admin/AdminEventList';
import AdminEventApplys from '../admin/AdminEventApplys';
import UserList from '../admin/AdminUserList';

import BoardNavigation from "../component/Board/BoardNavigation";
import BoardInsert from '../component/Board/BoardInsert';
import EditBoard from '../component/Board/EditBoard';
import DetailBoard from "../component/Board/DetailBoard";
import TodoList from "../component/TodoList/TodoList";
import EventList from "../component/Event/EventList";
import EventDetail from "../component/Event/EventDetail";
import UserProfile from "../component/UserProfile/UserProfile";

import { expiry } from "../util/TokenValid";
import { notificationSuccess } from '../util/Notification';

const { Content } = Layout;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      isAuthenticated: false,
      isLoading: false,
      role: null,
      username: null,
    }
    this.handleLogout = this.handleLogout.bind(this);
    this.loadCurrentUser = this.loadCurrentUser.bind(this);
    this.TokenValidation = this.TokenValidation.bind(this);
    this.handleLogin = this.handleLogin.bind(this);

    notification.config({
      placement: 'topRight',
      top: 70,
      duration: 3,
    });
  }

  loadCurrentUser() {
    this.setState({
      isLoading: true
    });
    getCurrentUser()
      .then(response => {
        this.setState({
          role: response.authorities[0].authority,
          currentUser: response,
          isAuthenticated: true,
          isLoading: false,
          username: response.username,
          tokenTimer: null
        });
      }).catch(error => {
        this.setState({
          isLoading: false
        });
      });
  }

  //토큰 재발급 start
  TokenValidation(hasAccessToken) {
    try {
      if (hasAccessToken < 5 * 60 && hasAccessToken > 0) {
        refreshRequest()
          .then(res => {
            sessionStorage.setItem(ACCESS_TOKEN, res.accessToken);
            sessionStorage.setItem(REFRESH_TOKEN, res.refreshToken);
            this.loadCurrentUser();
          }).catch(error => {
            console.log(error)
            this.handleLogout();
          });
        return
      }
      else if (hasAccessToken < 0) {
        if (sessionStorage.getItem(REFRESH_TOKEN) || sessionStorage.getItem(REFRESH_TOKEN) !== 'undefined') {
          const hasRefreshToken = expiry(sessionStorage.getItem(REFRESH_TOKEN));
          if (hasRefreshToken > 0) {
            refreshRequest()
              .then(res => {
                sessionStorage.setItem(ACCESS_TOKEN, res.accessToken);
                sessionStorage.setItem(REFRESH_TOKEN, res.refreshToken);
                this.loadCurrentUser();
              }).catch(error => {
                this.handleLogout();
              });
          }
          else if (hasRefreshToken <= 0) {
            this.handleLogout()
          }
        }
        else {
          this.handleLogout()
        }
      }
    } catch (error) {
      this.handleLogout()
      return
    }
  }
  //토큰 재발급 end      

  componentDidMount() {
    this.loadCurrentUser();
  }

  componentDidUpdate() {
    if (sessionStorage.getItem(REFRESH_TOKEN) && sessionStorage.getItem(REFRESH_TOKEN) !== 'undefined') {
      const hasAccessToken = expiry(sessionStorage.getItem(ACCESS_TOKEN));
      if (hasAccessToken < 5 * 60) {
        this.TokenValidation(hasAccessToken);
      }
    } else if (!sessionStorage.getItem(REFRESH_TOKEN) ||
      sessionStorage.getItem(REFRESH_TOKEN) === 'undefined' ||
      sessionStorage.getItem(REFRESH_TOKEN) === null) {
      return
    }
  }

  handleLogout(redirectTo = "/") {
    logout()
      .then(res => {
        sessionStorage.removeItem(ACCESS_TOKEN);
        sessionStorage.removeItem(REFRESH_TOKEN);
        this.setState({
          currentUser: null,
          isAuthenticated: false,
          role: null,
          username: null
        });
        this.props.history.push(redirectTo);
        notificationSuccess("로그아웃 되었습니다.")
      }).catch(error => {
        sessionStorage.removeItem(ACCESS_TOKEN);
        sessionStorage.removeItem(REFRESH_TOKEN);
        this.setState({
          currentUser: null,
          isAuthenticated: false,
          role: null,
          username: null
        });
        this.props.history.push(redirectTo);
        notificationSuccess("로그아웃 되었습니다.")
      });
  }

  handleLogin() {
    notificationSuccess("로그인 되었습니다.")
    this.loadCurrentUser();
    this.props.history.push("/");
  }

  render() {
    if (this.state.isLoading) {
      return <LoadingIndicator />
    }
    return (
      <Layout className="app-container">
        <AppHeader isAuthenticated={this.state.isAuthenticated}
          currentUser={this.state.currentUser}
          onLogout={this.handleLogout} role={this.state.role} />

        <Content className="app-content">
          <div className="container">
            <Switch>
              <Route exact path="/"
                render={(props) => <BoardNavigation username={this.state.username} role={this.state.role} {...props} />}>
              </Route>
              <Route path="/detailboard/:boid"
                render={(props) => <DetailBoard username={this.state.username} role={this.state.role} {...props} />}></Route>
              <Route path="/login"
                render={(props) => <Login onLogin={this.handleLogin} {...props} />}></Route>
              <Route path="/signup" component={Signup}></Route>
              <Route path="/boardinsert"
                render={(props) => <BoardInsert role={this.state.role} username={this.state.username} {...props} />}></Route>
              <Route path="/myprofile"
                render={(props) => <MyProfile username={this.state.username} currentUser={this.state.currentUser} onLogout={this.handleLogout} {...props} />}>
              </Route>
              <Route path="/userprofile/:username"
                render={(props) => <UserProfile username={this.state.username} currentUser={this.state.currentUser}{...props} />}>
              </Route>
              <Route path="/editboard/:id"
                render={(props) => <EditBoard username={this.state.username} role={this.state.role} {...props} />}>
              </Route>
              <Route exact path="/eventlist"
                render={(props) => <EventList username={this.state.username} role={this.state.role} {...props} />}>
              </Route>
              <Route exact path="/eventdetail/:id"
                render={(props) => <EventDetail username={this.state.username} role={this.state.role} {...props} />}>
              </Route>

              <Route path="/todolist/:username"
                render={(props) => <TodoList username={this.state.username} role={this.state.role} {...props} />}>
              </Route>
              <PrivateRoute authenticated={this.state.isAuthenticated} username={this.state.username} path="/addevent" component={AdminUploadEvent} handleLogout={this.handleLogout}></PrivateRoute>
              <PrivateRoute authenticated={this.state.isAuthenticated} username={this.state.username} path="/editevent/:id" component={AdminEditEvent} handleLogout={this.handleLogout}></PrivateRoute>
              <PrivateRoute authenticated={this.state.isAuthenticated} path="/adminmenu" component={AdminMenu} handleLogout={this.handleLogout}></PrivateRoute>
              <PrivateRoute authenticated={this.state.isAuthenticated} path="/boardlist" component={BoardList} handleLogout={this.handleLogout}></PrivateRoute>
              <PrivateRoute authenticated={this.state.isAuthenticated} path="/boardcategory" component={BoardCategory} handleLogout={this.handleLogout}></PrivateRoute>
              <PrivateRoute authenticated={this.state.isAuthenticated} username={this.state.username} role={this.state.role} path="/userlist" component={UserList} handleLogout={this.handleLogout}></PrivateRoute>
              <PrivateRoute authenticated={this.state.isAuthenticated} role={this.state.role} path="/event" component={AdminEventList} handleLogout={this.handleLogout}></PrivateRoute>
              <PrivateRoute authenticated={this.state.isAuthenticated} role={this.state.role} path="/eventapplys/:id" component={AdminEventApplys} handleLogout={this.handleLogout}></PrivateRoute>
              <Route component={NotFound}></Route>
            </Switch>
          </div>
        </Content>
      </Layout>);
  }
}
export default withRouter(App);

