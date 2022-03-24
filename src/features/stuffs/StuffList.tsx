import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Header,Table } from "semantic-ui-react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useStore } from "../../app/stores/store";
import NotFound from "../errors/NotFound";

export default observer(function StuffList() {

    const { stuffStore } = useStore();
    const { stuffList, getStuffList} = stuffStore;

    let navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        getStuffList().then(() => setLoading(false));
    }, [getStuffList]);

    if (loading) return <LoadingComponent content="loading"></LoadingComponent>;
    if (stuffList == null) return <NotFound></NotFound>

    return (
        <>
            <Header as="h1" >Stuffs list</Header>
            <Button positive onClick={() => navigate('/stuffs/form')}>Create new stuff</Button>
            <Table striped>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Id</Table.HeaderCell>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Article Type Name</Table.HeaderCell>
                        <Table.HeaderCell></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {stuffList.map((stuff) => (
                        <Table.Row key={stuff.id}>
                            <Table.Cell>{stuff.id}</Table.Cell>
                            <Table.Cell>{stuff.name}</Table.Cell>
                            <Table.Cell><Button onClick={()=>navigate(`/stuffs/form/${stuff.id}`)}>Edit</Button></Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </>
    )
})