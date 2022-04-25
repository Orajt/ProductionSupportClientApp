import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Header, Icon, Table } from "semantic-ui-react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useStore } from "../../app/stores/store";
import NotFound from "../errors/NotFound";

export default observer(function CompaniesList() {

    const { companyStore } = useStore();
    const { getCompanyList, companyList, clear } = companyStore;

    let navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        getCompanyList().then(() => setLoading(false));
        return clear();
    }, [getCompanyList, clear]);

    if (loading) return <LoadingComponent content="loading"></LoadingComponent>;
    if (companyList == null) return <NotFound></NotFound>

    return (
        <>
            <Header as="h1" >Companies list</Header>
            <Button positive onClick={() => navigate('/companies/form')}>Create new company</Button>
            <Table striped>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Id</Table.HeaderCell>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Company Identifier</Table.HeaderCell>
                        <Table.HeaderCell>Supplier</Table.HeaderCell>
                        <Table.HeaderCell>Merchant</Table.HeaderCell>
                        <Table.HeaderCell></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {companyList.map((company) => (
                        <Table.Row key={company.id}>
                            <Table.Cell>{company.id}</Table.Cell>
                            <Table.Cell>{company.name}</Table.Cell>
                            <Table.Cell>{company.companyIdentifier}</Table.Cell>
                            <Table.Cell>{company.supplier ? <Icon name="check"></Icon> : <Icon name="minus"></Icon>}</Table.Cell>
                            <Table.Cell>{company.merchant ? <Icon name="check"></Icon> : <Icon name="minus"></Icon>}</Table.Cell>
                            <Table.Cell><Button onClick={()=>navigate(`/companies/${company.id}`)}>Details</Button></Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </>
    )
})