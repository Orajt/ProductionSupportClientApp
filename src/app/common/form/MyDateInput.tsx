import { useField } from 'formik';
import React from 'react';
import { Form, Label } from 'semantic-ui-react';
import DatePicker, {ReactDatePickerProps} from 'react-datepicker';

interface Iprops extends Partial<ReactDatePickerProps>{
    styles?: any;
    validateOnChaange: boolean;
    label?: string;

}
export default function MyDateInput(props: Iprops) {
    const [field, meta, helpers] = useField(props.name!); 
    return (
        <Form.Field style={props.styles} error={meta.touched && !!meta.error}>
            <label>{props.label}</label>
            <DatePicker 
                {...field}
                {...props}
                selected={(field.value && new Date(field.value)) || null}
                onChange={value => helpers.setValue(value, props.validateOnChaange)}
            />
            {meta.touched && meta.error ? (
                <Label basic color='red'>{meta.error}</Label>
            ) : null}
        </Form.Field>
    )
}