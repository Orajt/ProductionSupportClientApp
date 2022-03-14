import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Header, Icon, Segment } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';

export default function NotFound() {
    return (  
        <Segment placeholder>
            <Header icon>
                <Icon name='search' />
                Oops - we've looked everywhere and could not find this.
            </Header>
            <Segment.Inline>
                <Button as={Link} to='/app' primary>
                    Return to main page
                </Button>
            </Segment.Inline>
        </Segment>
    )
}