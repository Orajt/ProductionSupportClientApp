import { useEffect, useState } from "react";
import LoadingComponent from "../layout/LoadingComponent";
import {Image} from 'semantic-ui-react'

export default function Gowno(){


    useEffect(() => {
        console.log("gowno");
    }, []);
    return(
       <>
        <Image src='https://samequizy.pl/wp-content/uploads/2018/12/filing_images_b0f880180359.jpg' size='small' />
       </>
    )
}