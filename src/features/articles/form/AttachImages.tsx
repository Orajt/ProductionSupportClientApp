import axios from "axios";
import { useEffect, useState } from "react";
import { useDropzone } from 'react-dropzone'
import { Button, Grid, List } from "semantic-ui-react";
import styled from 'styled-components';
import agent from "../../../app/api/agent";
import { useStore } from "../../../app/stores/store";
import { ReactSelectInt} from "../../../models/reactSelect";



const getColor = (props: any) => {
    if (props.isDragAccept) {
        return '#00e676';
    }
    if (props.isDragReject) {
        return '#ff1744';
    }
    if (props.isFocused) {
        return '#2196f3';
    }
    return '#eeeeee';
}

const Container = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    border-width: 2px;
    border-radius: 2px;
    border-color: ${props => getColor(props)};
    border-style: dashed;
    background-color: #fafafa;
    color: #bdbdbd;
    outline: none;
    transition: border .24s ease-in-out;
  `;
interface Props{
    setLoading: (loading: boolean) => void;
    articleId: number;
}

export default function AttachPdfFile() {

    const {
        getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject,
        acceptedFiles
    } = useDropzone({ accept: 'image/jpeg,application/pdf' });

    const {fileStore}=useStore();
    const {getFilesRS}=fileStore;

    const [file, setFile]=useState<File|null>(null);
    const [loading, setLoading]=useState(true);
    const [existinfFilesToSelect, setExistingFilesToSelect]=useState<ReactSelectInt[]>([]);
    const [initialInit, setInitialInit]=useState(true);

    useEffect(() => {
        if(initialInit){
            setLoading(true);
            getFilesRS("pdf").then((value)=>{
                if(value)
                    setExistingFilesToSelect(value);
            }).finally(()=>setLoading(false))
        }

        setFile(acceptedFiles[0]);
    }, [acceptedFiles]);

    function deleteFile(name: string)
    {
        // let newFiles=files.filter(p=>p.name!==name);
        // setFiles(newFiles);
        setFile(null);
    }
    function saveFile(){
        var formData = new FormData();
        formData.append("file",file!, file!.name);
        console.log(formData);
        axios({
            method: "post",
            url: `/article/manageFiles/pdf/2`,
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
          }).then((response)=>{
              console.log(response);
          })
    }
    if(loading)
    return (
        <>
            {/* <Grid>
                <Grid.Row>
                    <Grid.Column width="8">
                        <div className="container">
                            <Container {...getRootProps({ isFocused, isDragAccept, isDragReject })}>
                                <input {...getInputProps()}/>
                                <p>Drag 'n' drop pdf file here, or click to select file from disk</p>
                            </Container>
                        </div>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Button onClick={()=>saveFile()}>Save file</Button>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width="7">
                        <List divided relaxed>
                            {files.map((acceptedFile, i) => (
                                <List.Item key={i}>
                                    <List.Content>
                                        <List.Header as='a'>Name: {acceptedFile.name}</List.Header>
                                        <List.Description as='a'>Size: {acceptedFile.size}</List.Description>
                                    </List.Content>
                                    <List.Content floated="right" verticalAlign="middle">
                                        <List.Icon name='delete' size='large' onClick={()=>{deleteFile(acceptedFile.name)}}/>
                                    </List.Content>
                                </List.Item>
                            ))}
                        </List>
                    </Grid.Column>
                </Grid.Row>
            </Grid> */}

            <div>


            </div>
        </>
    )
}