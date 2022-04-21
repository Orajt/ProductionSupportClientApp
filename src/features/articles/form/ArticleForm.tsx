import axios from "axios";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Accordion, AccordionContent, AccordionTitleProps, Button, Grid, GridColumn, Header, Icon, Segment } from "semantic-ui-react";
import { Utilities } from "../../../app/common/utilities/Utilities";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import { ArticleFormValues, ArticlePositionFormValues } from "../../../models/article";
import NotFound from "../../errors/NotFound";
import ArticleDetails from "../ArticleDetails";
import ArticleFormComponents from "./ArticleFormComponents";
import ArticleFormSecondary from "./ArticleFormSecondary";
import ArticleFormPrimary from "./ArticleFormPrimary";
import ManagePdfFile from "./ManagePdfFile";
import ManageImages from "./ManageImages";

export default observer(function ArticleForm() {

    ///////////////////////STORES//////////////////////////////////
    const { articleStore, modalStore } = useStore();
    const { getArticleTypesRS, articleTypesRS, getArticleDetails, clear } = articleStore;

    ////////////////ROUTE PARAMS//////////////////////////////////////
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    ////////////////LOCAL STATE//////////////////////////////////////
    const [editMode, setEditMode] = useState(false);
    const [article, setArticle] = useState<ArticleFormValues>(new ArticleFormValues());
    const [title, setTitle] = useState("Create new article");
    const [loading, setLoading] = useState(true);
    const [secondStep, setSecondStep] = useState(false);
    const [secondFormBlocked, setsecondFormBlocked] = useState(false);
    const [reallyWantToDelete, setreallyWantToDelete] = useState(false);
    const [someChaanges, setSomeChaanges] = useState(false);
    const [articlesToDeleteFromOrder, setarticlesToDeleteFromOrder] = useState<number[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (id && !isNaN(parseInt(id))) {
            getArticleDetails(id).then((value) => {
                var newValue = { ...value }
                setArticle(newValue as ArticleFormValues);
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
                if (response.status === 200) {
                    if (saveAndSeeDetails) {
                        navigate(`/articles/${id}`);
                        return;
                    }
                    toast.success("Article edit successfully");
                    return;
                }
            })
        }
        if (!editMode) {
            axios.post<void>(`/article/`, article).then((response) => {
                if (response.status === 200) {
                    if (saveAndSeeDetails) {
                        navigate(`/articles/${article.fullName}`);
                        return;
                    }
                    setSecondStep(false);
                    toast.success("Article create successfully");
                    return;
                }
            })
        }
        setLoading(false);
    }
    function handlePrimaryFormSubmit(values: ArticleFormValues) {
        let newArticle = {
            ...values
        }
        if (values.famillyReactSelect)
            newArticle.famillyId = values.famillyReactSelect.value;
        if (values.stuffReactSelect)
            newArticle.stuffId = values.stuffReactSelect.value;
        if (values.fabricVariantGroupReactSelect)
            newArticle.fabricVariantGroupId = values.fabricVariantGroupReactSelect.value;
        if (values.articleTypeReactSelect)
            newArticle.articleTypeId = values.articleTypeReactSelect.value;
        newArticle.childArticles = [...article.childArticles];
        setArticle(newArticle);
        setSecondStep(true);
        setSomeChaanges(true);
    }
    function handleSecondaryFormSubmit(values: ArticlePositionFormValues) {
        let newArticle = {
            ...article,
            childArticles: [...article.childArticles]
        }
        let newValues = { ...values };
        console.log(newValues.childId);

        let index = newArticle.childArticles.findIndex(p => p.childId === newValues.articleRS!.value);
        if (index >= 0) {
            newArticle.childArticles.splice(index, 1)
        }
        newValues.childArticleName = values.articleRS!.label;
        newValues.childId = values.articleRS!.value;
        newArticle.childArticles.push(newValues);
        newArticle.childArticles.sort(function (a: ArticlePositionFormValues, b: ArticlePositionFormValues) {
            return a.childArticleName.localeCompare(b.childArticleName);
        })
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
    function handleAccordion(e: React.MouseEvent<HTMLDivElement, MouseEvent>, props: AccordionTitleProps) {
        const { index } = props;
        let newIndex = activeIndex === index ? -1 : index
        if (!isNaN(parseInt(newIndex!.toString()))) {
            setActiveIndex(parseInt(newIndex!.toString()));
        }
    }

    if (loading) return <LoadingComponent content="loading"></LoadingComponent>;
    if (id && ArticleDetails === null) return <NotFound></NotFound>

    return (
        <>
            <Segment clearing>
                <Header as ="h1" color="teal">
                    {title}
                </Header>
                {editMode && <Button onClick={()=>navigate(`/articles/${id}`)}>Back to details</Button>}
                <Accordion fluid>
                    <Accordion.Title
                        active={activeIndex === 0}
                        index={0}
                        className="fontSizeXXLarge"
                        onClick={(e, props) => {
                            handleAccordion(e, props);
                        }}>
                        <Icon name='dropdown' />
                        Primary form
                    </Accordion.Title>
                    <AccordionContent active={activeIndex === 0}>
                        <Grid>
                            <Grid.Row>
                                <GridColumn width="7">
                                    <ArticleFormPrimary articleTypes={articleTypesRS}
                                        initialValues={article} handleFormSubmit={handlePrimaryFormSubmit} editMode={editMode}></ArticleFormPrimary>
                                </GridColumn>
                                <GridColumn width="9">
                                    <Grid.Row>
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
                    </AccordionContent>
                    {editMode &&
                        <Grid.Row>
                            <Accordion.Title
                                active={activeIndex === 1}
                                index={1}
                                className="fontSizeXXLarge"
                                onClick={(e, props) => {
                                    handleAccordion(e, props);
                                }}>
                                <Icon name='dropdown' />
                                Manage pdf file
                            </Accordion.Title>
                            <AccordionContent active={activeIndex === 1}>
                                <ManagePdfFile articleId={article.id} pdfName={article.pdfFile?.fileName}></ManagePdfFile>
                            </AccordionContent>
                        </Grid.Row>}
                        {editMode &&
                        <Grid.Row>
                            <Accordion.Title
                                active={activeIndex === 2}
                                index={2}
                                className="fontSizeXXLarge"
                                onClick={(e, props) => {
                                    handleAccordion(e, props);
                                }}>
                                <Icon name='dropdown' />
                                Manage images
                            </Accordion.Title>
                            <AccordionContent active={activeIndex === 2}>
                                <ManageImages articleId={article.id} images={article.images?.map(function (v){return v.fileName})}></ManageImages>
                            </AccordionContent>
                        </Grid.Row>}
                </Accordion>
            </Segment >
        </>
    )
})