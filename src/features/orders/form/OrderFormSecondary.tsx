import { Field, Form, Formik} from "formik";
import { useEffect, useState } from "react";
import { Button, Header } from "semantic-ui-react";
import { OrderPosition, OrderPositionFormValues } from "../../../models/orders";
import * as Yup from 'yup';
import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import MyTextInput from "../../../app/common/form/MyTextInput";
import MySelectInput from "../../../app/common/form/MySelectInput";

interface Props {
    articleTypeId: number;
    handleFormSubmit: (values: OrderPositionFormValues) => void;
    isBlocked: boolean;
}

export default observer(function OrderFormSecondary({articleTypeId, handleFormSubmit, isBlocked}: Props) {
    const {articleStore}=useStore();
    const {getArticlesRS, articlesRS}=articleStore;
    const [loading, setLoading]=useState(true);
    const initialValues= new OrderPositionFormValues();
    const validationSchema = Yup.object({
        articleRS: Yup.object().required('Article is required').nullable(),
        setId: Yup.number().integer().min(0).required(),
        lp: Yup.number().integer().min(0).required(),
        quanity: Yup.number().integer().min(0).required(),
        client: Yup.string().min(3).required()
    })
    useEffect(() => {
        setLoading(true)
        getArticlesRS(articleTypeId, true).then(()=>setLoading(false));
    }, [getArticlesRS, articleTypeId]);


    if(loading) return <LoadingComponent content="loading articles"></LoadingComponent>
    return (
        <>
            <Header content={"Add articles to oder"} as="h4" color='teal' />
            <Formik
                validateOnBlur={true}
                validateOnChange={true}
                validationSchema={validationSchema}
                enableReinitialize
                initialValues={initialValues}
                onSubmit={values => handleFormSubmit(values)}>
                {({ handleSubmit, isValid, dirty }) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        <MySelectInput label="Select article" validateOnChaange={true} options={articlesRS} 
                        placeholder='Choose article' name='articleRS' defaultSelected={0}/>
                        <MyTextInput name="setId" label="Set" placeholder="Type other than 0 if want to create set"/>
                        <MyTextInput name="lp" label="LP" placeholder="Place in set"></MyTextInput>
                        <MyTextInput name="quanity" label="Quanity" placeholder="Quanity"></MyTextInput>
                        <MyTextInput name="realization" label="Realization" placeholder="Realization"></MyTextInput>
                        <MyTextInput name="client" label="Client name" placeholder="Client name"></MyTextInput>
                        <Button
                            disabled={!dirty || !isValid || isBlocked}
                            floated='right'
                            positive type='submit' content='Submit' />
                    </Form>
                )}
            </Formik>
        </>
    )
})