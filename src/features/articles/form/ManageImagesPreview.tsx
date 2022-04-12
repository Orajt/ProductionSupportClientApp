import axios from "axios";
import { useEffect, useState } from "react";
import { List, Image } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import NotFound from "../../errors/NotFound";

interface Props {
    fileName: string;
    deleteFile: (fileName: string)=>void;
}

export default function ManageImagesPreview({ fileName, deleteFile }: Props) {

    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        try {
            axios({
                url: `/file/${fileName}/thumb`, //your url
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
    if(file===null) return <NotFound></NotFound>
    return (
        <>
            <List.Item>
                <Image src={URL.createObjectURL(file)} size="small"></Image>
                <List.Content>
                    <List.Header as='a'>Name: {fileName}</List.Header>
                    <List.Description as='a'>Size: {file.size}</List.Description>
                </List.Content>
                <List.Content floated="right" verticalAlign="middle">
                    <List.Icon name='delete' size='large' onClick={() => { deleteFile(fileName) }} />
                </List.Content>
            </List.Item>
        </>
    )
}