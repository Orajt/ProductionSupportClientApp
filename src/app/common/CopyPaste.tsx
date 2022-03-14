import { useEffect, useState } from "react";
import LoadingComponent from "../layout/LoadingComponent";

export default function CopyPaste(){

    const [isbusy, setbusy] = useState(true);

    useEffect(() => {
        
    }, []);
    if (isbusy) return <LoadingComponent content="loading"></LoadingComponent>;
    return(
       <></>
    )
}