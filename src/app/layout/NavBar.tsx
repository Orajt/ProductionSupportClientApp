import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Button, Container, Menu, Image, Dropdown } from 'semantic-ui-react';
import { useStore } from '../stores/store';

export default observer(function NavBar() {
    const { userStore: { user, logout, isLoggedIn } } = useStore();
    return (
        <Menu inverted fixed='top'>
            <Container>
                <Menu.Item as={NavLink} to='/' header>
                    Home Page
                </Menu.Item>
                {isLoggedIn &&
                    <>
                        <Dropdown item text='Orders'>
                            <Dropdown.Menu>
                                <Dropdown.Item as={NavLink} to='/orders' name="ListOrders">Orders List</Dropdown.Item>
                                <Dropdown.Item as={NavLink} to='/orders/form' name="OrderForm">Create Order</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <Dropdown item text='Articles'>
                            <Dropdown.Menu>
                                <Dropdown.Item as={NavLink} to='/articles' name="ListArticles">Articles List</Dropdown.Item>
                                <Dropdown.Item as={NavLink} to='/articles/form' name="ArticleForm">Create Article</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

                        <Menu.Item position='right'>
                            <Dropdown pointing='top left' text={user?.displayName}>
                                <Dropdown.Menu>
                                    <Dropdown.Item as={Link} to={`/profiles/${user?.username}`}
                                        text='My Profile' icon='user' />
                                    <Dropdown.Item onClick={logout} text='Logout' icon='power' />
                                </Dropdown.Menu>
                            </Dropdown>
                        </Menu.Item>
                    </>}
            </Container>
        </Menu>
    )
})