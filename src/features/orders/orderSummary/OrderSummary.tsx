import { format } from "date-fns";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Grid, Header, Table } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import NotFound from "../../errors/NotFound";
import OrderSummaryClientRow from "./OrderSummaryClientRow";

export default observer(function OrderSummary() {

    const { orderStore } = useStore();
    const { getOrderSummary, orderSummary, loading } = orderStore;

    const { predicate } = useParams<{ predicate: string }>();
    const navigate = useNavigate();
    useEffect(() => {
        if (predicate) {
            getOrderSummary(predicate).then(() => console.log(orderSummary));
        }
    }, [getOrderSummary, predicate]);

    if (loading) return <LoadingComponent content="loading"></LoadingComponent>
    if (orderSummary === null) return <NotFound></NotFound>
    return (
        <>
            <Header as="h1">{orderSummary!.name}</Header>
            <Header as="h1">{orderSummary!.deliveryPlaceName}</Header>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={8}>
                        <Table celled>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Edit</Table.HeaderCell>
                                    <Table.HeaderCell>Shipment</Table.HeaderCell>
                                    <Table.HeaderCell>Production</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell>{format(orderSummary!.editDate, 'dd MMM yyyy')}</Table.Cell>
                                    <Table.Cell>{format(orderSummary!.shipmentDate, 'dd MMM yyyy')}</Table.Cell>
                                    <Table.Cell>{format(orderSummary!.productionDate, 'dd MMM yyyy')}</Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row><Button positive onClick={() => navigate(`/orders/form/${orderSummary.id}`)}>Edit</Button></Grid.Row>
                <Grid.Row>
                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>PosId</Table.HeaderCell>
                                <Table.HeaderCell>Lp</Table.HeaderCell>
                                <Table.HeaderCell>Article Name</Table.HeaderCell>
                                <Table.HeaderCell>Quanity</Table.HeaderCell>
                                <Table.HeaderCell>Realization</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {orderSummary.positions.map((client) => (
                                <OrderSummaryClientRow key={client.client} client={client}></OrderSummaryClientRow>
                            ))}
                                    
                        </Table.Body>
                    </Table>
                </Grid.Row>
            </Grid>
        </>
    )
})