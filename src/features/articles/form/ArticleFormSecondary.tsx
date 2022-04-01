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
import { ArticlePositionFormValues } from "../../../models/article";

interface Props {
    articleTypeId: number;
    handleFormSubmit: (values: ArticlePositionFormValues) => void;
    isBlocked: boolean;
}

export default observer(function ArticleFormSecondary({articleTypeId, handleFormSubmit, isBlocked}: Props) {
    const {articleStore}=useStore();
    const {getArticlesRS, articlesRS}=articleStore;
    const [loading, setLoading]=useState(true);
    const initialValues= new ArticlePositionFormValues();
    const validationSchema = Yup.object({
        articleRS: Yup.object().required('Article is required').nullable(),
        quanity: Yup.number().integer().min(0).required()
    })
    useEffect(() => {
        setLoading(true)
        console.log("z drugiego komponentu, articleType to:")
        console.log(articleTypeId);
        getArticlesRS(articleTypeId, false).then(()=>setLoading(false));
    }, [getArticlesRS, articleTypeId]);


    if(loading) return <LoadingComponent content="loading articles"></LoadingComponent>
    return (
        <>
            <Header content={"Add components to article"} as="h4" color='teal' />
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
                        <MyTextInput name="quanity" label="Quanity" placeholder="Quanity"/>
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