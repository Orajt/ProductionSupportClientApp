import { format } from "date-fns";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Header, Pagination, PaginationProps, Table } from "semantic-ui-react";
import DateFilter from "../../app/common/filters/DateFilter";
import NumberFilter from "../../app/common/filters/NumberFilter";
import StringFilter from "../../app/common/filters/StringFilter";
import { Utilities } from "../../app/common/utilities/Utilities";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { FilterResult } from "../../app/models/filter";
import { useStore } from "../../app/stores/store";

export default observer(function ArticleList() {

    const { articleStore } = useStore()
    const { getArticles, articleList, clear, pagingParams, setPagingParams, pagination } = articleStore;
    const [loading, setLoading] = useState(true);
    let navigate = useNavigate();
    const [filters, setFilters] = useState<FilterResult[]>([]);
    useEffect(() => {
        getArticles(filters).then(() => setLoading(false));
        return (() => {
            clear();
        })
    }, [getArticles, setPagingParams, clear]);

    function handleSetFilters(filter: FilterResult) {
        var newFilters = filters.filter(p => p.propertyName !== filter.propertyName);
        if (filter.dateValue !== null || filter.intValue !== 0 || filter.stringValue) {
            newFilters.push(filter);
        }
        setFilters(newFilters);
        console.log(filters);
    }
    function clearAllFilters() {
        setFilters([]);
        getArticles([]);
    }
    function pageChaanged(e: PaginationProps) {
        let newPagingParams = { ...pagingParams };
        newPagingParams.pageNumber = parseInt(e.activePage!.toString());
        setPagingParams(newPagingParams);
        getArticles(filters);
    }

    if (loading) return <LoadingComponent content="loading"></LoadingComponent>;
    return (
        <>
            <Header as="h1" >Article list</Header>
            <Button positive onClick={() => navigate('/articles/form')}>Create new article</Button>
            <Button onClick={() => getArticles(filters)} content="Enable filters" />
            <Button onClick={() => clearAllFilters()} content="Clear filters" />
            <div className="fontSizeMedium boldFont">Actual filters: {filters.map((filter) => (
                `${Utilities.getFilterDescription(filter)}`
            ))}</div>
            <Table striped>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell style={{ "width": "5%" }}>Id</Table.HeaderCell>
                        <Table.HeaderCell style={{ "width": "12%" }}>Name</Table.HeaderCell>
                        <Table.HeaderCell style={{ "width": "10%" }}>Article Type Name</Table.HeaderCell>
                        <Table.HeaderCell style={{ "width": "10%" }}>Familly Name</Table.HeaderCell>
                        <Table.HeaderCell style={{ "width": "10%" }}>Stuff Name</Table.HeaderCell>
                        <Table.HeaderCell style={{ "width": "10%" }}>Create Date</Table.HeaderCell>
                        <Table.HeaderCell style={{ "width": "10%" }}>Edit Date</Table.HeaderCell>
                        <Table.HeaderCell style={{ "width": "10%" }}>Details</Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.HeaderCell><NumberFilter propertyName="Id" setFilter={handleSetFilters} clearAll={clearAllFilters} key="Id"></NumberFilter></Table.HeaderCell>
                        <Table.HeaderCell><StringFilter propertyName="FullName" setFilter={handleSetFilters} clearAll={clearAllFilters} key="FullName"></StringFilter></Table.HeaderCell>
                        <Table.HeaderCell><StringFilter propertyName="ArticleTypeName" setFilter={handleSetFilters} clearAll={clearAllFilters} key="ArticleTypeName"></StringFilter></Table.HeaderCell>
                        <Table.HeaderCell><StringFilter propertyName="FamillyName" setFilter={handleSetFilters} clearAll={clearAllFilters} key="FamillyName"></StringFilter></Table.HeaderCell>
                        <Table.HeaderCell><StringFilter propertyName="StuffName" setFilter={handleSetFilters} clearAll={clearAllFilters} key="StuffName"></StringFilter></Table.HeaderCell>
                        <Table.HeaderCell><DateFilter propertyName="CreateDate" setFilter={handleSetFilters} clearAll={clearAllFilters} key="CreateDate"></DateFilter></Table.HeaderCell>
                        <Table.HeaderCell><DateFilter propertyName="EditDate" setFilter={handleSetFilters} clearAll={clearAllFilters} key="EditDate"></DateFilter></Table.HeaderCell>
                        <Table.HeaderCell></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {articleList && articleList?.map((article) => (
                        <Table.Row key={article.id}>
                            <Table.Cell>{article.id}</Table.Cell>
                            <Table.Cell>{article.fullName}</Table.Cell>
                            <Table.Cell>{article.articleTypeName}</Table.Cell>
                            <Table.Cell>{article.famillyName}</Table.Cell>
                            <Table.Cell>{article.stuffName}</Table.Cell>
                            <Table.Cell>{format(article.createDate, 'dd MMM yyyy')}</Table.Cell>
                            <Table.Cell>{format(article.editDate, 'dd MMM yyyy')}</Table.Cell>

                            {article.articleTypeId!==6 ? 
                            <Table.Cell>
                                <Link to={`/articles/${article.id}`}><Button content="Details" /></Link>
                            </Table.Cell> :
                            <Table.Cell>
                                <Link to={`/fabrics/form/${article.id}`}><Button content="Details" /></Link>
                            </Table.Cell>}
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
            <Pagination defaultActivePage={pagination!.currentPage} totalPages={pagination!.totalPages} onPageChange={(e, d) => pageChaanged(d)} />
        </>
    )
})