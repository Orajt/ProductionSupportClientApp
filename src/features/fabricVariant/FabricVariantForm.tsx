import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { Button, Grid, Header } from "semantic-ui-react";
import * as Yup from 'yup';
import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import { FabricVariantFormValues } from "../../models/fabricVariant";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import LoadingComponent from "../../app/layout/LoadingComponent";
import MyTextInput from "../../app/common/form/MyTextInput";


export default observer(function FabricVariantForm() {

    ////////////////////Validation////////////////////////////////////
    const validationSchema = Yup.object({
        fullName: Yup.string().min(2).required(),
        shortName: Yup.string().max(3).required(),
    })
    ///////////////////////STORES//////////////////////////////////
    const { fabricVariantStore } = useStore();
    const {getFabricVariantDetails}=fabricVariantStore;

    ////////////////LOCAL STATE//////////////////////////////////////
    const [loading, setLoading] = useState(true);
    const [initialValues, setInitialFormValues] = useState(new FabricVariantFormValues());
    const [title, setTitle] = useState("Create fabric variant")
    const [editMode, setEditMode] = useState(false);

    ////////////////ROUTE PARAMS//////////////////////////////////////
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        if (id && !isNaN(parseInt(id))) {
            getFabricVariantDetails(id).then((value) => {
                setInitialFormValues(value as FabricVariantFormValues)
            })
            .finally(() => {
                setTitle("Edit fabric variant");
                setEditMode(true);
            });
        }
       if(!editMode)
        setLoading(false);
    }, [getFabricVariantDetails, id]);

    ///////////////////////FUNCTIONS//////////////////////////////////////////
    function handleFormSubmit(fv: FabricVariantFormValues) {
        if (editMode) {
            axios.put<void>(`/fabricVariant/${id}`, fv).then((response) => {
                if (response.status === 200) {
                    navigate(`/fabricVariants`);
                    return;
                }
            })
        }
        if (!editMode) {
            axios.post<void>(`/fabricVariant/`, fv).then((response) => {
                if (response.status === 200) {
                    navigate(`/fabricVariants`);
                    return;
                }
            })
        }

    }
    if (loading) return <LoadingComponent></LoadingComponent>
    return (
        <>
            <Grid>
                <Grid.Column width="8">
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
                                <MyTextInput placeholder={"Name"} name="fullName" label="Name"></MyTextInput>
                                <MyTextInput placeholder={"Short Name"} name="shortName" label="Short name"></MyTextInput>
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