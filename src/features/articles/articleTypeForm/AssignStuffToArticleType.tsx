import { useEffect, useState } from "react";
import { Button, Checkbox, CheckboxProps, Grid, Header, Table } from "semantic-ui-react";
import * as Yup from 'yup';
import { observer } from "mobx-react-lite";
import Select from "react-select"
import { useStore } from "../../../app/stores/store";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useNavigate, useParams } from "react-router-dom";
import { AssignArticleFormValues } from "../../../models/article";
import { ReactSelectInt } from "../../../models/reactSelect";
import { Utilities } from "../../../app/common/utilities/Utilities";
import axios from "axios";


export default observer(function AssignStuffToArticleType() {

    ////////////////////Validation////////////////////////////////////
    const validationSchema = Yup.object({
        name: Yup.string().min(3).required(),
        country: Yup.string().min(3).required(),
        city: Yup.string().min(3).required(),
        street: Yup.string().min(2).required(),
        postalCode: Yup.string().min(5).required(),
        numberOfBuilding: Yup.number().min(1).required(),
        apartment: Yup.number()
    })
    ///////////////////////STORES//////////////////////////////////
    const { stuffStore, articleStore } = useStore();
    const { getStuffsListToSelect } = stuffStore;
    const { getArticleTypeDetails } = articleStore;

    ////////////////LOCAL STATE//////////////////////////////////////
    const [loading, setLoading] = useState(true);
    const [articleType, setArticleType] = useState(new AssignArticleFormValues());
    const [stuffRS, setStuffRS] = useState<ReactSelectInt[]>([]);
    const [stuffId, setStuffId] = useState(0);
    const [ableToAddStuff, setAbleToAddStuff] = useState(true);
    const [indexesToDelete, setIndexesToDelete] = useState<number[]>([]);

    ////////////////ROUTE PARAMS//////////////////////////////////////
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        if (id && !isNaN(parseInt(id))) {
            setLoading(true);
            getArticleTypeDetails(parseInt(id)).then((value) => {
                setArticleType(value as AssignArticleFormValues)
            })
                .then(() => getStuffsListToSelect().then((value) => {
                    let newValues = value as ReactSelectInt[];
                    let listToSelect = newValues.filter(i => !articleType.stuffs.includes(i))
                    setStuffRS(listToSelect);
                }))
                .then(() => setLoading(false))
        }
    }, [getArticleTypeDetails, getStuffsListToSelect, id]);

    ///////////////////////FUNCTIONS//////////////////////////////////////////
    function handleFormSubmit() {

        let objectToSend = {
            id: articleType.id,
            stuffs: articleType.stuffs.map(function (value) {
                return value.value
            })
        };
        console.log(objectToSend);
        axios.post<void>(`/articleType/${id}`, objectToSend).then((response) => {
            if (response.status === 200) {
                navigate(`/articleTypes`);
                return;
            }
        })
    }
    function handleAdd(value: ReactSelectInt) {
        setAbleToAddStuff(false);
        setStuffId(0);
        let newArticleType = { ...articleType }
        newArticleType.stuffs.push(value);
        setArticleType(newArticleType);

        let stuffsToSelect = [...stuffRS];
        let newStuffs = stuffsToSelect.filter(p => p.value != value.value);
        setStuffRS(newStuffs);
        setAbleToAddStuff(true);
    }
    function deleteChecked() {
        let stuffsInArticleType = [...articleType.stuffs]
        let newPossibleStuffs = stuffsInArticleType.map(function (stuff, i) {
            if (indexesToDelete.some(p => p == i))
                return stuff;
        })
        let newStuffRS = [...stuffRS]
        newPossibleStuffs.forEach((stuff) => {
            if (stuff)
                newStuffRS.push(stuff);
        })
        setStuffRS(newStuffRS.sort(function (a, b) {
            return a.label.localeCompare(b.label)
        }))
        let newArticleType = { ...articleType }
        console.log(newArticleType.stuffs);
        newArticleType.stuffs = Utilities.removeItemFromCollectionBasedOnIndex(articleType.stuffs, indexesToDelete);
        setIndexesToDelete([]);
        setAbleToAddStuff(true);
        console.log(newArticleType);
        setArticleType(newArticleType);

    }
    function handleCheckStuffChaange(data: CheckboxProps, index: number) {
        let numberTable = [] as number[];
        if (data.checked === false) {
            numberTable = indexesToDelete.filter(x => x !== index);
            if (numberTable.length === 0) {
                setAbleToAddStuff(true);
            }
        }
        if (data.checked === true) {
            numberTable = [...indexesToDelete, index]
            setAbleToAddStuff(false);
        }
        setIndexesToDelete(numberTable);
    }

    if (loading) return <LoadingComponent></LoadingComponent>
    return (
        <>
            <Grid>
                <Grid.Row>
                    <Header color="green" as="h1">Manage stuffs in article type</Header>
                </Grid.Row>
                <Grid.Row>
                <Grid.Column width={8}>
                    <Grid.Row>
                        <Header as="h2">Article type: {articleType.name}</Header>
                    </Grid.Row>
                    <Grid.Row>
                        <Header as="h2">Id: {articleType.id}</Header>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width="8">
                            <div>
                                <label className="boldFont">Choose stuff to add</label>
                                <Select
                                    options={stuffRS}
                                    value={stuffRS.filter(option =>
                                        option.value === stuffId)}
                                    onChange={(d) => {
                                        setStuffId(d!.value);
                                        handleAdd(d!);
                                    }}
                                    placeholder={"Choose stuff"}
                                    isDisabled={!ableToAddStuff}
                                />
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid.Column>

                <Grid.Column width="8">
                    <Grid.Row>
                        <Grid.Row>
                            <Header as="h2">Selected stuffs</Header>
                        </Grid.Row>
                        <Grid.Row>
                            <Button positive onClick={() => handleFormSubmit()}>Save chaanges</Button>
                            {!ableToAddStuff && <Button color="red" onClick={() => deleteChecked()}>Delete checked</Button>}
                        </Grid.Row>
                        <Table celled>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell></Table.HeaderCell>
                                    <Table.HeaderCell>Id</Table.HeaderCell>
                                    <Table.HeaderCell>Name</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {articleType.stuffs.map((stuff, i) => (
                                    <Table.Row key={i}>
                                        <Table.Cell><Checkbox className="width100p" onChange={(e, data) => { handleCheckStuffChaange(data, i) }} /></Table.Cell>
                                        <Table.Cell>{stuff.value}</Table.Cell>
                                        <Table.Cell>{stuff.label}</Table.Cell>
                                    </Table.Row>
                                ))}

                            </Table.Body>
                        </Table>
                    </Grid.Row>
                </Grid.Column>
                </Grid.Row>
            </Grid>

        </>
    )
})