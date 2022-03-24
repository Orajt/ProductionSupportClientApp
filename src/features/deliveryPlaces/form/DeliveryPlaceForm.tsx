import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { Button, Grid, Header } from "semantic-ui-react";
import * as Yup from 'yup';
import { observer } from "mobx-react-lite";
import MyTextInput from "../../../app/common/form/MyTextInput";
import { useStore } from "../../../app/stores/store";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { DeliveryPlaceFormValues } from "../../../models/deliveryPlace";
import MySelectInput from "../../../app/common/form/MySelectInput";


export default observer(function DeliveryPlaceForm() {

    ////////////////////Validation////////////////////////////////////
    const validationSchema = Yup.object({
        name: Yup.string().min(3).required(),
        companyReactSelect: Yup.object().shape({
            value: Yup.number().test('companyIsRequired', 'Company is required', function (value) {
                console.log(value);
                if (editMode)
                {
                    return true;
                }    
                if(!value)
                {
                    return false;
                }
                   
                return true;
            })
        }).nullable().required(),
        country: Yup.string().min(3).required(),
        city: Yup.string().min(3).required(),
        street: Yup.string().min(2).required(),
        postalCode: Yup.string().min(5).required(),
        numberOfBuilding: Yup.number().min(1).required(),
        apartment: Yup.number()
    })
    ///////////////////////STORES//////////////////////////////////
    const { deliveryPlaceStore, companyStore } = useStore();
    const { getDeliveryPlaceDetails } = deliveryPlaceStore;
    const { getCompanyListRS, companyListRS } = companyStore;

    ////////////////LOCAL STATE//////////////////////////////////////
    const [loading, setLoading] = useState(true);
    const [initialValues, setInitialFormValues] = useState(new DeliveryPlaceFormValues());
    const [title, setTitle] = useState("Create delivery place")
    const [editMode, setEditMode] = useState(false);
    const [companyPlaceHolder, setCompanyPlaceHolder]=useState("Select company")

    ////////////////ROUTE PARAMS//////////////////////////////////////
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        if (id && !isNaN(parseInt(id))) {
            getDeliveryPlaceDetails(id).then((value) => {
                setInitialFormValues(value as DeliveryPlaceFormValues)
            })
            .finally(() => {
                setTitle("Edit delivery place");
                setCompanyPlaceHolder(initialValues.companyName)
                setEditMode(true);
            });
        }
        getCompanyListRS("ALL").then(()=> setLoading(false));
       
    }, [getDeliveryPlaceDetails, getCompanyListRS, id]);

    ///////////////////////FUNCTIONS//////////////////////////////////////////
    function handleFormSubmit(deliveryPlace: DeliveryPlaceFormValues) {
        if(!editMode)
            deliveryPlace.companyID=deliveryPlace.companyReactSelect!.value;
        if (editMode) {
            axios.put<void>(`/deliveryPlace/${id}`, deliveryPlace).then((response) => {
                console.log(response);
                if (response.status === 200) {
                    navigate(`/deliveryPlaces`);
                    return;
                }
            })
        }
        if (!editMode) {
            axios.post<void>(`/deliveryPlace/`, deliveryPlace).then((response) => {
                if (response.status === 200) {
                    navigate(`/deliveryPlaces`);
                    return;
                }
            })
        }

    }
    if (loading) return <LoadingComponent></LoadingComponent>
    return (
        <>
            <Grid>
                <Grid.Column width="10">
                    <Header content={title} as="h4" color='teal' />
                    <Formik
                        validateOnBlur={true}
                        validateOnChange={true}
                        validationSchema={validationSchema}
                        enableReinitialize
                        initialValues={initialValues}
                        onSubmit={values => handleFormSubmit(values)}>
                        {({ handleSubmit, isValid, dirty }) => (
                            <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                                <MySelectInput label="Select company" validateOnChaange={true} options={companyListRS!}
                                    placeholder={"Select company"} name='companyReactSelect'
                                    defaultSelected={initialValues.companyID}
                                    disabled={editMode}/>
                                <MyTextInput placeholder={"Name"} name="name" label="Name"></MyTextInput>
                                <div>
                                    <MyTextInput placeholder={"Country"} name="country" label="Country"></MyTextInput>
                                </div>
                                <div>
                                    <MyTextInput placeholder={"City"} name="city" label="City"></MyTextInput>
                                </div>
                                <div>
                                    <MyTextInput placeholder={"Postal code"} name="postalCode" label="Postal Code"></MyTextInput>
                                    <MyTextInput placeholder={"Street"} name="street" label="Street"></MyTextInput>
                                </div>
                                <div>
                                    <MyTextInput placeholder={"0"} name="numberOfBuilding" label="Number Of Building"></MyTextInput>
                                    <MyTextInput placeholder={"0"} name="apartment" label="Apartment"></MyTextInput>
                                </div>
                                <Button
                                    disabled={
                                        !dirty || !isValid}
                                    floated='right'
                                    positive type='submit' content='Submit' />
                            </Form>
                        )}
                    </Formik>
                </Grid.Column>
            </Grid>

        </>
    )
})