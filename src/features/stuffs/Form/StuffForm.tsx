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
import { StuffFormValues } from "../../../models/stuff";


export default observer(function StuffForm() {

    ////////////////////Validation////////////////////////////////////
    const validationSchema = Yup.object({
        name: Yup.string().min(3).required(),
    })
    ///////////////////////STORES//////////////////////////////////
    const { stuffStore} = useStore();
    const { getStuffDetails } = stuffStore;

    ////////////////LOCAL STATE//////////////////////////////////////
    const [loading, setLoading] = useState(true);
    const [initialValues, setInitialFormValues] = useState(new StuffFormValues());
    const [title, setTitle] = useState("Create stuff")
    const [editMode, setEditMode] = useState(false);

    ////////////////ROUTE PARAMS//////////////////////////////////////
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        
        if (id && !isNaN(parseInt(id))) {
            setLoading(true);
            getStuffDetails(parseInt(id)).then((value) => {
                setInitialFormValues(value as StuffFormValues)
            })
            .finally(() => {
                setTitle("Edit stuff");
                setEditMode(true);
                setLoading(false);
            });
        }
        else{
            setLoading(false);
        }
       
    }, [ getStuffDetails, id]);

    ///////////////////////FUNCTIONS//////////////////////////////////////////
    function handleFormSubmit(stuff: StuffFormValues) {
        if (editMode) {
            axios.put<void>(`/stuff/${id}`, stuff).then((response) => {
                if (response.status === 200) {
                    navigate(`/stuffs`);
                    return;
                }
            })
        }
        if (!editMode) {
            axios.post<void>(`/stuff/`, stuff).then((response) => {
                if (response.status === 200) {
                    navigate(`/stuffs`);
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
                                <MyTextInput placeholder={"Name"} name="name" label="Name"></MyTextInput>
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