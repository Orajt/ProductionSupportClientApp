import { Form, Formik } from "formik";
import { useEffect } from "react";
import { Button, FormGroup, Header } from "semantic-ui-react";
import { OrderPositionFormValues } from "../../../models/orders";
import * as Yup from 'yup';
import { observer } from "mobx-react-lite";
import MyTextInput from "../../../app/common/form/MyTextInput";

interface Props {
    orderPosition: OrderPositionFormValues;
    handleEdit: (pos: OrderPositionFormValues) => void;
}

export default observer(function OrderPositionForm({ orderPosition, handleEdit }: Props) {
    const initialValues = orderPosition;
    const validationSchema = Yup.object({
        setId: Yup.number().integer().min(0).required(),
        lp: Yup.number().integer().min(0).required(),
        quanity: Yup.number().integer().min(1).required(),
        client: Yup.string().min(3).required()
    })
    useEffect(() => {
    }, [orderPosition]);
    function handleFormSubmit(values: OrderPositionFormValues) {
        console.log("im called")
        handleEdit(values);
    }
    return (
        <>
            <Header content={"Edit position"} as="h4" color='teal' />
            <Formik
                validateOnBlur={true}
                validateOnChange={true}
                validationSchema={validationSchema}
                initialValues={initialValues}
                onSubmit={values => handleFormSubmit(values)}>
                {({ handleSubmit, isValid, dirty }) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        <label className="boldFont">Id</label>
                        <input className="disabledInput" value={initialValues.id} disabled></input>
                        <label className="boldFont">Article Name</label>
                        <input className="disabledInput" value={initialValues.articleName} disabled></input>
                        <FormGroup>
                            <MyTextInput name="setId" label="Set" placeholder="Type other than 0 if want to create set" />
                            <MyTextInput name="lp" label="LP" placeholder="Place in set"></MyTextInput>
                            <MyTextInput name="quanity" label="Quanity" placeholder="Quanity"></MyTextInput>
                        </FormGroup>
                        <MyTextInput name="client" label="Client name" placeholder="Client name"></MyTextInput>
                        <Button
                            disabled={!dirty || !isValid}
                            floated='right'
                            positive type='submit' content='Submit' />
                    </Form>
                )}
            </Formik>
        </>
    )
})