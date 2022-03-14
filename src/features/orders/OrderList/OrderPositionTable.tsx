import { observer } from "mobx-react-lite";
import { useEffect} from "react";
import { Table } from "semantic-ui-react";
import { OrderDetails, OrderPositionFormValues } from "../../../models/orders";
import OrderDetailsRow from "./OrderDetailsRow";

interface IProps{
    orderDetails: OrderDetails;
    handleCheck:(x: number, checked: boolean)=>void;
    form:boolean;
    handleEdit:(pos: OrderPositionFormValues)=>void;
}

export default observer(function OrderPositionTable(props: IProps){
    useEffect(() => {
    }, [props.orderDetails]);

    return(
        <Table celled>
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell></Table.HeaderCell>
                <Table.HeaderCell>id</Table.HeaderCell>
                <Table.HeaderCell>Set id</Table.HeaderCell>
                <Table.HeaderCell>lp</Table.HeaderCell>
                <Table.HeaderCell>Article Name</Table.HeaderCell>
                <Table.HeaderCell>Quanity</Table.HeaderCell>
                <Table.HeaderCell>Realization</Table.HeaderCell>
                <Table.HeaderCell>Client</Table.HeaderCell>
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {props.orderDetails.orderPositions ? props.orderDetails.orderPositions.map((position, i) => (
                <OrderDetailsRow key={i} position={position} index={i} handleCheck={props.handleCheck} form={props.form} handleEdit={props.handleEdit}></OrderDetailsRow> 
            )):<></>}
        </Table.Body>
        </Table>
    )
})


