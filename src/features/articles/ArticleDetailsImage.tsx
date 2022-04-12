import axios from "axios";
import { useEffect, useState } from "react";
import { Image, Popup } from "semantic-ui-react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import NotFound from "../errors/NotFound";
import ImageHighResolution from "./ImageHighResolution";

interface Props {
    fileName: string;
    id: number;
}

export default function ArticleDetailsImage({ fileName, id }: Props) {

    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        try {
            axios({
                url: `/file/${id}/thumb`, //your url
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
            <Popup
                hoverable
                key={id}
                trigger={
                    <Image src={URL.createObjectURL(file)}></Image>
                }
            >
                <Popup.Content>
                    <ImageHighResolution fileName={fileName}></ImageHighResolution>
                </Popup.Content>
            </Popup>
        </>
    )
}