import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { Button, Grid, Header } from "semantic-ui-react";
import * as Yup from 'yup';
import { observer } from "mobx-react-lite";
import MyTextInput from "../../app/common/form/MyTextInput";
import MySelectInput from "../../app/common/form/MySelectInput";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useStore } from "../../app/stores/store";
import { ArticleFormValues } from "../../models/article";
import { useNavigate, useParams } from "react-router-dom";
import { ReactSelectInt } from "../../models/reactSelect";
import axios from "axios";
import { toast } from "react-toastify";

export default observer(function FabricForm() {

    ////////////////////Validation////////////////////////////////////
    const validationSchema = Yup.object({
        fullName: Yup.string().required().min(2),
        stuffReactSelect: Yup.object().shape({

        }).nullable().required(),
    })
    ////////////////ROUTE PARAMS//////////////////////////////////////
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    //////Stores//////////
    const { stuffStore, articleStore } = useStore();
    const { getStuffsListToSelect } = stuffStore;
    const { getArticleDetails } = articleStore;

    //////Local state///////////
    const [initialFormValues, setInitialFormValues] = useState(new ArticleFormValues());
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("Create new fabric");
    const [editMode, setEditMode] = useState(false);
    const [stuffList, setStuffList] = useState<ReactSelectInt[]>([]);

    useEffect(() => {
        if (id && !isNaN(parseInt(id))) {
            getArticleDetails(id).then((value) => {
                var newValue = { ...value }
                setInitialFormValues(newValue as ArticleFormValues);
            })
                .then(() => getStuffsListToSelect())
                .then((val) => {
                    if (val) {
                        setStuffList(val.filter(p => p.articleTypesIds.some(p => p === 6)));
                    }
                })
                .finally(() => {
                    setTitle(`Edit fabric ${initialFormValues.fullName}`);
                    setEditMode(true);
                    setLoading(false);
                });
        }
        if (!id) {
            getStuffsListToSelect()
                .then((val) => {
                    if (val) {
                        setStuffList(val.filter(p => p.articleTypesIds.some(p => p === 6)));
                    }
                })
                .then(() => setLoading(false))
        }
    }, [getStuffsListToSelect, getArticleDetails]);

    function handleFormSubmit(values: ArticleFormValues) {
        let fabric={...values};
        fabric.stuffId=values.stuffReactSelect!.value;
        if (editMode) {
            axios.put<void>(`/fabric/${id}`, fabric).then((response) => {
                if (response.status === 200) {
                    toast.success("Fabric edited successfully");
                    return;
                }
            })
        }
        if (!editMode) {
            axios.post<void>(`/fabric/`, fabric).then((response) => {
                if (response.status === 200) {
                    toast.success("Successfully created fabrid");
                    return;
                }
            })
        }
    }
    if (loading) return <LoadingComponent></LoadingComponent>
    return (
        <Grid>
            <Grid.Column width="8">
                <Grid.Row>
                    <Header color="teal" as="h2">{title}</Header>
                </Grid.Row>
                <Grid.Row>
                    <Formik
                        validateOnBlur={true}
                        validateOnChange={false}
                        validationSchema={validationSchema}
                        enableReinitialize
                        initialValues={initialFormValues}
                        onSubmit={values => handleFormSubmit(values)}>
                        {({ handleSubmit, isValid, dirty }) => (
                            <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                                <MyTextInput placeholder={"Name"} name="fullName" label="Name"></MyTextInput>
                                <MySelectInput label="Select stuff" validateOnChaange={true} options={stuffList}
                                    placeholder='Choose stuff' name='stuffReactSelect'
                                    defaultSelected={initialFormValues.stuffId ? initialFormValues.stuffId : undefined} />
                                <Button
                                    disabled={
                                        !dirty || !isValid}
                                    floated='right'
                                    positive type='submit' content='Submit' />
                            </Form>
                        )}
                    </Formik>
                </Grid.Row>
            </Grid.Column>
        </Grid>
    )
})