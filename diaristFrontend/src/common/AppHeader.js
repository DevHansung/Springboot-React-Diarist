import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import './AppHeader.css';
import { Layout, Menu, Dropdown, Icon } from 'antd';
import { getEnabledCategory } from '../controller/APIController';

const { SubMenu } = Menu;
const { Header, Sider } = Layout;



class AppHeader extends Component {
    constructor(props) {
        super(props);   
        this.state = {
          role : this.props.role,
          categoryList:[]
        }
        this.handleMenuClick = this.handleMenuClick.bind(this);   
    }

    componentDidMount(){
      this.loadCategoryList();
  }

    loadCategoryList(){
      getEnabledCategory()
          .then((res) => {
              this.setState({
                  categoryList : res
              })
      }).catch(error => {
        console.log(error)
    })
  }

    handleMenuClick({ key }) {
      if(key === "logout") {
        this.props.onLogout();
      }
    }

    render() {
        let menuItems;
        if(this.props.role === "ROLE_ADMIN" || this.props.role === "ROLE_TOPADMIN") { /* 로그인 한 대상이 관리자일 경우 */
          menuItems = [ 
          <Menu.Item key="/adminmenu">
            <Link to="/adminmenu">
              Admin
            </Link>
          </Menu.Item>,
          <Menu.Item key="/profile" className="profile-menu">
          <ProfileDropdownMenu 
            currentUser={this.props.currentUser} 
            handleMenuClick={this.handleMenuClick}/>
          </Menu.Item>
        ]; 
      } else if(this.props.role ==="ROLE_USER") { /* 로그인 한 대상이 일반유저 일 경우 */
          menuItems = [
            <Menu.Item key="6">
            <Link to={`/todolist/${this.props.currentUser.username}`}>일정 관리</Link>
            </Menu.Item>,
            <Menu.Item key="7">
            <Link to="/eventlist">진행중인 이벤트</Link>
            </Menu.Item>,
            <Menu.Item key="/profile" className="profile-menu">
              <ProfileDropdownMenu 
                currentUser={this.props.currentUser} 
                handleMenuClick={this.handleMenuClick}/>
            </Menu.Item>
          ];
      } else {
          menuItems = [
          <Menu.Item key="/login">
              <Link to="/login">Login</Link>
          </Menu.Item>,
          <Menu.Item key="/signup">
              <Link to="/signup">Register</Link>
          </Menu.Item>                  
          ];
      }
 
      const lists = this.state.categoryList
      const categoryList = lists.map(category => (
      <Menu.Item key={category.cateid}>
        <Link to={"/?category=" + category.category }>{category.category}</Link>
      </Menu.Item>));

    return (
      <Layout>
        <Header className="app-header">
          <div className="container">
            <div className="app-title" >
              <Link to="/">DIARIST</Link>
            </div>
              <Menu
                className="app-menu"
                mode="horizontal"
                selectedKeys={[this.props.location.pathname]}
                style={{ lineHeight: '64px' }} >
                  {menuItems}
              </Menu>
          </div>
          </Header>
          
          <Layout>
            <Sider style={{ width:"200", background: '#009933', height:"100vh", position: 'fixed', left: 0}} className="app-sider">
            <Menu
                mode="inline"
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                style={{ height: '100%', borderRight: 0 }}
              >
                <SubMenu
                  key="sub1"
                  title={
                    <span>
                      MAIN
                    </span>
                  }> 
                    {categoryList}
                </SubMenu>

                <SubMenu
                  key="sub2"
                  title={
                    <span>
                      EVENT
                    </span>
                  }> 
                  <Menu.Item key="eventlist">
                    <Link to="/eventlist">이벤트 보기</Link>
                  </Menu.Item>
                </SubMenu>
              </Menu>
            </Sider>  
          </Layout>
      </Layout>
        );
    }
}

function ProfileDropdownMenu(props) {
  const dropdownMenu = (
    <Menu onClick={props.handleMenuClick} className="profile-dropdown-menu">
      <Menu.Item key="user-info" className="dropdown-item" disabled>
        <div className="user-full-name-info">
          {props.currentUser.name}
        </div>
        <div className="username-info">
          @{props.currentUser.username}
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="myprofile" className="dropdown-item">
        <Link to={`/myprofile`}>MyProfile</Link>
      </Menu.Item>
      <Menu.Item key="logout" className="dropdown-item">
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
      <Dropdown 
        overlay={dropdownMenu} 
        trigger={['click']}
        getPopupContainer = { () => document.getElementsByClassName('profile-menu')[0]}>
        <div className="ant-dropdown-link">
           <Icon type="user" className="nav-icon" style={{marginRight: 0}} /> <Icon type="down" />
        </div>
      </Dropdown>
    );
  }
    
    export default withRouter(AppHeader);