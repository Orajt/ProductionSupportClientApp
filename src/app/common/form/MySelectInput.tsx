import { useField } from 'formik';
import React, { useState } from 'react';
import { Form, Label} from 'semantic-ui-react';
import Select from 'react-select'
import { ReactSelectInt } from '../../../models/reactSelectInt';

interface Props {
    placeholder: string;
    name: string;
    options: ReactSelectInt[];
    validateOnChaange: boolean;
    label?: string;
    defaultSelected: number;
}

export default function MySelectInput(props: Props) {
    const [field, meta, helpers] = useField(props.name); 
    const [value, setValue] = useState<number | undefined>(props.defaultSelected);
    return (
        <Form.Field error={meta.touched && !!meta.error}>
            <label>{props.label}</label>
            <Select 
                options={props.options}
                value = {
                    props.options.filter(option => 
                       option.value === value)
                    }
                onChange={(d) => {
                    setValue(d?.value);
                    helpers.setValue(d,props.validateOnChaange);
                }}
                onBlur={() => helpers.setTouched(true)}
                placeholder={props.placeholder}
            />
            {meta.touched && meta.error ? (
                <Label basic color='red'>{meta.error}</Label>
            ) : null}
        </Form.Field>
    )
}