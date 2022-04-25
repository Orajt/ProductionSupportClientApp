import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Button, FormGroup} from "semantic-ui-react";
import { OrderPositionFormValues } from "../../../models/orders";
import * as Yup from 'yup';
import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import MyTextInput from "../../../app/common/form/MyTextInput";
import { FabricVariantToSetInOrder } from "../../../models/fabricVariant";
import MyErrorMessage from "../../../app/common/form/MyErrorMessage";
import Select from "react-select"
import { ReactSelectInt } from "../../../models/reactSelect";

interface Props {
    articleTypeId: number;
    handleFormSubmitParent: (values: OrderPositionFormValues) => void;
    isBlocked: boolean;
    fabrics: ReactSelectInt[];
}
interface GroupedVariants {
    groupId: number;
    name: string;
    fabricName: string;
    variants: FabricVariantToSetInOrder[];
}

export default observer(function OrderFormSecondary({ articleTypeId, handleFormSubmitParent, isBlocked, fabrics }: Props) {
    const { articleStore, fabricVariantStore } = useStore();
    const { getArticlesRS, articlesRS } = articleStore;
    const { getFabricVariantGroupByArticleId } = fabricVariantStore;
    const [loading, setLoading] = useState(true);
    const [articleId, setArticleId] = useState(0);
    const [errorFabrics, setErrorFabrics] = useState(false);
    const [fabricVariants, setFabricVariants] = useState<FabricVariantToSetInOrder[]>([]);
    const [groupedVariants, setGroupedVariants] = useState<GroupedVariants[]>([]);
    const [errorGroupFabric, setErrorGroupFabric] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState<ReactSelectInt | null>(null);
    const initialValues = new OrderPositionFormValues();

    useEffect(() => {
        if (articleTypeId !== 1) {
            setErrorFabrics(false);
            setErrorGroupFabric(false);
        }
        setLoading(true)
        getArticlesRS(articleTypeId, true).then(() => setLoading(false));
    }, [getArticlesRS, articleTypeId, fabrics]);

    const validationSchema = Yup.object({
        articleRS: Yup.object().shape({
            value: Yup.number().nullable().test('articleIsRequired', 'Article is required', function (value) {
                if (!value) {
                    return true;
                }
                if (articleTypeId !== 1) {
                    setGroupedVariants([]);
                    setFabricVariants([]);
                }
                if (articleTypeId === 1 && value && value !== articleId) {
                    setArticleId(value!);
                    setLoading(true);
                    getFabricVariantGroupByArticleId(value).then((val) => {
                        if (val && val.fabricVariants) {
                            let newVariants = [...val.fabricVariants] as FabricVariantToSetInOrder[];
                            let name = "";
                            let variantGroup = [] as GroupedVariants[];
                            let newGroup = {} as GroupedVariants;
                            newGroup.groupId = 1;

                            newGroup.variants = [];
                            for (let i = 0; i < newVariants.length; i++) {
                                newVariants[i].group = 1;
                                newVariants[i].fabricId = 0;
                                newVariants[i].fabricName = "";
                                if (i === 0) {
                                    name += `${newVariants[i].shortName}`
                                    newGroup.variants.push(newVariants[i]);
                                    continue;
                                }
                                name += `+${newVariants[i].shortName}`
                                newGroup.variants.push(newVariants[i]);
                            }
                            newGroup.name = name;
                            variantGroup.push(newGroup);
                            setGroupedVariants(variantGroup);
                            setFabricVariants(newVariants);
                            setErrorGroupFabric(true);
                        }
                    }).finally(() => setLoading(false));
                }
                return true;
            })
        }).nullable(),
        setId: Yup.number().integer().min(0).required(),
        lp: Yup.number().integer().min(0).required(),
        quanity: Yup.number().integer().min(1).required(),
        client: Yup.string().min(3).required()
    });
    async function handleSelectArticle(selected: ReactSelectInt) {
        if (articleTypeId !== 1) {
            setGroupedVariants([]);
            setFabricVariants([]);
            return;
        }
        if (articleTypeId === 1 && selected && selected.value !== articleId) {
            setArticleId(selected.value!);
            setLoading(true);
            getFabricVariantGroupByArticleId(selected.value).then((val) => {
                if (val && val.fabricVariants) {
                    let newVariants = [...val.fabricVariants] as FabricVariantToSetInOrder[];
                    let name = "";
                    let variantGroup = [] as GroupedVariants[];
                    let newGroup = {} as GroupedVariants;
                    newGroup.groupId = 1;

                    newGroup.variants = [];
                    for (let i = 0; i < newVariants.length; i++) {
                        newVariants[i].group = 1;
                        newVariants[i].fabricId = 0;
                        newVariants[i].fabricName = "";
                        if (i === 0) {
                            name += `${newVariants[i].shortName}`
                            newGroup.variants.push(newVariants[i]);
                            continue;
                        }
                        name += `+${newVariants[i].shortName}`
                        newGroup.variants.push(newVariants[i]);
                    }
                    newGroup.name = name;
                    variantGroup.push(newGroup);
                    setGroupedVariants(variantGroup);
                    setFabricVariants(newVariants);
                    setErrorGroupFabric(true);
                }
            }).finally(() => setLoading(false));
        }
    }
    function setFabricVariant(field: string, id: number) {
        if (parseInt(field) === 1 && groupedVariants.length === 1) return;
        let newFabricVariants = [...fabricVariants];
        let fabricVariantToChaange = newFabricVariants.find(p => p.id === id);
        if (!fabricVariantToChaange) {
            console.log("cant find fabric variant");
            return;
        }
        if (!field) {
            setErrorFabrics(true);
            fabricVariantToChaange.hasError = true;
            setFabricVariants(newFabricVariants);
            return;
        }
        if (isNaN(parseInt(field))) {
            setErrorFabrics(true);
            fabricVariantToChaange.hasError = true;
            setFabricVariants(newFabricVariants);
            return;
        }
        let findError = false;
        fabricVariantToChaange.hasError = false;
        newFabricVariants.forEach((el) => {
            if (el.hasError) {
                findError = true;
                return;
            }
        });

        if (findError) {
            setErrorFabrics(true);
        }
        if (!findError) {
            setErrorFabrics(false);
        }
        fabricVariantToChaange.group = parseInt(field);
        createGroups(newFabricVariants);
    }

    function createGroups(variants: FabricVariantToSetInOrder[]) {
        let groupedArray = [] as GroupedVariants[];
        variants.forEach(variant => {
            let group = groupedArray.find(p => p.groupId === variant.group);
            if (group) {
                group.name += `+${variant.shortName}`;
                group.variants.push(variant);
            }
            if (!group) {
                let newGroup = {} as GroupedVariants;
                newGroup.groupId = variant.group!;
                newGroup.name = variant.shortName;
                newGroup.variants = [];
                newGroup.variants.push(variant);
                groupedArray.push(newGroup);
            }
        });
        setGroupedVariants(groupedArray);
        setErrorGroupFabric(true);
    }
    function assignFabrics(d: ReactSelectInt, groupIndex: number) {
        let newVariants = [...fabricVariants];
        groupedVariants[groupIndex].variants.forEach(variant => {
            variant.fabricName = d.label;
            let selectedVariant = newVariants.find(p => p.id === variant.id);
            selectedVariant!.fabricId = d.value;
            selectedVariant!.fabricName = d.label;
        });
        groupedVariants[groupIndex].fabricName = d.label;
        setFabricVariants(newVariants);
        setErrorGroupFabric(false);
        newVariants.forEach(variant => {
            if (variant.fabricId === 0) {
                setErrorGroupFabric(true);
            }

        });

    }
    function handleFormSubmit(values: OrderPositionFormValues) {
        let newValues = { ...values };
        newValues.articleRS = selectedArticle;
        newValues.fabricRealization = [];
        setSelectedArticle(null);
        fabricVariants.forEach(fv => {
            newValues.fabricRealization!.push({ ...fv });
        });
        let calcRealization = "";
        groupedVariants.forEach(group => {
            let groupName = group.name + ": " + group.fabricName + "; ";
            calcRealization += groupName;
        });
        newValues.realization = calcRealization;
        handleFormSubmitParent(newValues);
    }
    function aditionalValidation() {
        if (errorFabrics || errorGroupFabric || selectedArticle===null)
            return true;
        return false;
    }

    if (loading) return <LoadingComponent content="loading articles"></LoadingComponent>
    return (
        <>
            <Formik
                validateOnBlur={true}
                validateOnChange={true}
                validationSchema={validationSchema}
                enableReinitialize
                initialValues={initialValues}
                onSubmit={values => handleFormSubmit(values)}>
                {({ handleSubmit, isValid, dirty }) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        <div>
                            <label className="boldFont">Select article</label>
                            <Select
                                options={articlesRS}
                                value={selectedArticle!==null ? articlesRS.filter(option =>
                                    option.value === selectedArticle?.value) : undefined}
                                onChange={(d, e) => {
                                    setSelectedArticle(d);
                                    handleSelectArticle(d as ReactSelectInt);
                                }}
                                placeholder={"Choose fabric"}
                            />
                            {selectedArticle === null && <MyErrorMessage errorMessage="Article is required"></MyErrorMessage>}
                        </div>
                        <FormGroup>
                            <MyTextInput name="setId" label="Set" placeholder="Type other than 0 if want to create set" />
                            <MyTextInput name="lp" label="LP" placeholder="Place in set"></MyTextInput>
                            <MyTextInput name="quanity" label="Quanity" placeholder="Quanity"></MyTextInput>
                        </FormGroup>
                        <FormGroup>
                            {fabricVariants
                                && fabricVariants.map((fv, i) => (
                                    <div key={fv.id} className="ui form paddingLeft10">
                                        <label className="boldFont">{fv.shortName}</label>
                                        <input name={fv.shortName} placeholder="0"
                                            onBlur={(e) => setFabricVariant(e.target.value, fv.id)}
                                            defaultValue={fv.group}
                                        ></input>
                                    </div>
                                ))}
                        </FormGroup>
                        {errorFabrics && <MyErrorMessage errorMessage="Use numeric to group variants by fabrics"></MyErrorMessage>}
                        {groupedVariants.length > 0 && groupedVariants[0].name.length > 0 && groupedVariants.map((group, i) => (
                            <div key={group.groupId}>
                                <label className="boldFont">{group.name}</label>
                                <Select
                                    options={fabrics}
                                    onChange={(d, e) => {
                                        assignFabrics({ value: d!.value, label: d!.label }, i);
                                    }}
                                    placeholder={"Choose fabric"}
                                />
                            </div>
                        ))}
                        {errorGroupFabric && articleTypeId === 1 && <MyErrorMessage errorMessage="Choose fabric for every group"></MyErrorMessage>}
                        <MyTextInput name="client" label="Client name" placeholder="Client name"></MyTextInput>
                        <Button
                            disabled={!dirty || !isValid || isBlocked || aditionalValidation()}
                            floated='right'
                            positive type='submit' content='Submit' />
                    </Form>
                )}
            </Formik>
        </>
        )})
