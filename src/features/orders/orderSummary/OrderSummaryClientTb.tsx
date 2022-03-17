import React from "react";
import { useEffect, useState } from "react";
import { Grid, Header, Table, TableBody, TableRow } from "semantic-ui-react";
import { OrderSummaryClient } from "../../../models/orders";

interface IProps {
    client: OrderSummaryClient;
}

export default function OrderSummaryClientTb({ client }: IProps) {

    useEffect(() => {

    }, []);
    return (
        <>
            <Grid.Row>
                <Header as="h2">Client: {client.client}</Header>
            </Grid.Row>
            {client.positions.map((set) => (
                <React.Fragment key={set.setId}>
                    <Grid.Row>
                        <Header as="h3">Set ID: {set.setId} Set Name: {set.setName}</Header>
                    </Grid.Row>
                    <Grid.Row>
                        <Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>PosId</Table.HeaderCell>
                                    <Table.HeaderCell>Lp</Table.HeaderCell>
                                    <Table.HeaderCell>Article Name</Table.HeaderCell>
                                    <Table.HeaderCell>Quanity</Table.HeaderCell>
                                    <Table.HeaderCell>Realization</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <TableBody>
                                {set.positions.map((setPosition) => (
                                    <Table.Row key={setPosition.id}>
                                        <Table.Cell>{setPosition.id}</Table.Cell>
                                        <Table.Cell>{setPosition.lp}</Table.Cell>
                                        <Table.Cell>{setPosition.articleName}</Table.Cell>
                                        <Table.Cell>{setPosition.quanity}</Table.Cell>
                                        <Table.Cell>{setPosition.realization}</Table.Cell>
                                    </Table.Row>
                                ))}
                            </TableBody>
                        </Table>
                    </Grid.Row>
                </React.Fragment>))}
        </>
    )
}