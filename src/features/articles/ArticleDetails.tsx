import axios from "axios";
import { format } from "date-fns";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionTitleProps, Button, Grid, GridRow, Header, Icon, List, Table, Image } from "semantic-ui-react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useStore } from "../../app/stores/store";
import NotFound from "../errors/NotFound";
import ArticleDetailsImage from "./ArticleDetailsImage";

export default observer(function ArticleDetails() {

    const { articleStore } = useStore();
    const { articleDetails, getArticleDetails, loading, clear } = articleStore;
    const { id } = useParams<{ id: string }>();
    const [activeIndex, setActiveIndex] = useState(-1);
    const [deleteReally, setDeleteReally] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (id !== undefined) {
            getArticleDetails(id);
        }
        return clear();
    }, [id, getArticleDetails, clear]);

    function deleteArticle() {
        axios.delete<void>(`article/${articleDetails!.id}`, {}).then((response) => {
            if (response.status === 200) {
                navigate('/articles');
            }
        })
    }
    function handleAccordion(e: React.MouseEvent<HTMLDivElement, MouseEvent>, props: AccordionTitleProps) {
        const { index } = props;
        let newIndex = activeIndex === index ? -1 : index
        if (!isNaN(parseInt(newIndex!.toString()))) {
            setActiveIndex(parseInt(newIndex!.toString()));
        }
    }

    if (loading) return <LoadingComponent content="loading"></LoadingComponent>;
    if (articleDetails === null) return <NotFound></NotFound>
    return (
        <>
            <Grid>
                <Grid.Column width="10">
                    <Grid.Row className="rowMargin"></Grid.Row>
                    <Grid.Row>
                        <Header as="h1">Article: {articleDetails!.fullName}</Header>
                    </Grid.Row>
                    <Grid.Row>
                        <Button color="teal" size="large" onClick={() => navigate(`/articles/form/${articleDetails.id}`)}>Edit</Button>
                        {articleDetails.ableToEditPrimaries && !deleteReally && <Button color="red" size="large" onClick={() => setDeleteReally(true)}>Delete</Button>}
                        {articleDetails.ableToEditPrimaries && deleteReally &&
                            <div>
                                <Button color="red" size="large" onClick={() => deleteArticle()}>Delete</Button>
                                <Button color="orange" size="large" onClick={() => setDeleteReally(false)}>Cancell</Button>
                            </div>}
                        {articleDetails.articleTypeId===1 && <Button onClick={()=>navigate(`/articles/realizations/${articleDetails.id}`)}>Manage fabric realizations</Button>}
                    </Grid.Row>
                    <Accordion>
                        <Accordion.Title
                            active={activeIndex === 0}
                            index={0}
                            className="fontSizeXXLarge"
                            onClick={(e, props) => {
                                handleAccordion(e, props);
                            }}>
                            <Icon name='dropdown' />
                            Information about edit and create
                        </Accordion.Title>
                        <AccordionContent active={activeIndex === 0}>
                            <GridRow>
                                <Table key="Creation">
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>Craeted</Table.HeaderCell>
                                            <Table.HeaderCell>Edited</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        <Table.Row>
                                            <Table.Cell>{format(articleDetails.createDate!, "dd.MM.yyyy")}</Table.Cell>
                                            <Table.Cell>{format(articleDetails.editDate!, "dd.MM.yyyy")}</Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                </Table>
                            </GridRow>
                        </AccordionContent>
                        <Accordion.Title
                            active={activeIndex === 1}
                            index={1}
                            className="fontSizeXXLarge"
                            onClick={(e, props) => {
                                handleAccordion(e, props);
                            }}>
                            <Icon name='dropdown' />
                            Diemensions
                        </Accordion.Title>
                        <AccordionContent active={activeIndex === 1}>
                            <Grid.Row>
                                <Table key="DiemensionTable">
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>Length</Table.HeaderCell>
                                            <Table.HeaderCell>Width</Table.HeaderCell>
                                            <Table.HeaderCell>High</Table.HeaderCell>
                                            <Table.HeaderCell>Area</Table.HeaderCell>
                                            <Table.HeaderCell>Capacity</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        <Table.Row>
                                            <Table.Cell>{articleDetails.length}</Table.Cell>
                                            <Table.Cell>{articleDetails.width}</Table.Cell>
                                            <Table.Cell>{articleDetails.high}</Table.Cell>
                                            <Table.Cell>{articleDetails.area}</Table.Cell>
                                            <Table.Cell>{articleDetails.capacity}</Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                </Table>
                            </Grid.Row>
                        </AccordionContent>
                        <Accordion.Title
                            active={activeIndex === 2}
                            index={2}
                            className="fontSizeXXLarge"
                            onClick={(e, props) => {
                                handleAccordion(e, props);
                            }}>
                            <Icon name='dropdown' />
                            Details
                        </Accordion.Title>
                        <AccordionContent active={activeIndex === 2}>
                            <GridRow>
                                <Table key="Details">
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>Id</Table.HeaderCell>
                                            <Table.HeaderCell>Familly Name</Table.HeaderCell>
                                            <Table.HeaderCell>Stuff Name</Table.HeaderCell>
                                            <Table.HeaderCell>Fabric Variant Group</Table.HeaderCell>
                                            <Table.HeaderCell>In comp</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        <Table.Row>
                                            <Table.Cell>{articleDetails.id}</Table.Cell>
                                            <Table.Cell>{articleDetails.famillyName}</Table.Cell>
                                            <Table.Cell>{articleDetails.stuffName}</Table.Cell>
                                            <Table.Cell>{articleDetails.fabricVariantGroupName}</Table.Cell>
                                            <Table.Cell>{articleDetails.createdInCompany ? <Icon name="circle" /> : <Icon name="circle outline" />}</Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                </Table>
                            </GridRow>
                        </AccordionContent>
                        <Accordion.Title
                            active={activeIndex === 3}
                            index={3}
                            className="fontSizeXXLarge"
                            onClick={(e, props) => {
                                handleAccordion(e, props);
                            }}>
                            <Icon name='dropdown' />
                            Pdf file
                        </Accordion.Title>
                        <AccordionContent active={activeIndex === 3}>
                            {articleDetails.pdfFile && <List>
                                <List.Item>
                                    <List.Content floated="right">
                                        <Link to={`/files/pdf/${articleDetails.pdfFile.id}`}><List.Icon name='video play' size='large' /></Link>
                                    </List.Content>
                                    <List.Content>
                                        <List.Header className="fontSizeMedium" as='a'>Name: {articleDetails.pdfFile.fileName}</List.Header>
                                    </List.Content>
                                </List.Item>
                            </List>}
                        </AccordionContent>
                        <Accordion.Title
                            active={activeIndex === 4}
                            index={4}
                            className="fontSizeXXLarge"
                            onClick={(e, props) => {
                                handleAccordion(e, props);
                            }}>
                            <Icon name='dropdown' />
                            Photos
                        </Accordion.Title>
                        <AccordionContent active={activeIndex === 4}>
                            <Image.Group size="small">
                            {articleDetails.images && articleDetails.images.map((image)=>(
                                <ArticleDetailsImage key={image.id} fileName={image.fileName} id={image.id} ></ArticleDetailsImage>
                            ))}
                            </Image.Group>
                        </AccordionContent>
                    </Accordion>
                </Grid.Column>
                <Grid.Column width={6}>
                    <Grid.Row>
                        <Header as="h2">Components: </Header>
                    </Grid.Row>
                    <Grid.Row className="rowMargin"></Grid.Row>
                    {articleDetails.childArticles.length > 0 ?
                        <Grid.Row>
                            <Table>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Id</Table.HeaderCell>
                                        <Table.HeaderCell>Name</Table.HeaderCell>
                                        <Table.HeaderCell>Article Type</Table.HeaderCell>
                                        <Table.HeaderCell>Quanity</Table.HeaderCell>
                                        <Table.HeaderCell></Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {articleDetails.childArticles.map((article) => (
                                        <Table.Row key={article.childId}>
                                            <Table.Cell>{article.childId}</Table.Cell>
                                            <Table.Cell>{article.childArticleName}</Table.Cell>
                                            <Table.Cell>{article.childArticleType}</Table.Cell>
                                            <Table.Cell>{article.quanity}</Table.Cell>
                                            <Table.Cell>{article.childArticleHasChild ? <Button onClick={() => navigate(`/articles/${article.childId}`)}><Icon size="small" name="angle right"></Icon></Button> : ""}</Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </Grid.Row>
                        : <Grid.Row className="fontSizeXXLarge">
                            "None"
                        </Grid.Row>}

                </Grid.Column>
            </Grid>

        </>
    )
})