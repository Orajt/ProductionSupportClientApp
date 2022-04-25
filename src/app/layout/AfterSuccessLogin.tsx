import React from 'react';
import { Outlet} from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';

export default function AfterSuccessLogin() {
    return (
        <div>
            <NavBar />
            <Container style={{ marginTop: '7em' }}>
                <Outlet />
            </Container>
        </div>
    )
}