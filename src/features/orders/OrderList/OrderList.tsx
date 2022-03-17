import { format } from "date-fns";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Header, Icon, Pagination, PaginationProps, Table } from "semantic-ui-react";
import DateFilter from "../../../app/common/filters/DateFilter";
import NumberFilter from "../../../app/common/filters/NumberFilter";
import StringFilter from "../../../app/common/filters/StringFilter";
import { Utilities } from "../../../app/common/utilities/Utilities";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { FilterResult } from "../../../app/models/filter";
import { useStore } from "../../../app/stores/store";

export default observer(function OrderList() {

    const { orderStore } = useStore()
    const { getOrderList, orderList, loading, clear, pagingParams, setPagingParams, pagination} = orderStore;
    let navigate = useNavigate();
    const [filters, setFilters]=useState<FilterResult[]>([]);
    useEffect(() => {
        getOrderList(filters);
        return(()=>{
            clear()
        })
    }, [getOrderList, setPagingParams, clear]);

    function handleSetFilters(filter: FilterResult){
        var newFilters = filters.filter(p=>p.propertyName!==filter.propertyName);
        if(filter.dateValue!==null || filter.intValue!==0 || filter.stringValue){
            newFilters.push(filter);
        }
        setFilters(newFilters);
        console.log(filters);
    }
    function clearAllFilters(){
        setFilters([]);
        getOrderList([]);
    }
    function pageChaanged(e: PaginationProps ){
        let newPagingParams={...pagingParams};
        newPagingParams.pageNumber=parseInt(e.activePage!.toString());
        setPagingParams(newPagingParams);
        getOrderList(filters);
    }

    if (loading) return <LoadingComponent content="loading"></LoadingComponent>;
    return (
        <>
            <Header as="h1" >Order list</Header>
            <Button positive onClick={()=>navigate('/orders/form')}>Create new order</Button>
            <Button onClick={()=>getOrderList(filters)} content="Enable filters"/>
            <Button onClick={()=>clearAllFilters()} content="Clear filters"/>
            <div className="fontSizeMedium boldFont">Actual filters: {filters.map((filter)=>(
                `${Utilities.getFilterDescription(filter)}`
            ))}</div>
            <Table striped>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell style={{"width": "5%"}}>Id</Table.HeaderCell>
                        <Table.HeaderCell style={{"width": "12%"}}>Name</Table.HeaderCell>
                        <Table.HeaderCell style={{"width": "10%"}}>Shipment Date</Table.HeaderCell>
                        <Table.HeaderCell style={{"width": "10%"}}>Production Date</Table.HeaderCell>
                        <Table.HeaderCell style={{"width": "10%"}}>Delivery Place Name</Table.HeaderCell>
                        <Table.HeaderCell style={{"width": "5%"}}>Done</Table.HeaderCell>
                        <Table.HeaderCell style={{"width": "5%"}}>FabrCalc</Table.HeaderCell>
                        <Table.HeaderCell style={{"width": "10%"}}>Details</Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.HeaderCell><NumberFilter propertyName="Id" setFilter={handleSetFilters} clearAll={clearAllFilters} key="Id"></NumberFilter></Table.HeaderCell>
                        <Table.HeaderCell><StringFilter propertyName="Name" setFilter={handleSetFilters} clearAll={clearAllFilters} key="Name"></StringFilter></Table.HeaderCell>
                        <Table.HeaderCell><DateFilter propertyName="ShipmentDate" setFilter={handleSetFilters} clearAll={clearAllFilters} key="ShipmentDate"></DateFilter></Table.HeaderCell>
                        <Table.HeaderCell><DateFilter propertyName="ProductionDate" setFilter={handleSetFilters} clearAll={clearAllFilters} key="ProductionDate"></DateFilter></Table.HeaderCell>
                        <Table.HeaderCell><StringFilter propertyName="DeliveryPlaceName" setFilter={handleSetFilters} clearAll={clearAllFilters} key="DeliveryPlaceName"></StringFilter></Table.HeaderCell>
                        <Table.HeaderCell></Table.HeaderCell>
                        <Table.HeaderCell></Table.HeaderCell>
                        <Table.HeaderCell></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {orderList && orderList?.map((order) => (
                        <Table.Row key={order.id}>
                            <Table.Cell>{order.id}</Table.Cell>
                            <Table.Cell>{order.name}</Table.Cell>
                            <Table.Cell>{format(order.shipmentDate, 'dd MMM yyyy') }</Table.Cell>
                            <Table.Cell>{format(order.productionDate, 'dd MMM yyyy') }</Table.Cell>
                            <Table.Cell>{order.deliveryPlaceName}</Table.Cell>
                            <Table.Cell>{order.done ? <Icon name="circle"/> : <Icon name="circle outline"/>}</Table.Cell>
                            <Table.Cell>{order.fabricsCalculated ? <Icon name="circle outline"/> : <Icon name="circle outline"/>}</Table.Cell>
                            <Table.Cell><Button content="Details" onClick={()=>navigate(`/orders/${order.id}`)} /></Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
            <Pagination defaultActivePage={pagination!.currentPage} totalPages={pagination!.totalPages} onPageChange={(e,d)=>pageChaanged(d)}/>
        </>
    )
})