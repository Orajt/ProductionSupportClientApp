import { Field, Form, Formik} from "formik";
import { useEffect, useState } from "react";
import { Button, Header } from "semantic-ui-react";
import MyDateInput from "../../../app/common/form/MyDateInput";
import MySelectInput from "../../../app/common/form/MySelectInput";
import { OrderFormValues } from "../../../models/orders";
import { ReactSelectInt } from "../../../models/reactSelectInt";
import * as Yup from 'yup';
import { observer } from "mobx-react-lite";
import agent from "../../../app/api/agent";
import MyErrorMessage from "../../../app/common/form/MyErrorMessage";

interface Props {
    title: string;
    deliveryPlaces: ReactSelectInt[];
    initialValues: OrderFormValues;
    handleFormSubmit: (values: OrderFormValues) => void;
    editMode:boolean;
}

export default observer(function OrderFormPrimary({ title, deliveryPlaces, initialValues, handleFormSubmit, editMode }: Props) {
    const validationSchema = Yup.object({
        shipmentDate: Yup.date().required('Date is required').nullable().min(new Date(), 'Shipment have to be in the futre'),
        productionDate: Yup.date().required('Date is required').nullable()
        .min(new Date(), 'Production date have to be in the futre')
        .test('production-date-test', 'Production date cant be after shipment date', function(value){
            let{shipmentDate}=this.parent;
            console.log(shipmentDate);
            return value!<shipmentDate;
        }),
        deliveryPlace: Yup.object().required('Delivery place is required').nullable()
    })
    const [nameToCheck, setName] = useState('');
    const [nameError, setNameError]= useState('');
    const boldText = {
        fontWeight: 'bold' as 'bold'
    }
    useEffect(() => {
        if(editMode) setName(initialValues.name)
    }, [initialValues]);


 async function validateName (field : string) {
        let error;
        if (!field) {
            error = 'Required'
            return error;
        }
        if (field === nameToCheck && nameError.length===0){return;}
        if(field===nameToCheck && nameError.length>0) return nameError;
        setName(field);
        let check = await agent.Order.checkName(field);
        
        if(!isNaN(check)){
            if(check===1){
                console.log(check);
                error="Order with that name exists in database";
                setNameError(error);
                setName(field);
                return error;
            }       
        }
        error='';
        setNameError(error);
        return error;
    }
    return (
        <>
            <Header content={title} as="h4" color='teal' />
            <Formik
                validateOnBlur={true}
                validateOnChange={false}
                validationSchema={validationSchema}
                enableReinitialize
                initialValues={initialValues}
                onSubmit={values => handleFormSubmit(values)}>
                {({ handleSubmit, isValid, isSubmitting, dirty, errors }) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        <label style={boldText}>Order name</label>
                        <Field name="name" placeholder="Name" validate={validateName}></Field>
                        <MyErrorMessage errorMessage={errors.name}/>
                        {editMode && initialValues.deliveryPlaceId ?  <MySelectInput label="Select delivery place" validateOnChaange={true} options={deliveryPlaces} 
                        placeholder='Choose delivery place' name='deliveryPlace' defaultSelected={initialValues.deliveryPlaceId}/>: <MySelectInput label="Select delivery place" validateOnChaange={true} options={deliveryPlaces} 
                        placeholder='Choose delivery place' name='deliveryPlace' defaultSelected={0}/>}
                        <MyDateInput label ={"Shipment date"}styles={{ "width": "45%", "display": "inline-block" }} validateOnChaange={true} placeholderText='Shipment Date' name='shipmentDate' dateFormat='dd.MM.yyyy' />
                        <MyDateInput label={"Production date"} styles={{ "width": "45%", "display": "inline-block" }} validateOnChaange={true} placeholderText='Production Date' name='productionDate' dateFormat='dd.MM.yyyy' />
                        <Button
                            disabled={isSubmitting || !dirty || !isValid}
                            loading={isSubmitting}
                            floated='right'
                            positive type='submit' content='Submit' />
                    </Form>
                )}
            </Formik>
        </>
    )
})