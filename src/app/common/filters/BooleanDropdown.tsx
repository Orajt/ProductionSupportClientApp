import { useState } from "react";
import Select, { SingleValue } from 'react-select'
import { FilterResult } from "../../models/filter";

interface IProps {
    propertyName: string;
    setFilter: (filter: FilterResult) => void;
    clearAll: () => void;
}

export default function BooleanDropdown({ propertyName, setFilter: parentFilter, clearAll}: IProps) {
    const [filter, setFilter] = useState<FilterResult>(new FilterResult(propertyName, "EQ"));
    const [value, setValue] = useState<string | undefined>("");
    const dropDownOptions = [
        {
            label: 'tru',
            value: 'true',
        },
        {
            label: 'fal',
            value: 'false',
        },
        {
            label: 'any',
            value: 'any',
        },
    ]
    function handleChaange(d:SingleValue<{
        label: string;
        value: string;
    }>){
        if(!d)
            return;
        let newFilter = { ...filter }
        newFilter.destroy=false;
        newFilter.booleanValue=d.value==="true"? true : false
        if(d.value==="any")
            newFilter.destroy=true;
        setValue(d.value);
        setFilter(newFilter);
        console.log(newFilter);
        parentFilter(newFilter);
    }
    return (
        <>
            <Select
                className="width100p"
                placeholder=''
                options={dropDownOptions}
                value={
                    dropDownOptions.filter(opt => opt.value === value).length > 0 ? 
                    dropDownOptions.filter(opt => opt.value === value) :  
                    dropDownOptions.filter(opt => opt.value === "any")
                }
                onChange={(d)=>{handleChaange(d)}}
            ></Select>
        </>
    )
}