/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { Switch, Route, Link, Redirect } from 'react-router-dom';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import UserListAPI from './UserListAPI';

import { firebaseAuth } from '../config/constants';
import Login from './Login';
import { logout } from '../helpers/auth';
import Register from "./Register";


const NavLink = ({ exact, to, eventKey, children }) =>
    <LinkContainer exact={exact} to={to} eventKey={eventKey}>
        <NavItem>{children}</NavItem>
    </LinkContainer>;

const MenuLink = ({ to, eventKey, children }) =>
    <LinkContainer to={to} eventKey={eventKey}>
        <MenuItem>{children}</MenuItem>
    </LinkContainer>;


function PublicRoute({ component: Component, authed, ...rest }) {
    return (
        <Route
            {...rest}
            render={props => (authed === false
                ? <Component {...props} />
                : <Redirect to="/" />)}
        />
    );
}

const Hello = () => <div>Hello</div>;
const About = () => <div>About</div>;

const UserList = () => (
    <ul>
        {
            UserListAPI.all().map(item =>
                (
                    <li key={item.id}>
                        <Link to={`/user/${item.id}`}>{item.name}</Link>
                    </li>
                ))
        }
    </ul>
);

const UserProfile = ({match}) => {
    const user = UserListAPI.get(parseInt(match.params.id, 0));
    if (user) {
        return (
            <div>
                <div>name: {user.name}</div>
                <div>age: {user.age}</div>
                <Link to="/user">Back</Link>
            </div>
        );
    }
    return <div>the user was not found</div>;
};

const User = () => (
    <Switch>
        <Route component={UserList} exact path="/user" />
        <Route component={UserProfile} exact path="/user/:id" />
    </Switch>
);

const Messages = () => <div>Messages</div>;
const Settings = () => <div>Settings</div>;
const NoMatch = () => <div>404. No Match</div>;

const Header = props => (
    <Navbar inverse collapseOnSelect>
        <Navbar.Header>
            <Navbar.Brand>
                <Link to="/">Главная</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
            <Nav>
                <NavLink exact to="/user" eventKey={1}>Users</NavLink>
                <NavLink exact to="/messages" eventKey={2}>Messages</NavLink>
                <NavLink exact to="/about" eventKey={3}>About</NavLink>
            </Nav>
            {
                props.user
                ?
                    <Nav pullRight>
                        <NavDropdown eventKey={4} title={props.user.email} id="basic-nav-dropdown">
                            <MenuLink to="/profile" eventKey={4.1}>
                                Profile
                            </MenuLink>
                            <MenuLink to="/settings" eventKey={4.2}>
                                Settings
                            </MenuLink>
                            <MenuLink to="/help" eventKey={4.3}>
                                Help
                            </MenuLink>
                            <MenuItem divider />
                            <MenuLink to="/logout" eventKey={4.4}>
                                Logout
                            </MenuLink>
                        </NavDropdown>
                    </Nav>
                :
                    <Nav pullRight>
                        <NavLink exact to="/login" eventKey={5}>Login</NavLink>
                        <NavLink exact to="/register" eventKey={6}>Register</NavLink>
                    </Nav>
            }
        </Navbar.Collapse>
    </Navbar>
);

const Main = props => (
    <main>
        <div>
            <Switch>
                <Route component={Hello} exact path="/" />
                <PublicRoute authed={props.authed} path="/login" component={Login} />
                <Route component={Register} exact path="/register" />
                <Route component={Messages} exact path="/messages" />
                <Route component={Settings} exact path="/settings" />
                <Route component={About} path="/about" />
                <Route component={User} path="/user/" />
                <Route component={NoMatch} />
            </Switch>
        </div>
    </main>
);

class App extends Component {
    state = {
        authed: false,
        loading: true,
        user: null,
    };

    componentDidMount() {
        this.removeListener = firebaseAuth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({
                    authed: true,
                    loading: false,
                    user,
                });
            } else {
                this.setState({
                    authed: false,
                    loading: false,
                    user: null,
                });
            }
        });
    }

    componentWillUnmount() {
        this.removeListener();
    }


    render() {
        return (
            <div>
                <Header user={this.state.user} authed={this.state.authed} />
                <Main authed={this.state.authed}/>
            </div>
        );
    }
}

export default App;
