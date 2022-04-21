import axios from "axios";
import { format } from "date-fns";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button, Grid, GridColumn, Header, Icon, Table } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import { OrderPositionFormValues } from "../../../models/orders";
import NotFound from "../../errors/NotFound";
import OrderPositionTable from "./OrderPositionTable";
import Select from "react-select"
import { toast } from "react-toastify";

export default observer(function OrderDetails() {

    const { orderStore, articleStore } = useStore();
    const { orderDetails, getOrderDetails, ableToDeletePositions, deleteOrderPosition, handlePositionToRemove, toogleOrderDone } = orderStore;
    const { getArticleTypesRS, articleTypesRS } = articleStore;

    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const [deleteReally, setDeleteReally] = useState(false);
    const [wantDeleteOrder, setDeleteOrder] = useState(false);
    const [wantToCalculate, setWantToCalculate] = useState(false);
    const [articleTypeId, setArticleTypeId] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (id !== undefined && !isNaN(parseInt(id))) {
            setLoading(true);
            getOrderDetails(parseInt(id)).then(() => getArticleTypesRS(true)).finally(() => setLoading(false));
        }
    }, [id, getOrderDetails, getArticleTypesRS]);

    function handleEdit(pos: OrderPositionFormValues) { }
    function deleteOrder() {
        axios.delete<void>(`order/${id}`, {}).then((response) => {
            if (response.status === 200) {
                navigate('/orders');
            }
        })
    }
    function orderDone()
    {
        axios.post<void>(`order/${id}`,{}).then((response)=>{
            if (response.status === 200) {
                toast.success("Succesfully change order");
                toogleOrderDone();
            }
        })
    }

    if (loading) return <LoadingComponent content="loading"></LoadingComponent>;
    if (orderDetails === null) return <NotFound></NotFound>
    return (
        <>
            <Header as="h1">{orderDetails!.name}</Header>
            <Header as="h1">{orderDetails!.deliveryPlaceName}</Header>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={8}>
                        <Table celled>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Edit</Table.HeaderCell>
                                    <Table.HeaderCell>Shipment</Table.HeaderCell>
                                    <Table.HeaderCell>Production</Table.HeaderCell>
                                    <Table.HeaderCell>Fabrics Calc</Table.HeaderCell>
                                    <Table.HeaderCell>Done</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell>{format(orderDetails!.editDate, 'dd MMM yyyy')}</Table.Cell>
                                    <Table.Cell>{format(orderDetails!.shipmentDate, 'dd MMM yyyy')}</Table.Cell>
                                    <Table.Cell>{format(orderDetails!.productionDate, 'dd MMM yyyy')}</Table.Cell>
                                    <Table.Cell>{orderDetails!.fabricsCalculated ? <Icon name="circle" /> : <Icon name="circle outline" />}</Table.Cell>
                                    <Table.Cell>{orderDetails!.done ? <Icon name="circle" /> : <Icon name="circle outline" />}</Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Button color="teal" onClick={() => navigate(`/orders/form/${orderDetails.id}`)}>Edit</Button>
                    <Button onClick={() => navigate(`/orders/summary/${orderDetails.id}`)}>OrderSummary</Button>
                    <Button color="olive" onClick={() => setWantToCalculate(!wantToCalculate)}>Calculate</Button>
                </Grid.Row>
                {wantToCalculate &&
                    <React.Fragment>
                        <Grid.Row>
                            <Header as="h4" color="teal">Select article type you want to calculate</Header>
                        </Grid.Row>
                        <Grid.Row className="ui-form">
                            <Select
                                options={articleTypesRS}
                                value={articleTypesRS.filter(option =>
                                    option.value === articleTypeId)}
                                onChange={(d) => {
                                    setArticleTypeId(d!.value);
                                }}
                                placeholder={"Choose Article Type"}
                            />
                            <Link to={`/orders/calculations/${orderDetails.id}/${articleTypeId}`}><Button positive>Apply</Button></Link>
                        </Grid.Row>
                    </React.Fragment>}
                <Grid.Row>
                    <Button onClick={()=>orderDone()}>Mark as {orderDetails.done ? "undone" : "done"}</Button>
                    {!wantDeleteOrder && <Button color="red" onClick={() => setDeleteOrder(true)}>Delete order</Button>}
                    {wantDeleteOrder &&
                        <React.Fragment>
                            <Button color="red" onClick={() => deleteOrder()}>Delete</Button>
                            <Button color="orange" onClick={() => setDeleteOrder(false)}>Cancel</Button>
                        </React.Fragment>}

                </Grid.Row>
                <GridColumn width={3}>
                    <Header as="h1">Order positions:</Header>
                </GridColumn>
                <GridColumn width={1}></GridColumn>

                {ableToDeletePositions && deleteReally === false &&
                    <Button color="red" size="medium" onClick={() => setDeleteReally(true)}>Delete checked</Button>}
                {ableToDeletePositions && deleteReally === true &&
                    <React.Fragment>
                        <Grid.Column width={2}>
                            <p style={{ "fontSize": "30px" }}>Apply deletion:</p>
                        </Grid.Column>
                        <Grid.Column width={2}>
                            <Button style={{ "width": "100%" }} color="red" onClick={() => deleteOrderPosition()}>Delete</Button>
                            <Button style={{ "width": "100%" }} color="orange" onClick={() => setDeleteReally(false)}>Cancel delete</Button>
                        </Grid.Column>
                    </React.Fragment>}
                <OrderPositionTable orderDetails={orderDetails} handleCheck={handlePositionToRemove} form={false} handleEdit={handleEdit}></OrderPositionTable>
                <Grid.Row>

                </Grid.Row>
            </Grid>

        </>
    )
})