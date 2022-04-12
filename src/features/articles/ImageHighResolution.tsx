import axios from "axios";
import { useEffect, useState } from "react";
import { List, Image, Popup, Header } from "semantic-ui-react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import NotFound from "../errors/NotFound";

interface Props {
    fileName: string;
}

export default function ImageHighResolution({ fileName }: Props) {

    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        try {
            axios({
                url: `/file/${fileName}/jpg`, //your url
                method: "GET",
                responseType: "blob", // important
            })
                .then((response) => {
                    setFile(response.data);
                })
                .then(() => setLoading(false));
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    }, [fileName]);
    if (loading) return <LoadingComponent content="loading"></LoadingComponent>;
    if (file === null) return <NotFound></NotFound>
    return (
        <>
            <Image src={URL.createObjectURL(file)} size="huge"></Image>
            <Header as="h3">This is high resoultion image, right click image to download in high quality or open in new tab</Header>
        </>
    )
}