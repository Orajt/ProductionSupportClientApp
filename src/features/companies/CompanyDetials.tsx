import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Grid, Header, Icon, Table } from "semantic-ui-react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useStore } from "../../app/stores/store";
import NotFound from "../errors/NotFound";

export default observer(function CompanyDetials() {

    const { companyStore } = useStore();
    const { getCompanyDetails, companyDetails } = companyStore;

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        if (id !== undefined) {
            getCompanyDetails(id).then(() => setLoading(false));
        }
    }, [id, getCompanyDetails]);

    if (loading) return <LoadingComponent content="loading"></LoadingComponent>;
    if (companyDetails === null) return <NotFound></NotFound>
    return (
        <>
            <Grid>
                <Grid.Row>
                    <Button color="olive" onClick={() => navigate('/companies')}>Back to companies list</Button>
                    <Button color="teal" onClick={() => navigate(`/companies/form/${companyDetails.id}`)}>Edit</Button>
                </Grid.Row>
                <Grid.Row>
                    <Header as="h1">Company name: {companyDetails.name}</Header>
                </Grid.Row>
                <Grid.Row>
                    <Header as="h2">Company Identifier: {companyDetails.companyIdentifier}</Header>
                </Grid.Row>
                <Grid.Row>
                    <Header as="h3">Is suplier?: {companyDetails.supplier ? <Icon name="check"></Icon> : <Icon name="minus"></Icon>}</Header>
                </Grid.Row>
                <Grid.Row>
                    <Header as="h3">Is merchant?: {companyDetails.merchant ? <Icon name="check"></Icon> : <Icon name="minus"></Icon>}</Header>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={8}>
                        <Header as="h3">Delivery place list:</Header>
                        {companyDetails.deliveryPlaces && companyDetails.deliveryPlaces.length > 0 ?
                            <Table celled>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Id</Table.HeaderCell>
                                        <Table.HeaderCell>Name</Table.HeaderCell>
                                        <Table.HeaderCell>Full Adress</Table.HeaderCell>
                                        <Table.HeaderCell></Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {companyDetails.deliveryPlaces.map((deliveryPlace) => (
                                        <Table.Row key={deliveryPlace.id}>
                                            <Table.Cell>{deliveryPlace.id}</Table.Cell>
                                            <Table.Cell>{deliveryPlace.name}</Table.Cell>
                                            <Table.Cell>{deliveryPlace.fullAdress}</Table.Cell>
                                            <Table.Cell><Button onClick={() => navigate(`/deliveryPlaces/form/${deliveryPlace.id}`)}>Details</Button></Table.Cell>
                                        </Table.Row>

                                    ))}
                                </Table.Body>
                            </Table> : <Header as="h3">None delivery places added</Header>}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </>
    )
})