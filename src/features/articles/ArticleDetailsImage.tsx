import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Image} from "semantic-ui-react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import NotFound from "../errors/NotFound";

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
    }, [fileName, id]);
    if (loading) return <LoadingComponent content="loading"></LoadingComponent>;
    if (file === null) return <NotFound></NotFound>
    return (
        <>
            <Link to={`/img/${fileName}`}><Image src={URL.createObjectURL(file)}></Image></Link>
        </>
    )
}