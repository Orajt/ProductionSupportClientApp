import { useEffect, useState } from "react";
import { FilterResult } from "../../models/filter";
import { Field, Form, Formik } from "formik";

interface IProps {
    propertyName: string;
    setFilter: (filter: FilterResult) => void;
    clearAll: () => void;

}

export default function StringFilter({ propertyName, setFilter: parentFilter, clearAll }: IProps) {
    const [filter, setFilter] = useState<FilterResult>(new FilterResult(propertyName, 'CT'));

    useEffect(() => {
    }, [clearAll]);
    function handleFormSubmit(x: FilterResult) { }
    function validateField(field: string) {
        let error = ''
        let newFilter = { ...filter }
        newFilter.stringValue = field;
        setFilter(newFilter);
        parentFilter(newFilter);
        return error;
    }
    return (
        <>
            <Formik
                validateOnBlur={true}
                validateOnChange={false}
                enableReinitialize
                initialValues={filter!}
                onSubmit={values => handleFormSubmit(values)}>
                {({ handleSubmit }) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        <div className={`width100p`}>
                            <Field name="stringValue" placeholder={propertyName} validate={validateField}></Field>
                        </div>
                    </Form>
                )}
            </Formik>

        </>
    )
}