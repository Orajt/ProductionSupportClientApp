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

export default observer(function OrderPositionList() {

    const { orderPositionStore } = useStore()
    const { getOrderPositionList, orderPositionList, clear, pagingParams, setPagingParams, pagination} = orderPositionStore;
    let navigate = useNavigate();
    const [filters, setFilters]=useState<FilterResult[]>([]);
    const [loading, setLoading]=useState(true);
    useEffect(() => {
        setLoading(true);
        getOrderPositionList(filters).then(()=>setLoading(false));
        return(()=>{
            clear()
        })
    }, [getOrderPositionList, setPagingParams, clear]);

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
        getOrderPositionList([]);
    }
    function pageChaanged(e: PaginationProps ){
        let newPagingParams={...pagingParams};
        newPagingParams.pageNumber=parseInt(e.activePage!.toString());
        setPagingParams(newPagingParams);
        getOrderPositionList(filters);
    }

    if (loading) return <LoadingComponent content="loading"></LoadingComponent>;
    return (
        <>
            <Header as="h1" >Order list</Header>
            <Button onClick={()=>{
                setLoading(true);
                getOrderPositionList(filters).then(()=>setLoading(false));
                }} content="Enable filters"/>
            <Button onClick={()=>clearAllFilters()} content="Clear filters"/>
            <div className="fontSizeMedium boldFont">Actual filters: {filters.map((filter)=>(
                `${Utilities.getFilterDescription(filter)}`
            ))}</div>
            <Table striped>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell style={{"width": "5%"}}>Id</Table.HeaderCell>
                        <Table.HeaderCell style={{"width": "5%"}}>OrderId</Table.HeaderCell>
                        <Table.HeaderCell style={{"width": "5%"}}>SetId</Table.HeaderCell>
                        <Table.HeaderCell style={{"width": "10%"}}>Article Name</Table.HeaderCell>
                        <Table.HeaderCell style={{"width": "10%"}}>Realization</Table.HeaderCell>
                        <Table.HeaderCell style={{"width": "5%"}}>Quanity</Table.HeaderCell>
                        <Table.HeaderCell style={{"width": "10%"}}>Client</Table.HeaderCell>
                        <Table.HeaderCell style={{"width": "10%"}}>Shipment Date</Table.HeaderCell>
                        <Table.HeaderCell style={{"width": "10%"}}>Production Date</Table.HeaderCell>
                        <Table.HeaderCell style={{"width": "10%"}}>Art Type</Table.HeaderCell>
                        <Table.HeaderCell style={{"width": "5%"}}>Familly</Table.HeaderCell>
                        <Table.HeaderCell style={{"width": "5%"}}>Stuff</Table.HeaderCell>
                        <Table.HeaderCell style={{"width": "10%"}}>Details</Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.HeaderCell><NumberFilter propertyName="Id" setFilter={handleSetFilters} clearAll={clearAllFilters} key="Id"></NumberFilter></Table.HeaderCell>
                        <Table.HeaderCell><NumberFilter propertyName="OrderId" setFilter={handleSetFilters} clearAll={clearAllFilters} key="OrderId"></NumberFilter></Table.HeaderCell>
                        <Table.HeaderCell><NumberFilter propertyName="SetId" setFilter={handleSetFilters} clearAll={clearAllFilters} key="SetId"></NumberFilter></Table.HeaderCell>
                        <Table.HeaderCell><StringFilter propertyName="ArticleFullName" setFilter={handleSetFilters} clearAll={clearAllFilters} key="ArticleFullName"></StringFilter></Table.HeaderCell>
                        <Table.HeaderCell><StringFilter propertyName="Realization" setFilter={handleSetFilters} clearAll={clearAllFilters} key="Realization"></StringFilter></Table.HeaderCell>
                        <Table.HeaderCell><NumberFilter propertyName="Quanity" setFilter={handleSetFilters} clearAll={clearAllFilters} key="Quanity"></NumberFilter></Table.HeaderCell>
                        <Table.HeaderCell><StringFilter propertyName="Client" setFilter={handleSetFilters} clearAll={clearAllFilters} key="Client"></StringFilter></Table.HeaderCell>
                        <Table.HeaderCell><DateFilter propertyName="ShipmentDate" setFilter={handleSetFilters} clearAll={clearAllFilters} key="ShipmentDate"></DateFilter></Table.HeaderCell>
                        <Table.HeaderCell><DateFilter propertyName="ProductionDate" setFilter={handleSetFilters} clearAll={clearAllFilters} key="ProductionDate"></DateFilter></Table.HeaderCell>
                        <Table.HeaderCell><StringFilter propertyName="ArticleTypeName" setFilter={handleSetFilters} clearAll={clearAllFilters} key="ArticleTypeName"></StringFilter></Table.HeaderCell>
                        <Table.HeaderCell><StringFilter propertyName="FamillyName" setFilter={handleSetFilters} clearAll={clearAllFilters} key="FamillyName"></StringFilter></Table.HeaderCell>
                        <Table.HeaderCell><StringFilter propertyName="StuffName" setFilter={handleSetFilters} clearAll={clearAllFilters} key="StuffName"></StringFilter></Table.HeaderCell>
                        <Table.HeaderCell></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {orderPositionList && orderPositionList?.map((orderPosition) => (
                        <Table.Row key={orderPosition.id}>
                            <Table.Cell>{orderPosition.id}</Table.Cell>
                            <Table.Cell>{orderPosition.orderId}</Table.Cell>
                            <Table.Cell>{orderPosition.setId}</Table.Cell>
                            <Table.Cell>{orderPosition.articleFullName}</Table.Cell>
                            <Table.Cell>{orderPosition.realization}</Table.Cell>
                            <Table.Cell>{orderPosition.quanity}</Table.Cell>
                            <Table.Cell>{orderPosition.client}</Table.Cell>
                            <Table.Cell>{format(orderPosition.shipmentDate, 'dd MMM yyyy') }</Table.Cell>
                            <Table.Cell>{format(orderPosition.productionDate, 'dd MMM yyyy') }</Table.Cell>
                            <Table.Cell>{orderPosition.articleTypeName}</Table.Cell>
                            <Table.Cell>{orderPosition.famillyName}</Table.Cell>
                            <Table.Cell>{orderPosition.stuffName}</Table.Cell>
                            <Table.Cell><Button content="ODet" onClick={()=>navigate(`/orders/${orderPosition.orderId}`)} /></Table.Cell>
                            <Table.Cell><Button content="Adet" onClick={()=>navigate(`/articles/${orderPosition.articleId}`)} /></Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
            <Pagination defaultActivePage={pagination!.currentPage} totalPages={pagination!.totalPages} onPageChange={(e,d)=>pageChaanged(d)}/>
        </>
    )
})