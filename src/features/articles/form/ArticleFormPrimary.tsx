import { Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { Button, FormGroup, Grid } from "semantic-ui-react";
import Select from "react-select"
import MySelectInput from "../../../app/common/form/MySelectInput";
import { ReactSelectInt } from "../../../models/reactSelect";
import * as Yup from 'yup';
import { observer } from "mobx-react-lite";
import agent from "../../../app/api/agent";
import MyErrorMessage from "../../../app/common/form/MyErrorMessage";
import { ArticleFormValues } from "../../../models/article";
import MyTextInput from "../../../app/common/form/MyTextInput";
import { useStore } from "../../../app/stores/store";
import LoadingComponent from "../../../app/layout/LoadingComponent";

interface Props {
    articleTypes: ReactSelectInt[];
    initialValues: ArticleFormValues;
    handleFormSubmit: (values: ArticleFormValues) => void;
    editMode: boolean;
}

export default observer(function ArticleFormPrimary({ articleTypes, initialValues, editMode, handleFormSubmit: handleParentFormSubmit }: Props) {

    ////////////////////Validation////////////////////////////////////
    const validationSchema = Yup.object({
        stuffReactSelect: Yup.object().shape({
            value: Yup.number().nullable().test('stuffIsRequired', 'Stuff is required', function (value) {
                if (!value)
                    return true;
                if (value && value !== stuffId) {
                    setStuffId(value!);
                    validateName(nameToCheck, value, true);
                }
                return true;
            })
        }).nullable(),
        famillyReactSelect: Yup.object().shape({
            value: Yup.number().nullable().test('famillyIsRequired', 'Familly is required', function (value) {
                if (!value)
                    return true;
                if (value && value !== stuffId) {
                    setFamillyId(value!);
                }
                return true;
            })
        }).nullable(),
        fabricVariantGroupReactSelect: Yup.object().shape({
            value: Yup.number().nullable().test('fvgIsRequired', 'Fabric variant group is required', function (value) {
                if (!value)
                    return true;
                if (value && value !== fvgId) {
                    setFvgId(value!);
                }
                return true;
            })
        }).nullable(),
        length: Yup.number().integer().min(0),
        width: Yup.number().integer().min(0),
        high: Yup.number().integer().min(0),
    })
    async function validateName(field: string, stuffId: number, force: boolean) {
        let error;
        if (!field) {
            error = 'Required'
            return error;
        }
        if (!force) {
            if (field === nameToCheck && nameError.length === 0) return;
            if (field === nameToCheck && nameError.length > 0) return nameError;
        }
        setName(field);
        const params = new URLSearchParams();
        params.append('articleTypeId', `${articleTypeId.toString()}`);
        params.append('stuffId', `${stuffId.toString()}`);
        params.append('predicate', 'CHECKNAME');
        let check = await agent.Articles.checkNameOrGetId(params, field);
        if (!isNaN(check)) {
            if (check === 1) {
                error = "Article with that parameters exists in database";
                setNameError(error);
                setName(field);
                return error;
            }
        }
        error = '';
        setNameError(error);
        return error;
    }
    function additionalValidation() {
        if (articleTypeId === 0)
            return false;
        if(articleTypeId===1){
            if(famillyId===0 || fvgId===0)
                return false;
        }
        if (articleTypeId === 3) {
            return true;
        }
        if (articleTypeId === 2 || articleTypeId === 4) {
            if (stuffId === 0)
                return false;
        }
        return true;
    }

    //////Stores//////////
    const { famillyStore, stuffStore, fabricVariantStore } = useStore();
    const { familiesRS, getFamiliesRS } = famillyStore;
    const { getStuffsListToSelect, stuffRS } = stuffStore;
    const { getListReactSelectFVG, fabricVariantGroupListRS} = fabricVariantStore;

    //////Local state///////////
    const [initialFormValues, setInitialFormValues] = useState(new ArticleFormValues());
    const [nameToCheck, setName] = useState('');
    const [articleTypeId, setArticleTypeId] = useState(initialValues.articleTypeId);
    const [stuffId, setStuffId] = useState(initialValues.stuffId === null ? 0 : initialValues.stuffId);
    const [famillyId, setFamillyId] = useState(initialValues.famillyId === null ? 0 : initialValues.famillyId);
    const [fvgId, setFvgId] = useState(initialValues.fabricVariantGroupId === null ? 0 : initialValues.fabricVariantGroupId);
    const [initialRender, setInitialRender] = useState(false);
    const [loading, setLoading] = useState(true);
    const [stuffList, setStuffList] = useState<ReactSelectInt[]>([]);

    ///Errrors////
    const [nameError, setNameError] = useState('');

    ///Field block////
    const [famillyFieldBlocked, setFamillyFieldBlocked] = useState(false);
    const [stuffFieldBlocked, setStuffFieldBlocked] = useState(false);
    const [fabicVariantFieldBlocked, setFabicVariantFieldBlocked] = useState(false);

    function blockFields(articleTypeIdToCheck: number) {
        setFamillyFieldBlocked(false);
        setStuffFieldBlocked(false);
        setFabicVariantFieldBlocked(false);
        if (articleTypeIdToCheck === 1) {
            setStuffId(0);
            setStuffFieldBlocked(true);
        }
        if (articleTypeIdToCheck === 3) {
            setStuffId(0);
            setFamillyId(0);
            setFvgId(0);
            setStuffFieldBlocked(true);
            setFamillyFieldBlocked(true);
            setFabicVariantFieldBlocked(true);
        }
        if (articleTypeIdToCheck === 2 || articleTypeIdToCheck === 4) {
            setFamillyId(0);
            setFvgId(0);
            setFamillyFieldBlocked(true);
            setFabicVariantFieldBlocked(true);
        }
    }


    useEffect(() => {
        if (editMode && !initialRender) {
            blockFields(initialValues.articleTypeId);
            setArticleTypeId(initialValues.articleTypeId);
            setName(initialValues.fullName);
        }
        if (initialRender) {
            setStuffList(stuffRS!.filter(p => p.articleTypesIds.some(x => x === articleTypeId)))
        }
        if (!initialRender) {
            setLoading(true);
            setInitialFormValues({ ...initialValues });
            getFamiliesRS()
                .then(() => getStuffsListToSelect()).then((value) => {
                    if (value)
                        setStuffList(value);
                })
                .then(()=>getListReactSelectFVG(0))
                .finally(() => {
                    setLoading(false);
                    setInitialRender(true);
                });
        }
    }, [initialValues, getFamiliesRS, getStuffsListToSelect, articleTypeId, setInitialRender, setInitialFormValues]);
    function handleFormSubmit(values: ArticleFormValues) {
        handleParentFormSubmit(values);
        setInitialFormValues(values);
    }
    if (loading) return <LoadingComponent></LoadingComponent>
    return (
        <Grid.Row>
            <div>
                <label className="boldFont">Choose Article Type</label>
                <Select
                    options={articleTypes}
                    value={articleTypes.filter(option =>
                        option.value === articleTypeId)}
                    onChange={(d) => {
                        setArticleTypeId(d!.value);
                        blockFields(d!.value);
                        validateName(nameToCheck, 0, true);
                        initialFormValues.articleTypeId = d?.value ? d.value : 0;
                    }}
                    placeholder={"Choose Article Type"}
                    isDisabled={initialValues.ableToEditPrimaries || editMode}
                />
                {articleTypeId === 0 && <MyErrorMessage errorMessage={"Article type is required"} />}
            </div>
            <Formik
                validateOnBlur={true}
                validateOnChange={false}
                validationSchema={validationSchema}
                enableReinitialize
                initialValues={initialFormValues}
                onSubmit={values => handleFormSubmit(values)}>
                {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        <label className="boldFont">Article name</label>
                        <Field name="fullName" placeholder="Name" validate={(value: string) => validateName(value, stuffId, false)}></Field>
                        <MyErrorMessage errorMessage={nameError} />
                        <MyTextInput placeholder={"Name without familly"} name="nameWithoutFamilly" label="Name without familly"></MyTextInput>
                        <MySelectInput label="Select familly" validateOnChaange={true} options={familiesRS}
                            placeholder='Choose familly' name='famillyReactSelect'
                            defaultSelected={!famillyFieldBlocked ? initialFormValues.famillyId! : undefined}
                            disabled={famillyFieldBlocked} />
                         {famillyId === 0 && !famillyFieldBlocked && <MyErrorMessage errorMessage={"Familly is required"} />}
                        <MySelectInput label="Select fabric variant group" validateOnChaange={true} options={fabricVariantGroupListRS!}
                            placeholder='Choose fabric variant group' name='fabricVariantGroupReactSelect'
                            defaultSelected={!fabicVariantFieldBlocked ? initialFormValues.fabricVariantGroupId! : undefined}
                            disabled={famillyFieldBlocked || editMode} />
                        {fvgId === 0 && !fabicVariantFieldBlocked && <MyErrorMessage errorMessage={"Variant group is required"} />}
                        <MySelectInput label="Select stuff" validateOnChaange={true} options={stuffList}
                            placeholder='Choose stuff' name='stuffReactSelect'
                            defaultSelected={initialFormValues.stuffId ? initialFormValues.stuffId : undefined}
                            disabled={stuffFieldBlocked} />
                        {stuffId === 0 && !stuffFieldBlocked && <MyErrorMessage errorMessage={"Stuff is required"} />}
                        <FormGroup>
                            <MyTextInput placeholder={"Length"} name={"length"} label="Length"></MyTextInput>
                            <MyTextInput placeholder={"Width"} name={"width"} label="Width"></MyTextInput>
                            <MyTextInput placeholder={"High"} name={"high"} label="High"></MyTextInput>
                        </FormGroup>
                        <label className="boldFont">Created in company</label>
                        <Field type="checkbox" name="createdInCompany" />
                        <Button
                            disabled={
                                isSubmitting ||
                                !dirty || !isValid || !additionalValidation()}
                            loading={isSubmitting}
                            floated='right'
                            positive type='submit' content='Submit' />
                    </Form>
                )}
            </Formik>
        </Grid.Row>
    )
})