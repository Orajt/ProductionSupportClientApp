import { observer } from "mobx-react-lite";
import React, { useEffect} from "react";
import { Checkbox, CheckboxProps, Table } from "semantic-ui-react";
import { ArticlePositionFormValues } from "../../../models/article";

interface IProps {
    component: ArticlePositionFormValues;
    handleCheck: (x: number, checked: boolean) => void;
    index: number;
}

export default observer(function ArticleFormComponentsRow({ component, index, handleCheck }: IProps) {
    useEffect(() => {
    }, [component]);
    function handleCheckInside(data: CheckboxProps) {
        if (data.checked !== undefined) {
            handleCheck(index, data.checked); return
        }
    }

    return (
        <><Table.Row>
            <Table.Cell style={{ "width": "15%" }}> <Checkbox className="width100p" onChange={(e, data) => { handleCheckInside(data) }} /></Table.Cell>
            <Table.Cell style={{ "width": "15%" }}>{component.childId}</Table.Cell>
            <Table.Cell style={{ "width": "50%" }}>{component.childArticleName}</Table.Cell>
            <Table.Cell style={{ "width": "20%" }}>{component.quanity}</Table.Cell>
        </Table.Row>
        </>
    )
})
