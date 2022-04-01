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
                                <Dropdown.Item as={NavLink} to='/articleTypes' name="ArticleTypeList">Article type list</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <Dropdown item text='Companies'>
                            <Dropdown.Menu>
                                <Dropdown.Item as={NavLink} to='/companies' name="ListCompanies">Companies List</Dropdown.Item>
                                <Dropdown.Item as={NavLink} to='/companies/form' name="CompanyForm">Create Company</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <Dropdown item text='Delivery places'>
                            <Dropdown.Menu>
                                <Dropdown.Item as={NavLink} to='/deliveryPlaces' name="ListDeliveryPlaces">Delivery places List</Dropdown.Item>
                                <Dropdown.Item as={NavLink} to='/deliveryPlaces/form' name="DeliveryPlaceForm">Create delivery place</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <Dropdown item text='Stuffs'>
                            <Dropdown.Menu>
                                <Dropdown.Item as={NavLink} to='/stuffs' name="ListStuffs">Stuff list</Dropdown.Item>
                                <Dropdown.Item as={NavLink} to='/stuffs/form' name="StuffForm">Create stuff</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <Dropdown item text='Famillies'>
                            <Dropdown.Menu>
                                <Dropdown.Item as={NavLink} to='/famillies' name="ListFamillies">Familly list</Dropdown.Item>
                                <Dropdown.Item as={NavLink} to='/famillies/form' name="FamillyForm">Create familly</Dropdown.Item>
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