import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import { useStore } from '../stores/store';
import NavBar from './NavBar';

export default function AfterSuccessLogin() {
    const {userStore, commonStore} = useStore();
    const {user} = userStore;
    let navigate = useNavigate();

    return (
        <div>
            <NavBar />
            <Container style={{ marginTop: '7em' }}>
                <Outlet />
            </Container>
        </div>
    )
}