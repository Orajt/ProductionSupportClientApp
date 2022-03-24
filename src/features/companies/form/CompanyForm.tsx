import { Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { Button, Grid, Header } from "semantic-ui-react";
import * as Yup from 'yup';
import { observer } from "mobx-react-lite";
import MyTextInput from "../../../app/common/form/MyTextInput";
import { useStore } from "../../../app/stores/store";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useNavigate, useParams } from "react-router-dom";
import { CompanyFormValues } from "../../../models/company";
import axios from "axios";


export default observer(function CompanyForm() {

    ////////////////////Validation////////////////////////////////////
    const validationSchema = Yup.object({
        name: Yup.string().min(3).required(),
        companyIdentifier: Yup.string().min(5).required(),
        supplier: Yup.boolean(),
        merchant: Yup.boolean()
    })
    ///////////////////////STORES//////////////////////////////////
    const { companyStore } = useStore();
    const { getCompanyDetails } = companyStore;

    ////////////////LOCAL STATE//////////////////////////////////////
    const [loading, setLoading] = useState(true);
    const [initialValues, setInitialFormValues] = useState(new CompanyFormValues());
    const [title, setTitle] = useState("Create company")
    const [editMode, setEditMode] = useState(false);

    ////////////////ROUTE PARAMS//////////////////////////////////////
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        if (id && !isNaN(parseInt(id))) {
            getCompanyDetails(id).then((value) => {
                setInitialFormValues(value as CompanyFormValues);
            }).finally(() => {
                setTitle("Edit company");
                setEditMode(true);
                setLoading(false);
            });

        }
        setLoading(false);
    }, [getCompanyDetails, id]);

    ///////////////////////FUNCTIONS//////////////////////////////////////////
    function handleFormSubmit(company: CompanyFormValues) {
        if (editMode) {
            axios.put<void>(`/company/${id}`, company).then((response) => {
                setLoading(false);
                if (response.status === 200) {
                    navigate(`/companies/${id}`);
                    return;
                }
            })
        }
        if (!editMode) {
            axios.post<void>(`/company/`, company).then((response) => {
                if (response.status === 200) {
                    navigate(`/companies/${company.name}`);
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
                        validateOnChange={false}
                        validationSchema={validationSchema}
                        enableReinitialize
                        initialValues={initialValues}
                        onSubmit={values => handleFormSubmit(values)}>
                        {({ handleSubmit, isValid, dirty }) => (
                            <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                                <MyTextInput placeholder={"Name"} name="name" label="Name"></MyTextInput>
                                <MyTextInput placeholder={"Company Identifier"} name="companyIdentifier" label="Company Identifier"></MyTextInput>
                                <div>
                                    <label className="boldFont" style={{paddingRight:"10px"}}>Supplier</label>
                                    <Field type="checkbox" name="supplier" />
                                </div>
                                <div style={{paddingTop:"20px"}}>
                                    <label className="boldFont" style={{paddingRight:"10px"}}>Merchant</label>
                                    <Field className="fontSizeMedium" type="checkbox" name="merchant" />
                                </div>
                                <Button
                                    disabled={
                                        loading ||
                                        !dirty || !isValid}
                                    loading={loading}
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