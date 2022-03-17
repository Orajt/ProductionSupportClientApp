import { useState } from "react";
import Select, { SingleValue } from 'react-select'

interface IProps {
    setFilterType: (opt: string) => void;
}

export default function NumberDateDropDown({ setFilterType }: IProps) {
    const [value, setValue] = useState<string | undefined>("=");
    const dropDownOptions = [
        {
            label: '=',
            value: 'EQ',
        },
        {
            label: '>',
            value: 'GT',
        },
        {
            label: '<',
            value: 'LT',
        },
    ]
    function handleChaange(d:SingleValue<{
        label: string;
        value: string;
    }>){
        if(!d)
            return;
        setValue(d.value);
        setFilterType(d.value);
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
                    dropDownOptions.filter(opt => opt.value === "=")
                }
                onChange={(d)=>{handleChaange(d)}}
            ></Select>
        </>
    )
}