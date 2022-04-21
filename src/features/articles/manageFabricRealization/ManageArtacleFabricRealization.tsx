import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Form, Grid, Header, Segment, Table, TableBody } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import { ArticleFabricRealizationDetails, FabricVariantInGroup, QuanityPerGroup, StuffGroup } from "../../../models/articleFabricRealization";
import { ReactSelectInt } from "../../../models/reactSelect";
import NotFound from "../../errors/NotFound";
import Select from "react-select"
import MyErrorMessage from "../../../app/common/form/MyErrorMessage";
import { parse } from "path/posix";
import axios from "axios";
import { toast } from "react-toastify";

export default observer(function ManageArtacleFabricRealization() {

    const { stuffStore, articleStore } = useStore();
    const { getStuffListByArticleTypeId } = stuffStore;
    const { getArticleFabricRealizationsDetails } = articleStore;

    const { id } = useParams<{ id: string }>();

    const [loading, setLoading] = useState(true);
    const [articleFRDetails, setArticleFRDetails] = useState<ArticleFabricRealizationDetails | null>(null);
    const [stuffList, setStuffList] = useState<ReactSelectInt[]>([]);
    const [selectedStuff, setSelectedStuff] = useState<ReactSelectInt>({ label: "", value: 0 });
    const [articleId, setArticleId] = useState(0);
    const [variantList, setVariantList] = useState<FabricVariantInGroup[]>([])
    const [valueError, setValueError] = useState(true);
    const [fabricLength, setFabricLength] = useState(0);
    const [fabricLengthError, setFabicLengthError] = useState(true);
    const [isValid, setValid] = useState(false);

    function validation(fve: boolean | undefined) {
        let check = fabricLengthError;
        if (fve !== undefined)
            check = fve;
        if (selectedStuff.value === 0 || valueError || check) {
            setValid(false);
            return false;
        }
        console.log("Validation true")
        setValid(true);
        return true;
    }
    function setFabricVariant(value: string, variantIndex: number) {
        let newVariantList = [...variantList];
        let parsedValue = parseInt(value);
        if (isNaN(parsedValue)) {
            setValueError(true);
            return;
        }
        if (parsedValue !== 1 && parsedValue !== 0) {
            setValueError(true);
            return;
        }
        newVariantList[variantIndex - 1].value = parsedValue;
        if (newVariantList.some(p => p.value == 1))
            setValueError(false);
        validation(undefined);
    }
    function saveChaanges(){
        let quanityGroups=[] as QuanityPerGroup[];
        articleFRDetails!.groupByStuffList.forEach((gbs)=>{
            gbs.groupsQuanities.forEach((gq)=>{
                quanityGroups.push(gq);
            })
        })
        let result ={quanityGroups: quanityGroups};
        console.log(result);
        axios.post<void>(`/articleFabricRealization/${id}`, result).then((response) => {
            if (response.status === 200) {
                console.log(response);
                toast.success("Article fabric realizations managed successfully");
                return;
            }
        })
        

    }
    function clearForm() {
        setValueError(true);
        setFabicLengthError(true);
        setValid(false);
        setSelectedStuff({ label: "", value: 0 });
        setFabricLength(0);
        let form = document.getElementById("form-xdd") as HTMLFormElement;
        form.reset();
    }

    function handleFabricLengthInput(value: string) {
        if (value.indexOf(',') > -1)
            value = value.replace(',', '.');
        let parsedValue = parseFloat(value);
        console.log(parsedValue);
        if (isNaN(parsedValue)) {
            setFabicLengthError(true);
            validation(true);
            return;
        }
        if (parsedValue <= 0) {
            validation(true);
            setFabicLengthError(true);
            return;
        }
        setFabicLengthError(false);
        setFabricLength(parsedValue);
        validation(false);
    }
    function handleFormSubmit() {
        let check = validation(undefined);
        if (!check)
            return;
        let calcCode = "";
        let newVariantList = [...variantList];
        newVariantList.forEach(variant => {
            if (variant.value === 0)
                calcCode += 0;
            if (variant.value === 1) {
                let d = document.getElementById(variant.name);
                console.log(d);
                if (d)
                    d?.setAttribute("value", "0")
                calcCode += 1;
                variant.value = 0;
            }
        });
        setVariantList(newVariantList);
        let newStuffList = [...articleFRDetails!.groupByStuffList];
        let newPosition = { groupId: 0, stuffId: selectedStuff.value, calculatedCode: calcCode, quanityChaanged: false, quanity: fabricLength } as QuanityPerGroup;
        let stuffToEdit = newStuffList.find(p => p.stuffId === selectedStuff.value);
        if (stuffToEdit) {
            let isManaged = false;
            if (stuffToEdit.groupsQuanities && stuffToEdit.groupsQuanities.length > 0) {
                let positionToEdit = stuffToEdit.groupsQuanities.find(p => p.calculatedCode === calcCode);
                if (positionToEdit) {
                    positionToEdit.quanity = fabricLength;
                    positionToEdit.quanityChaanged = true;
                    isManaged = true;
                }
                if (positionToEdit === undefined) {
                    stuffToEdit.groupsQuanities.push(newPosition);
                    stuffToEdit.groupsQuanities =
                        stuffToEdit.groupsQuanities.sort((a, b) => a.calculatedCode.localeCompare(b.calculatedCode));
                    isManaged = true;
                }
            }
            if (!isManaged) {
                stuffToEdit.groupsQuanities = [];
                stuffToEdit.groupsQuanities.push(newPosition);
            }
        }
        if (stuffToEdit === undefined) {
            let newStuff = { stuffName: selectedStuff.label, stuffId: selectedStuff.value, groupsQuanities: [] } as StuffGroup;
            newStuff.groupsQuanities.push(newPosition);
            newStuffList.push(newStuff);
        }
        let newDetails = { ...articleFRDetails! };
        newDetails.groupByStuffList = newStuffList;
        setArticleFRDetails(newDetails);
        clearForm();
    }
    useEffect(() => {
        if (id && !isNaN(parseInt(id))) {
            setArticleId(parseInt(id));
            getArticleFabricRealizationsDetails(parseInt(id)).then((value) => {
                if (value) {
                    setArticleFRDetails(value);
                    let splitedVariants = value.variantGroup.split('+');
                    let newVariantsList = [] as FabricVariantInGroup[];
                    for (let i = 0; i < splitedVariants.length; i++) {
                        newVariantsList.push({ name: splitedVariants[i], placeInGroup: i + 1, value: 0 })
                    }
                    setVariantList(newVariantsList);
                }

            }).then(() => getStuffListByArticleTypeId(6).then((value) => {
                if (value)
                    setStuffList(value)
            })).finally(() => setLoading(false));
        }

    }, [id, getArticleFabricRealizationsDetails, getStuffListByArticleTypeId]);

    if (loading) return <LoadingComponent content="loading"></LoadingComponent>;
    if (articleFRDetails === null) return <NotFound></NotFound>

    return (
        <Segment>
            <Grid>
                <Grid.Row>
                    <Grid.Column>
                        <Grid.Row>
                            <Header color="teal" as="h2">Manage fabric realizations</Header>
                        </Grid.Row>
                        <Grid.Row className="paddingTop10">
                            <Header as="h3">Article: {articleFRDetails.articleName}</Header>
                        </Grid.Row>
                        <Grid.Row className="paddingTop10">
                            <Header as="h3">Fabric Variant Group: {articleFRDetails.variantGroup}</Header>
                        </Grid.Row>
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                    <Grid.Column width={8}>
                        <Grid.Row>
                            <Form id="form-xdd">
                                <div>
                                    <label className="boldFont">Select stuff</label>
                                    <Select
                                        options={stuffList}
                                        value={selectedStuff.value === 0 ? undefined : stuffList.filter(option =>
                                            option.value === selectedStuff.value)}
                                        onChange={(d) => {
                                            if (d) {
                                                setSelectedStuff(d);
                                            }
                                        }}
                                        placeholder={"Choose stuff"}
                                    />
                                    {selectedStuff.value === 0 && <MyErrorMessage errorMessage={"Stuff is required"}></MyErrorMessage>}
                                </div>
                                <Form.Group>
                                    {variantList.length > 0 && variantList.map((variant) => (
                                        <div key={variant.placeInGroup} className="paddingLeft10">
                                            <label className="boldFont">{variant.name}</label>
                                            <input name={variant.name} placeholder="0"
                                                onBlur={(e) => setFabricVariant(e.target.value, variant.placeInGroup)}
                                                defaultValue={variant.value}
                                                id={variant.name}
                                            ></input>
                                        </div>
                                    ))}
                                </Form.Group>

                                {valueError && <MyErrorMessage errorMessage="Use 1 if you want variant to count or 0 if not" />}
                                <div>
                                    <label className="boldFont">Fabric length</label>
                                    <input name="FabricLenth" onChange={(e) => handleFabricLengthInput(e.target.value)}></input>
                                    {fabricLengthError && <MyErrorMessage errorMessage={"Fabric length should be float and higher than 0"}></MyErrorMessage>}
                                </div>
                                <div>
                                    <Button positive disabled={!isValid} onClick={() => handleFormSubmit()}>Submit</Button>
                                </div>
                            </Form>
                        </Grid.Row>
                    </Grid.Column>
                    <Grid.Column width="8">
                        <Header as="h2">Actual fabric realizations:</Header>
                        <Table celled striped>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Group Id</Table.HeaderCell>
                                    <Table.HeaderCell>Code</Table.HeaderCell>
                                    <Table.HeaderCell>Fabric length</Table.HeaderCell>
                                    <Table.HeaderCell></Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <TableBody>
                                <Table.Row>
                                    <Table.Cell colSpan="4" textAlign="center" className="boldFont">Schema: {articleFRDetails.variantGroup}</Table.Cell>
                                </Table.Row>
                                {articleFRDetails && articleFRDetails.groupByStuffList && articleFRDetails.groupByStuffList.map((afr) => (
                                    <React.Fragment key={afr.stuffName}>
                                        <Table.Row key={afr.stuffId}>
                                            <Table.Cell colSpan="4" textAlign="left">{afr.stuffName}</Table.Cell>
                                        </Table.Row>
                                        {afr.groupsQuanities && afr.groupsQuanities.map((gq, i) => (
                                            <Table.Row key={i}>
                                                <Table.Cell>{gq.groupId}</Table.Cell>
                                                <Table.Cell>{gq.calculatedCode}</Table.Cell>
                                                <Table.Cell>{gq.quanity}</Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                        <Button positive onClick={()=>saveChaanges()}>Save Chaanges</Button>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>

    )
})