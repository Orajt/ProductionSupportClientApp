import React from "react";
import { useEffect } from "react";
import { Table} from "semantic-ui-react";
import { OrderSummaryClient } from "../../../models/orders";
import OrderSummarySetRow from "./OrderSummarySetRow";

interface IProps {
    client: OrderSummaryClient;
}

export default function OrderSummaryClientRow({ client }: IProps) {

    useEffect(() => {

    }, []);
    return (
        <>
            <Table.Row>
                <Table.Cell colSpan='5' className="boldFont fontSizeMedium backgroundLightBlue">{client.client}</Table.Cell>
            </Table.Row>
            {client.positions.map((set,i)=>(
                <OrderSummarySetRow key={`set${i}`} set={set}></OrderSummarySetRow>
            ))}
        </>
    )
}