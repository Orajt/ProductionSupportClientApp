import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Header,Table } from "semantic-ui-react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useStore } from "../../app/stores/store";
import NotFound from "../errors/NotFound";

export default observer(function FamiliesList() {

    const { famillyStore } = useStore();
    const { getFamiliesRS, familiesRS} = famillyStore;

    let navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        getFamiliesRS().then(() => setLoading(false));
    }, [getFamiliesRS]);

    if (loading) return <LoadingComponent content="loading"></LoadingComponent>;
    if (familiesRS == null) return <NotFound></NotFound>

    return (
        <>
            <Header as="h1" >Families list</Header>
            <Button positive onClick={() => navigate('/famillies/form')}>Create new familly</Button>
            <Table striped>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Id</Table.HeaderCell>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {familiesRS.map((familly) => (
                        <Table.Row key={familly.value}>
                            <Table.Cell>{familly.value}</Table.Cell>
                            <Table.Cell>{familly.label}</Table.Cell>
                            <Table.Cell><Button onClick={()=>navigate(`/famillies/form/${familly.value}`)}>Edit</Button></Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </>
    )
})