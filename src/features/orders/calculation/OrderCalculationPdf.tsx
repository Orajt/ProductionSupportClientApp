import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import NotFound from "../../errors/NotFound";
import ViewPdf from "../../ViewPdf";

export default function OrderCalculationPdf() {

    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState(new Blob());
    const [fileName, setFileName]=useState("name");
    ////////////////ROUTE PARAMS//////////////////////////////////////
    const { orderId, articleTypeId  } = useParams<{ orderId: string,  articleTypeId: string}>();

    useEffect(() => {
        try {
            axios({
                url: `/calculation/${orderId}/${articleTypeId}`, //your url
                method: "GET",
                responseType: "blob", // important
            })
                .then((response) => {
                    if(response.headers["content-disposition"]){
                        let header = response.headers["content-disposition"];
                        setFileName(header.split(`=`)[1].split('\"')[1]);   
                    }
                    setFile(response.data);
                })
                .then(() => setLoading(false));
        } catch (err) {
            console.log(err);
            setLoading(false);
        }

    }, [orderId,articleTypeId]);
    if (loading) return <LoadingComponent content="loading"></LoadingComponent>;
    return (
        <>
            {file.size === 0 ? <NotFound></NotFound> : <ViewPdf file={file} name={fileName} downloadable={true}></ViewPdf>}
        </>
    )
}