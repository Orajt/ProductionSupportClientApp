import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Header, Table } from "semantic-ui-react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useStore } from "../../app/stores/store";
import NotFound from "../errors/NotFound";

export default observer(function DeliveryPlacesList() {

    const { deliveryPlaceStore } = useStore();
    const { deliveryPlaceList, getDeliveryPlaceList} = deliveryPlaceStore;

    let navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        getDeliveryPlaceList().then(() => setLoading(false));
    }, [getDeliveryPlaceList]);

    if (loading) return <LoadingComponent content="loading"></LoadingComponent>;
    if (deliveryPlaceList == null) return <NotFound></NotFound>

    return (
        <>
            <Header as="h1" >Delivery places list</Header>
            <Button positive onClick={() => navigate('/deliveryPlaces/form')}>Create new delivery place</Button>
            <Table striped>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Id</Table.HeaderCell>
                        <Table.HeaderCell>Company Name</Table.HeaderCell>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Full Adress</Table.HeaderCell>
                        <Table.HeaderCell></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {deliveryPlaceList.map((deliveryPlace) => (
                        <Table.Row key={deliveryPlace.id}>
                            <Table.Cell>{deliveryPlace.id}</Table.Cell>
                            <Table.Cell>{deliveryPlace.companyName}</Table.Cell>
                            <Table.Cell>{deliveryPlace.name}</Table.Cell>
                            <Table.Cell>{deliveryPlace.fullAdress}</Table.Cell>
                            <Table.Cell><Button onClick={()=>navigate(`/deliveryPlaces/form/${deliveryPlace.id}`)}>Edit</Button></Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </>
    )
})