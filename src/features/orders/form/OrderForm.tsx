import axios from "axios";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Select from "react-select"
import { Button, Grid, GridColumn, Header, Segment } from "semantic-ui-react";
import { Utilities } from "../../../app/common/utilities/Utilities";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import { OrderDetails, OrderFormValues,OrderPositionFormValues } from "../../../models/orders";
import { ReactSelectInt } from "../../../models/reactSelect";
import NotFound from "../../errors/NotFound";
import OrderPositionTable from "../OrderList/OrderPositionTable";
import OrderFormPrimary from "./OrderFormPrimary";
import OrderFormSecondary from "./OrderFormSecondary";


export default observer(function OrderForm() {

    ///////////////////////STORES//////////////////////////////////
    const { orderStore, deliveryPlaceStore, articleStore, modalStore } = useStore();
    const { orderDetails, getOrderDetails, clear} = orderStore;
    const { deliveryPlacesRS, getDeliveryPlacesRS } = deliveryPlaceStore;
    const { getArticleTypesRS, articleTypesRS, getArticlesRS } = articleStore;
    const{closeModal}=modalStore;

    ////////////////ROUTE PARAMS//////////////////////////////////////
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    ////////////////LOCAL STATE//////////////////////////////////////
    const [order, setOrder] = useState<OrderFormValues>(new OrderFormValues());
    const [editMode, setEditMode] = useState(false);
    const [title, setTitle] = useState("Create new order");
    const [loading, setLoading] = useState(true);
    const [secondStep, setSecondStep] = useState(false);
    const [secondFormBlocked, setsecondFormBlocked] = useState(false);
    const [reallyWantToDelete, setreallyWantToDelete] = useState(false);
    const [articleTypeRSValue, setArticleTypeRSValue] = useState(0);
    const [someChaanges, setSomeChaanges]=useState(false);
    const [articlesToDeleteFromOrder, setarticlesToDeleteFromOrder] = useState<number[]>([]);
    const [fabrics, setFabrics]=useState<ReactSelectInt[]>([]);



    useEffect(() => {
        if (id && !isNaN(parseInt(id))) {
            getOrderDetails(parseInt(id)).then((value) => setOrder(value as OrderFormValues))
                .then(() => getDeliveryPlacesRS("DEALER"))
                .then(() => getArticleTypesRS(false))
                .then(()=>getArticlesRS(6,true))
                .then((val)=>{
                    if(val)
                        setFabrics(val);
                })
                .finally(() => { setTitle(`Edit order ${order.name}`); setEditMode(true); setLoading(false); });

            setSecondStep(true);
        }
        if (!id) {
            getDeliveryPlacesRS("DEALER")
                .then(() => getArticleTypesRS(false))
                .then(()=>getArticlesRS(6,true))
                .then((val)=>{
                    if(val)
                        setFabrics(val);
                })
                .then(() => setLoading(false))
        }
        return clear();

    }, [getOrderDetails, id, getDeliveryPlacesRS, getArticleTypesRS]);

    ///////////////////////FUNCTIONS//////////////////////////////////////////
    function handleFormSubmit(){
        setLoading(true)
        if(editMode){
            axios.put<void>(`/order/${id}`, order).then((response)=>{
                if(response.status===200){
                    navigate(`/orders/summary/${order.id}`);
                    return;
                }
            })
        }
        if(!editMode){ 
            axios.post<void>(`/order/`, order).then((response)=>{
                if(response.status===200){
                    navigate(`/orders/summary/${order.name}`);
                    return;
                }
            })
        }
        setLoading(false);
    }
    function handlePrimaryFormSubmit(values: OrderFormValues) {
        let newOrder = {
            ...values
        }
        newOrder.deliveryPlaceId=values.deliveryPlace!.value;
        setOrder(newOrder);
        setSecondStep(true);
        setSomeChaanges(true);
    }
    function handleSecondaryFormSubmit(values: OrderPositionFormValues) {
        let newOrderPositions = [
            ...order.orderPositions
        ]
        let newOrder = {
            ...order,
            orderPositions: newOrderPositions
        }
        values.articleId = values.articleRS!.value;
        values.articleName = values.articleRS!.label;
        newOrder.orderPositions.push(values);
        newOrder.orderPositions.sort(function (a: OrderPositionFormValues, b: OrderPositionFormValues) {
            return a.client.localeCompare(b.client) || a.setId - b.setId || a.lp - b.lp;
        })
        setOrder(newOrder);
        setSomeChaanges(true);
    }
    function handleCheckChaange(index: number, data: boolean) {
        let numberTable = [] as number[];
        if (data === false) {
            numberTable = articlesToDeleteFromOrder.filter(x => x !== index);
            if (numberTable.length === 0) {
                setsecondFormBlocked(false);
            }
        }
        if (data === true) {
            numberTable=[...articlesToDeleteFromOrder, index]
            setsecondFormBlocked(true);
        }
        setarticlesToDeleteFromOrder(numberTable);
    }
    function deleteReally(){
        let newPositions = Utilities.removeItemFromCollectionBasedOnIndex(order.orderPositions, articlesToDeleteFromOrder);
        const newOrder = {...order}
        newOrder.orderPositions=newPositions;
        setOrder(newOrder);
        setSomeChaanges(true);
        setsecondFormBlocked(false);
    }
    function handleEditPosition(pos: OrderPositionFormValues)
    {
        let newOrder = {
            ...order
        }
        console.log(pos);
        console.log(!isNaN(pos.index!))
        if(!isNaN(pos.index!)){
            newOrder.orderPositions[pos.index!]=pos;
            newOrder.orderPositions.sort(function (a: OrderPositionFormValues, b: OrderPositionFormValues) {
                return a.client.localeCompare(b.client) || a.setId - b.setId || a.lp - b.lp;
            })
        }
        console.log("Order after editing position")
        console.log(newOrder);
        setOrder(newOrder);
        setSomeChaanges(true);
        closeModal();

    }

    if (loading) return <LoadingComponent content="loading"></LoadingComponent>;
    if (id && orderDetails === null) return <NotFound></NotFound>

    return (
        <>
            <Segment clearing>
                <Grid>
                    <Grid.Row textAlign="left">
                        <GridColumn width="7">
                            <OrderFormPrimary title={title} deliveryPlaces={deliveryPlacesRS}
                                initialValues={order} handleFormSubmit={handlePrimaryFormSubmit} editMode={editMode} ></OrderFormPrimary>
                        </GridColumn>
                        <GridColumn width="9">
                            <Grid.Row>
                                {someChaanges && <Button positive onClick={()=>handleFormSubmit()}>Save Chaanges</Button>}
                            </Grid.Row>
                            <Grid.Row>
                            {secondFormBlocked && !reallyWantToDelete && <Button size="medium" color="red" onClick={() => setreallyWantToDelete(true)}>Delete selected</Button>}
                            {secondFormBlocked && reallyWantToDelete &&
                                <React.Fragment>
                                    <Button size="medium" color="red" onClick={()=>deleteReally()}>Delete</Button>
                                    <Button size="medium" color="orange" onClick={() => setreallyWantToDelete(false)}>Cancell</Button>
                                </React.Fragment>}
                            </Grid.Row>
                        </GridColumn>
                    </Grid.Row>
                    {secondStep &&
                        <Grid.Row>
                            <Grid.Column width="7">
                                <Header content="Manage articles on order" as="h4" color='teal' />
                                <label className="boldFont">Choose Article Type</label>
                                <Select
                                    options={articleTypesRS}
                                    value={articleTypesRS.filter(option =>
                                        option.value === articleTypeRSValue)}
                                    onChange={(d) => {
                                        setArticleTypeRSValue(d!.value);
                                    }}
                                    placeholder={"Choose Article Type"}
                                />

                                <OrderFormSecondary articleTypeId={articleTypeRSValue} handleFormSubmitParent={handleSecondaryFormSubmit} isBlocked={secondFormBlocked} fabrics={fabrics}
                                ></OrderFormSecondary>
                            </Grid.Column>
                            <Grid.Column width={9}>
                                <OrderPositionTable orderDetails={order as OrderDetails} handleCheck={handleCheckChaange} form={true} handleEdit={handleEditPosition}></OrderPositionTable>
                            </Grid.Column>
                        </Grid.Row>
                    }
                </Grid>
            </Segment>
        </>
    )
})