import { Formik } from "formik";
import { useEffect, useState } from "react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { ReactSelectInt } from "../../models/reactSelectInt";
import * as Yup from 'yup';

interface IProps{
    setId:(id: number)=>void;
    listReactSelect: ReactSelectInt[];
    label?: string;

}

export default function SelectComponent(props: IProps){

    const validationSchema = Yup.object({
        shipmentDate: Yup.string().required('Date is required').nullable(),
        productionDate: Yup.string().required('Date is required').nullable(),
        deliveryPlace: Yup.object().required('Delivery place is required').nullable()
    })
    useEffect(() => {
        
    }, [props.listReactSelect]);
    return(
       <>
            {/* <Formik
                validateOnBlur={true}
                validateOnChange={false}
                validationSchema={validationSchema}
                enableReinitialize
                initialValues={initialValues}
                onSubmit={values => handleFormSubmit(values)}>
                {({ handleSubmit, isValid, isSubmitting, dirty, errors }) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        <Field name="name" placeholder="Name" validate={validateName}></Field>
                        <MyErrorMessage errorMessage={errors.name}/>
                        <MySelectInput label="Select delivery place" validateOnChaange={true} options={deliveryPlaces} placeholder='Choose delivery place' name='deliveryPlace' />
                        <MyDateInput label ={"Shipment date"}styles={{ "width": "45%", "display": "inline-block" }} validateOnChaange={true} placeholderText='Shipment Date' name='shipmentDate' dateFormat='dd.MM.yyyy' />
                        <MyDateInput label={"Production date"} styles={{ "width": "45%", "display": "inline-block" }} validateOnChaange={true} placeholderText='Production Date' name='productionDate' dateFormat='dd.MM.yyyy' />
                        <Button
                            disabled={isSubmitting || !dirty || !isValid}
                            loading={isSubmitting}
                            floated='right'
                            positive type='submit' content='Submit' />
                    </Form>
                )}
            </Formik> */}
       </>
    )
}