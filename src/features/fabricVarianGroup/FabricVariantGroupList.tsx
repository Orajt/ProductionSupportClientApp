import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header, Button, Table } from "semantic-ui-react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useStore } from "../../app/stores/store";
import NotFound from "../errors/NotFound";

export default observer(function FabricVariantGroupList() {

    const { fabricVariantStore } = useStore();
    const { getListReactSelectFVG, fabricVariantGroupListRS} = fabricVariantStore;

    let navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        getListReactSelectFVG(0).then(() => setLoading(false));
    }, [getListReactSelectFVG]);

    if (loading) return <LoadingComponent content="loading"></LoadingComponent>;
    if (fabricVariantGroupListRS == null) return <NotFound></NotFound>

    return (
        <>
            <Header as="h1" >Fabric variant group list</Header>
            <Button positive onClick={() => navigate('/fabricVariants/form')}>Create new fabric variant</Button>
            <Table striped>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Id</Table.HeaderCell>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {fabricVariantGroupListRS.map((fvg) => (
                        <Table.Row key={fvg.value}>
                            <Table.Cell>{fvg.value}</Table.Cell>
                            <Table.Cell>{fvg.label}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </>
    )
})
