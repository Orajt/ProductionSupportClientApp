import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Header, Table } from "semantic-ui-react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useStore } from "../../app/stores/store";
import NotFound from "../errors/NotFound";

export default observer(function ArticleTypeList() {

    const { articleStore } = useStore();
    const {getArticleTypesRS, articleTypesRS} = articleStore;

    let navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        getArticleTypesRS(false).then(() => setLoading(false));
    }, [getArticleTypesRS]);

    if (loading) return <LoadingComponent content="loading"></LoadingComponent>;
    if (articleTypesRS == null) return <NotFound></NotFound>

    return (
        <>
            <Header as="h1" >Article types list</Header>
            <Table striped>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Id</Table.HeaderCell>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {articleTypesRS.map((articleType) => (
                        <Table.Row key={articleType.value}>
                            <Table.Cell>{articleType.value}</Table.Cell>
                            <Table.Cell>{articleType.label}</Table.Cell>
                            <Table.Cell><Button onClick={()=>navigate(`/articleTypes/assign/${articleType.value}`)}>Manage stuffs</Button></Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </>
    )
})