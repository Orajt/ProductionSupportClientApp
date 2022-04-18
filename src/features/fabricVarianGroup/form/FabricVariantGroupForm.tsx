import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useStore } from "../../../app/stores/store";
import { FabricVariantCreateDto, FabricVariantGroupDetailsMember} from "../../../models/fabricVariant";
import { useNavigate, useParams } from "react-router-dom";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Button, Grid, Header, Icon, Segment, Table } from "semantic-ui-react";
import Select from "react-select"
import { ReactSelectInt } from "../../../models/reactSelect";
import NotFound from "../../errors/NotFound";
import axios from "axios";

export default observer(function FabricVariantGroupForm() {

    ///////////////////////STORES//////////////////////////////////
    const { fabricVariantStore } = useStore();
    const { getFabricVariantGroupDetails, getListReactSelect, fabricVariantListRS } = fabricVariantStore;

    ////////////////LOCAL STATE//////////////////////////////////////
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState("");
    const [title, setTitle] = useState("Create fabric variant group")
    const [editMode, setEditMode] = useState(false);
    const [variantList, setVariantList] = useState<FabricVariantGroupDetailsMember[]>([]);
    const [variantId, setVariantId] = useState(0);

    ////////////////ROUTE PARAMS//////////////////////////////////////
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        if (id && !isNaN(parseInt(id))) {
            setLoading(true);
            getFabricVariantGroupDetails(id).then((value) => {
                if (value) {
                    setName(value.name);
                    setVariantList(value.fabricVariants);
                }
            })
                .finally(() => {
                    setTitle("Edit fabric variant group");
                    setEditMode(true);
                    setLoading(false);
                });
        }
        setLoading(true);
        getListReactSelect().then(() => setLoading(false));
    }, [getFabricVariantGroupDetails, id]);

    /////////////////////FUNCTIONS//////////////////////////////////////////
    function sendToserver() {
        let listOfFabricVariants = [] as FabricVariantCreateDto[];
        variantList.forEach(element => {
            listOfFabricVariants.push({fabricVariantId: element.id, placeInGroup: element.placeInGroup});
        });
        let result = {listOfFabricVariants: listOfFabricVariants};
        axios.post<void>(`/fabricVariantGroup`, result).then((response) => {
            if (response.status === 200) {
                navigate(`/fabricVariants`);
                return;
            }
        })
    }
    function deleteMember(pos: number) {
        let newList = variantList.filter(p => p.placeInGroup !== pos);

        for (let i = pos - 1; i < newList.length; i++) {
            newList[i].placeInGroup--;
        }
        setNameBasedOnVariantList(newList);
        setVariantList(newList);
    }

    function moveMember(pos: number, up: boolean) {
        if (pos === 1 && up === true)
            return;
        if (pos === variantList.length && up === false)
            return;

        let newList = [...variantList];

        if (up) {
            newList[pos - 1].placeInGroup--;
            newList[pos - 2].placeInGroup++;
        }
        if (!up) {
            newList[pos - 1].placeInGroup++;
            newList[pos].placeInGroup--;
        }
        newList = newList.sort((a, b) => a.placeInGroup - b.placeInGroup);
        setVariantList(newList);
        setNameBasedOnVariantList(newList);

    }
    function setNameBasedOnVariantList(arr: FabricVariantGroupDetailsMember[]) {
        let newName = "";
        arr.forEach(element => {
            newName += element.shortName + "+";
        });
        if (newName.length !== 0)
            newName = newName.slice(0, -1);
        setName(newName);
    }


    function handleFormSubmit(fv: ReactSelectInt) {
        if (!variantList.some(p => p.id == fv.value)) {
            let member = {} as FabricVariantGroupDetailsMember;
            let splitedLabel = fv.label.split(/[()]/);
            console.log(splitedLabel);
            member.id = fv.value;
            member.fullName = splitedLabel[0];
            member.shortName = splitedLabel[1];
            member.placeInGroup = variantList.length + 1;
            var newList = [...variantList, member];
            setVariantList(newList);
            let newName = name.length == 0 ? `${member.shortName}` : name + `+${member.shortName}`
            setName(newName);
        }
    }
    if (loading) return <LoadingComponent></LoadingComponent>
    if (fabricVariantListRS == null) return <NotFound></NotFound>
    return (
        <>
            <Segment>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <Grid.Row>
                                <Header as="h2" color="teal">{title}</Header>
                            </Grid.Row>
                            <Grid.Row>
                                <Header as="h3">Fabric group name: {name}</Header>
                            </Grid.Row>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width="8">
                            <Grid.Row className='ui form'>
                                <label className="boldFont">Add fabric variant</label>
                                <Select
                                    options={fabricVariantListRS}
                                    value={fabricVariantListRS.filter(option =>
                                        option.value === variantId)}
                                    onChange={(d) => {
                                        if (d) {
                                            setVariantId(d.value);
                                            handleFormSubmit(d);
                                        }
                                    }}
                                    placeholder={"Choose variant to add"}
                                />
                            </Grid.Row>
                        </Grid.Column>
                        <Grid.Column width="8">
                            <Grid.Row>
                                <Header as="h2">Variant list: </Header>
                                {variantList.length>0 && <Button positive onClick={()=>sendToserver()}>Save</Button>}
                            </Grid.Row>
                            <Grid.Row>
                                <Table striped structured>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>Id</Table.HeaderCell>
                                            <Table.HeaderCell>Name</Table.HeaderCell>
                                            <Table.HeaderCell>Short name</Table.HeaderCell>
                                            <Table.HeaderCell>Pos</Table.HeaderCell>
                                            <Table.HeaderCell></Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {variantList.map((variant) => (
                                            <Table.Row key={variant.id}>
                                                <Table.Cell>{variant.id}</Table.Cell>
                                                <Table.Cell>{variant.fullName}</Table.Cell>
                                                <Table.Cell>{variant.shortName}</Table.Cell>
                                                <Table.Cell>{variant.placeInGroup}</Table.Cell>
                                                <Table.Cell>
                                                    <Icon size="big" name="arrow up" onClick={() => moveMember(variant.placeInGroup, true)}></Icon>
                                                    <Icon size="big" name="arrow down" onClick={() => moveMember(variant.placeInGroup, false)}></Icon>
                                                    <Icon size="big" name="delete" onClick={() => deleteMember(variant.placeInGroup)}></Icon>
                                                </Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table>
                            </Grid.Row>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        </>
    )
})

