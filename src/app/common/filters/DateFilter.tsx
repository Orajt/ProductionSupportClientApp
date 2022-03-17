import { useEffect, useState } from "react";
import { FilterResult } from "../../models/filter";
import { Form, Formik } from "formik";
import NumberDateDropDown from "./NumberDateDropDown";
import MyDateInput from "../form/MyDateInput";

interface IProps {
    propertyName: string;
    setFilter: (filter: FilterResult) => void;
    clearAll: () => void;
    dateFormat?: string;
}

export default function DateFilter({ propertyName, setFilter : parentFilter, clearAll, dateFormat: dateFormatParent }: IProps) {
    const [filter, setFilter] = useState<FilterResult>(new FilterResult(propertyName, "EQ"));
    const [isValid, setValid] = useState(true);
    const [dateFormat, setDateFormat]=useState(dateFormatParent ? dateFormatParent : "dd MMM yyyy");
    useEffect(() => {
    }, [clearAll]);
    function handleFormSubmit(x: FilterResult) { }
    function validateField(field: Date | null) {
        setValid(true);

            let newFilter = { ...filter }
            newFilter.dateValue = field;
            setFilter(newFilter);
            parentFilter(newFilter);
        
        
    }
    function handleFilterType(type: string) {
        let newFilter = { ...filter }
        newFilter.filterOption = type;
        setFilter(newFilter);
        if(newFilter.dateValue!==null) parentFilter(newFilter);
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
                            <MyDateInput name="dateValue" validateFilter={validateField} validateOnChaange={true} dateFormat={dateFormat}></MyDateInput>
                        </div>
                        <NumberDateDropDown setFilterType={handleFilterType} />
                    </Form>
                )}
            </Formik>

        </>
    )
}