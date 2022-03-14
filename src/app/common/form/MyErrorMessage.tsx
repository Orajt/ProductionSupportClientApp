import React from 'react';
import { Label } from 'semantic-ui-react';

interface Iprops{
    errorMessage: string | undefined
}

export default function MyErrorMessage(props: Iprops) {
    return(
    <>
        {props.errorMessage && <Label basic color='red'>{props.errorMessage}</Label>}
    </>
    
    )
}