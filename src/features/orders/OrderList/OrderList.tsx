import { format } from "date-fns";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Header, Icon, Table } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";

export default observer(function OrderList() {

    const { orderStore } = useStore()
    const { getOrderList, orderList, loading, clear } = orderStore;
    let navigate = useNavigate();

    useEffect(() => {
        getOrderList().then(()=>console.log(orderList));
        return(()=>{
            clear()
        })
    }, [getOrderList]);
    if (loading) return <LoadingComponent content="loading"></LoadingComponent>;
    return (
        <>
            <Header as="h1" >Order list</Header>
            <Button positive onClick={()=>navigate('/orders/form')}>Create new order</Button>
            <Table striped>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Id</Table.HeaderCell>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Shipment Date</Table.HeaderCell>
                        <Table.HeaderCell>Production Date</Table.HeaderCell>
                        <Table.HeaderCell>Delivery Place Name</Table.HeaderCell>
                        <Table.HeaderCell>Done</Table.HeaderCell>
                        <Table.HeaderCell>FabrCalc</Table.HeaderCell>
                        <Table.HeaderCell>Details</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {orderList && orderList?.map((order) => (
                        <Table.Row key={order.id}>
                            <Table.Cell>{order.id}</Table.Cell>
                            <Table.Cell>{order.name}</Table.Cell>
                            <Table.Cell>{format(order.productionDate, 'dd MMM yyyy') }</Table.Cell>
                            <Table.Cell>{format(order.shipmentDate, 'dd MMM yyyy') }</Table.Cell>
                            <Table.Cell>{order.deliveryPlaceName}</Table.Cell>
                            <Table.Cell>{order.done ? <Icon name="circle"/> : <Icon name="circle outline"/>}</Table.Cell>
                            <Table.Cell>{order.fabricsCalculated ? <Icon name="circle outline"/> : <Icon name="circle outline"/>}</Table.Cell>
                            <Table.Cell><Button content="Details" onClick={()=>navigate(`/orders/${order.id}`)} /></Table.Cell>
                        </Table.Row>
                    ))}

                </Table.Body>
            </Table>
        </>
    )
})