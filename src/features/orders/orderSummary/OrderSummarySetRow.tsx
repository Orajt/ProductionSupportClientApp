import React from "react";
import { useEffect, useState } from "react";
import { Grid, Header, Table, TableBody, TableRow } from "semantic-ui-react";
import { OrderSummaryClient, OrderSummaryPosition } from "../../../models/orders";

interface IProps {
    set: OrderSummaryPosition;
}

export default function OrderSummarySetRow({ set }: IProps) {

    useEffect(() => {

    }, []);
    return (
        <>
            <Table.Row>
                <Table.Cell className="boldFont backgroundLightGrey" color="green" colSpan='5'>Set id: {set.setId} Set name: {set.setName}</Table.Cell>
            </Table.Row>
            {set.positions.map((position) => (
                <Table.Row key={position.id}>
                    <Table.Cell>{position.id}</Table.Cell>
                    <Table.Cell>{position.lp}</Table.Cell>
                    <Table.Cell>{position.articleName}</Table.Cell>
                    <Table.Cell>{position.quanity}</Table.Cell>
                    <Table.Cell>{position.realization}</Table.Cell>
                </Table.Row>
            ))}
        </>
    )
}