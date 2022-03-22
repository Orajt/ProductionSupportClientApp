import { observer } from "mobx-react-lite";
import { useEffect} from "react";
import { Table } from "semantic-ui-react";
import { ArticlePositionFormValues } from "../../../models/article";
import ArticleFormComponentsRow from "./ArticleFormComponentsRow";

interface IProps{
    components: ArticlePositionFormValues[];
    handleCheck:(x: number, checked: boolean)=>void;
}

export default observer(function ArticleFormComponents(props: IProps){
    useEffect(() => {
    }, [props.components]);

    return(
        <Table celled>
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell></Table.HeaderCell>
                <Table.HeaderCell>id</Table.HeaderCell>
                <Table.HeaderCell>Article Name</Table.HeaderCell>
                <Table.HeaderCell>Quanity</Table.HeaderCell>

            </Table.Row>
        </Table.Header>
        <Table.Body>
            {props.components &&  props.components.map((component, i) => (
                <ArticleFormComponentsRow key={i} component={component} index={i} handleCheck={props.handleCheck}></ArticleFormComponentsRow> 
            ))}
        </Table.Body>
        </Table>
    )
})


