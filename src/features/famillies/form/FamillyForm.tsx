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
import { FamillyFormValues } from "../../../models/familly";


export default observer(function FamillyForm() {

    ////////////////////Validation////////////////////////////////////
    const validationSchema = Yup.object({
        name: Yup.string().min(3).required(),
    })
    ///////////////////////STORES//////////////////////////////////
    const { famillyStore } = useStore();
    const { getFamiliesRS, familiesRS } = famillyStore;

    ////////////////LOCAL STATE//////////////////////////////////////
    const [loading, setLoading] = useState(true);
    const [initialValues, setInitialFormValues] = useState(new FamillyFormValues());
    const [title, setTitle] = useState("Create familly")
    const [editMode, setEditMode] = useState(false);

    ////////////////ROUTE PARAMS//////////////////////////////////////
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        if (id && !isNaN(parseInt(id))) {
            setLoading(true);
            getFamiliesRS().then(() => {
                let famillyToEdit=familiesRS.find(p=>p.value===parseInt(id));
                if(famillyToEdit){
                    let formValues={} as FamillyFormValues;
                    formValues.id=famillyToEdit.value;
                    formValues.name=famillyToEdit.label;
                    setInitialFormValues(formValues);
                }
               
            })
            .finally(() => {
                setLoading(false);
                setTitle("Edit familly");
                setEditMode(true);
            });
        }else{
            setLoading(false);
        }
       
    }, [getFamiliesRS, id]);

    ///////////////////////FUNCTIONS//////////////////////////////////////////
    function handleFormSubmit(familly: FamillyFormValues) {
        if (editMode) {
            axios.put<void>(`/familly/${id}`, familly).then((response) => {
                if (response.status === 200) {
                    navigate(`/famillies`);
                    return;
                }
            })
        }
        if (!editMode) {
            axios.post<void>(`/familly/`, familly).then((response) => {
                if (response.status === 200) {
                    navigate(`/famillies`);
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