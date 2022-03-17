import { useEffect, useState } from "react";
import { FilterResult } from "../../models/filter";
import { Field, Form, Formik } from "formik";
import NumberDateDropDown from "./NumberDateDropDown";

interface IProps {
    propertyName: string;
    setFilter: (filter: FilterResult) => void;
    filterValue?: number;
    clearAll: () => void;

}

export default function NumberFilter({ propertyName, setFilter : parentFilter, clearAll, filterValue }: IProps) {
    const [filter, setFilter] = useState<FilterResult>(new FilterResult(propertyName, "EQ"));
    const [isValid, setValid] = useState(true);

    useEffect(() => {
    }, [clearAll]);
    function handleFormSubmit(x: FilterResult) { }
    function validateField(field: string) {
        setValid(true);
        let error = '';
        let fieldValue = Number(field);
        if (isNaN(fieldValue)) {
            setValid(false);
            return error;
        }
        if (!isNaN(fieldValue)) {
            if (fieldValue < 0) {
                setValid(false);
                return error;
            }
            if (fieldValue >= 0) {
                let newFilter = { ...filter }
                newFilter.intValue = fieldValue;
                setFilter(newFilter);
                parentFilter(newFilter);
            }
        }
    }
    function handleFilterType(type: string) {
        let newFilter = { ...filter }
        newFilter.filterOption = type;
        setFilter(newFilter);
        if(newFilter.intValue && newFilter.intValue>0) parentFilter(newFilter);
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
                        <div className={`width100p ${isValid ? "" : "redBorder"}`}>
                            <Field name="intValue" placeholder={propertyName} validate={validateField}></Field>
                        </div>
                        <NumberDateDropDown setFilterType={handleFilterType} />
                    </Form>
                )}
            </Formik>

        </>
    )
}