import axios from "axios";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Button, Grid, GridColumn, Header, Segment } from "semantic-ui-react";
import { Utilities } from "../../../app/common/utilities/Utilities";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import { ArticleFormValues, ArticlePositionFormValues } from "../../../models/article";
import NotFound from "../../errors/NotFound";
import ArticleDetails from "../ArticleDetails";
import ArticleFormComponents from "./ArticleFormComponents";
import ArticleFormPrimary from "./ArticleFormPrimary";
import ArticleFormSecondary from "./ArticleFormSecondary";

export default observer(function ArticleForm() {

    ///////////////////////STORES//////////////////////////////////
    const { articleStore, modalStore } = useStore();
    const { getArticleTypesRS, articleTypesRS, getArticleDetails, clear } = articleStore;
    const { closeModal } = modalStore;

    ////////////////ROUTE PARAMS//////////////////////////////////////
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    ////////////////LOCAL STATE//////////////////////////////////////
    const [article, setArticle] = useState<ArticleFormValues>(new ArticleFormValues());
    const [editMode, setEditMode] = useState(false);
    const [title, setTitle] = useState("Create new article");
    const [loading, setLoading] = useState(true);
    const [secondStep, setSecondStep] = useState(false);
    const [primaryFormVisible, setPrimaryFormVisible] = useState(true);
    const [secondFormBlocked, setsecondFormBlocked] = useState(false);
    const [reallyWantToDelete, setreallyWantToDelete] = useState(false);
    const [someChaanges, setSomeChaanges] = useState(false);
    const [articlesToDeleteFromOrder, setarticlesToDeleteFromOrder] = useState<number[]>([]);

    useEffect(() => {
        if (id && !isNaN(parseInt(id))) {
            getArticleDetails(id).then((value) => {
                console.log(value);
                setArticle(value as ArticleFormValues);

            })
                .then(() => getArticleTypesRS(true))
                .finally(() => {
                    setTitle(`Edit article ${article.fullName}`);
                    setSecondStep(true);
                    setEditMode(true);
                    setLoading(false);
                });
        }
        if (!id) {
            getArticleTypesRS(true).then(() => setLoading(false))
        }
        return clear();

    }, [getArticleDetails, id, getArticleTypesRS]);

    ///////////////////////FUNCTIONS//////////////////////////////////////////
    function handleFormSubmit(saveAndSeeDetails: boolean) {
        setLoading(true)
        if (editMode) {
            axios.put<void>(`/article/${id}`, article).then((response) => {
                if (response.status === 200 && saveAndSeeDetails) {
                    navigate(`/articles/${id}`);
                    return;
                }
            })
        }
        if (!editMode) {
            axios.post<void>(`/article/`, article).then((response) => {
                if (response.status === 200 && saveAndSeeDetails) {
                    navigate(`/articles/${article.fullName}`);
                    return;
                }
            })
        }
        setLoading(false);
    }
    function handlePrimaryFormSubmit(values: ArticleFormValues) {
        console.log(values);
        let newArticle = {
            ...values
        }
        if (values.famillyReactSelect !== null)
            newArticle.famillyId = values.famillyReactSelect.value;
        if (values.stuffReactSelect)
            newArticle.stuffId = values.stuffReactSelect.value;
        if (values.articleTypeReactSelect)
            newArticle.articleTypeId = values.articleTypeReactSelect.value;

        console.log(values);
        setArticle(newArticle);
        setPrimaryFormVisible(false);
        setSecondStep(true);
        setSomeChaanges(true);
    }
    function handleSecondaryFormSubmit(values: ArticlePositionFormValues) {
        console.log(values);
        let newArticle = {
            ...article
        }
        values.childArticleName = values.articleRS!.label;
        values.childId = values.articleRS!.value;
        newArticle.childArticles.push(values);
        newArticle.childArticles.sort(function (a: ArticlePositionFormValues, b: ArticlePositionFormValues) {
            return a.childArticleName.localeCompare(b.childArticleName);
        })
        console.log(newArticle);
        setArticle(newArticle);
        setSomeChaanges(true);
    }
    function handleCheckChaange(index: number, data: boolean) {
        let numberTable = [] as number[];
        if (data === false) {
            numberTable = articlesToDeleteFromOrder.filter(x => x !== index);
            if (numberTable.length === 0) {
                setsecondFormBlocked(false);
            }
        }
        if (data === true) {
            numberTable = [...articlesToDeleteFromOrder, index]
            setsecondFormBlocked(true);
        }
        setarticlesToDeleteFromOrder(numberTable);
    }
    function deleteReally() {
        let childListAfterDelete = Utilities.removeItemFromCollectionBasedOnIndex(article.childArticles, articlesToDeleteFromOrder);
        const newArticle = { ...article }
        newArticle.childArticles = childListAfterDelete;
        setArticle(newArticle);
        setSomeChaanges(true);
        setsecondFormBlocked(false);
    }

    if (loading) return <LoadingComponent content="loading"></LoadingComponent>;
    if (id && ArticleDetails === null) return <NotFound></NotFound>

    return (
        <>
            <Segment clearing>
                <Grid>
                    <Grid.Row textAlign="left">
                        <GridColumn width="7">
                            {primaryFormVisible ? <ArticleFormPrimary title={title} articleTypes={articleTypesRS}
                                initialValues={article} handleFormSubmit={handlePrimaryFormSubmit} editMode={editMode}></ArticleFormPrimary> :
                                <Header as="h2">{article.fullName}</Header>}
                        </GridColumn>
                        <GridColumn width="9">
                            <Grid.Row>
                                {!primaryFormVisible ?
                                    <Button onClick={() => setPrimaryFormVisible(true)}>Show article form</Button> :
                                    <Button onClick={() => setPrimaryFormVisible(false)}>Hide article form</Button>}
                                {someChaanges && <Button positive onClick={() => handleFormSubmit(true)}>Save Chaanges and see details</Button>}
                                {someChaanges && !editMode && <Button positive onClick={() => handleFormSubmit(false)}>Save Chaanges and create another</Button>}
                            </Grid.Row>
                            <Grid.Row>
                                {secondFormBlocked && !reallyWantToDelete && <Button size="medium" color="red" onClick={() => setreallyWantToDelete(true)}>Delete selected</Button>}
                                {secondFormBlocked && reallyWantToDelete &&
                                    <React.Fragment>
                                        <Button size="medium" color="red" onClick={() => deleteReally()}>Delete</Button>
                                        <Button size="medium" color="orange" onClick={() => setreallyWantToDelete(false)}>Cancell</Button>
                                    </React.Fragment>}
                            </Grid.Row>
                        </GridColumn>
                    </Grid.Row>
                    {secondStep &&
                        <Grid.Row>
                            <Grid.Column width="7">
                                <ArticleFormSecondary articleTypeId={article.articleTypeId} handleFormSubmit={handleSecondaryFormSubmit} isBlocked={secondFormBlocked}></ArticleFormSecondary>
                            </Grid.Column>
                            <Grid.Column width={9}>
                                <ArticleFormComponents components={article.childArticles} handleCheck={handleCheckChaange}></ArticleFormComponents>
                            </Grid.Column>
                        </Grid.Row>
                    }
                </Grid>
            </Segment>
        </>
    )
})