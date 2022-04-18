import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header, Button, Table } from "semantic-ui-react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useStore } from "../../app/stores/store";
import NotFound from "../errors/NotFound";

export default observer(function FabricVariantList() {

    const { fabricVariantStore } = useStore();
    const { fabricVariantList, getFabricVariantList} = fabricVariantStore;

    let navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        getFabricVariantList().then(() => setLoading(false));
    }, [getFabricVariantList]);

    if (loading) return <LoadingComponent content="loading"></LoadingComponent>;
    if (fabricVariantList == null) return <NotFound></NotFound>

    return (
        <>
            <Header as="h1" >Fabric variant list</Header>
            <Button positive onClick={() => navigate('/fabricVariants/form')}>Create new fabric variant</Button>
            <Table striped>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Id</Table.HeaderCell>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Short Name</Table.HeaderCell>
                        <Table.HeaderCell></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {fabricVariantList.map((fv) => (
                        <Table.Row key={fv.id}>
                            <Table.Cell>{fv.id}</Table.Cell>
                            <Table.Cell>{fv.fullName}</Table.Cell>
                            <Table.Cell>{fv.shortName}</Table.Cell>
                            <Table.Cell><Button onClick={()=>navigate(`/fabricVariants/form/${fv.id}`)}>Edit</Button></Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </>
    )
})
