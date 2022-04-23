import { Link } from 'react-router-dom';
import { Button, Header, Icon, Segment } from 'semantic-ui-react';

export default function Unauthorized() {
    return (  
        <Segment placeholder>
            <Header icon>
                <Icon name='stop circle' />
                Unauthrized. You dont have permission to view this content. Login to valid account or contact administator to add permission. 
            </Header>
            <Segment.Inline>
                <Button as={Link} to='/' primary>
                    Return to login form
                </Button>
            </Segment.Inline>
        </Segment>
    )
}