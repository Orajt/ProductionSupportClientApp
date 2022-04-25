import { observer } from "mobx-react-lite";
import React, { useEffect} from "react";
import { Button, Checkbox, CheckboxProps, Table } from "semantic-ui-react";
import { OrderPosition, OrderPositionFormValues } from "../../../models/orders";
import { useStore } from "../../../app/stores/store";
import OrderPositionForm from "../form/OrderPositionForm";

interface IProps {
    position: OrderPosition;
    handleCheck: (x: number, checked: boolean) => void;
    index: number;
    form: boolean;
    handleEdit:(pos: OrderPositionFormValues)=>void;
}

export default observer(function OrderDetailsRow({ position, index, handleCheck, form, handleEdit }: IProps) {
    const {modalStore}=useStore();
    useEffect(() => {
    }, [position]);
    function handleCheckInside(data: CheckboxProps) {
        if (data.checked !== undefined) {
            if (form) {
                handleCheck(index, data.checked); return
            }
            if (!form) {
                handleCheck(position.id, data.checked); return
            }
        }
    }

    return (
        <>{form ? <Table.Row>
            <Table.Cell style={{ "width": "3%" }}> <Checkbox className="width100p" onChange={(e, data) => { handleCheckInside(data) }} />
            <Button size="tiny" positive onClick={() => modalStore.openModal(<OrderPositionForm orderPosition={{...position, index:index}} handleEdit={handleEdit}/>)} >E</Button></Table.Cell>
            <Table.Cell style={{ "width": "3%" }}>{position.id}</Table.Cell>
            <Table.Cell style={{ "width": "4%" }}>{position.setId}</Table.Cell>
            <Table.Cell style={{ "width": "4%" }}>{position.lp}</Table.Cell>
            <Table.Cell style={{ "width": "30%" }}>{position.articleName}</Table.Cell>
            <Table.Cell style={{ "width": "5%" }}>{position.quanity}</Table.Cell>
            <Table.Cell style={{ "width": "30%" }}>{position.realization}</Table.Cell>
            <Table.Cell style={{ "width": "20%" }}>{position.client}</Table.Cell>
        </Table.Row> :
            <Table.Row>
                <Table.Cell style={{ "width": "2%" }}> <Checkbox onChange={(e, data) => { handleCheckInside(data) }} /></Table.Cell>
                <Table.Cell style={{ "width": "4%" }}>{position.id}</Table.Cell>
                <Table.Cell style={{ "width": "4%" }}>{position.setId}</Table.Cell>
                <Table.Cell style={{ "width": "4%" }}>{position.lp}</Table.Cell>
                <Table.Cell style={{ "width": "30%" }}>{position.articleName}</Table.Cell>
                <Table.Cell style={{ "width": "5%" }}>{position.quanity}</Table.Cell>
                <Table.Cell style={{ "width": "30%" }}>{position.realization}</Table.Cell>
                <Table.Cell style={{ "width": "20%" }}>{position.client}</Table.Cell>
            </Table.Row>}

        </>
    )
})
