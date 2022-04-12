import axios from "axios";
import { useEffect, useState } from "react";
import { useDropzone } from 'react-dropzone'
import { Button, Grid, Header, List, ListContent, Image } from "semantic-ui-react";
import styled from 'styled-components';
import Select from "react-select"
import { useStore } from "../../../app/stores/store";
import { ReactSelectInt } from "../../../models/reactSelect";
import { toast } from "react-toastify";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import ManageImagesPreview from "./ManageImagesPreview";



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
interface Props {
    articleId: number;
    images?: string[];
}

export default function ManageImages({ articleId, images }: Props) {

    const {
        getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject,
        acceptedFiles
    } = useDropzone({ accept: 'image/jpeg' });

    const { fileStore } = useStore();
    const { getFilesRS } = fileStore;

    const [files, setFiles] = useState<File[] | null>(null);
    const [existinfFilesToSelect, setExistingFilesToSelect] = useState<ReactSelectInt[]>([]);
    const [loading, setLoading] = useState(true);
    const [initialInit, setInitialInit] = useState(true);
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [selectedOption, setSelectedOption] = useState<ReactSelectInt>({ label: "", value: 0 } as ReactSelectInt)

    useEffect(() => {
        if (initialInit) {
            setLoading(true);
            if (images) {
                setSelectedOptions(images)
            }
            getFilesRS("jpg").then((value) => {
                if (value)
                    setExistingFilesToSelect(value);
            }).finally(() => {
                setInitialInit(false);
                setLoading(false)
            })
        }
        if (!initialInit) {
            setLoading(true);
            let fileListToAdd = acceptedFiles.filter(file => !existinfFilesToSelect.some(x => x.label === file.name));
            let fileListExistsInServer = acceptedFiles.filter(file => !fileListToAdd.some(x => x.name === file.name));
            let optionsToAdd = [] as string[];
            fileListExistsInServer.forEach(file => {
                if (selectedOptions.length > 0) {
                    if (!selectedOptions.some(selectedOption => selectedOption === file.name)) {
                        optionsToAdd.push(file.name)
                    }
                }
                if (selectedOptions.length === 0) {
                    optionsToAdd.push(file.name);
                }
            });
            setSelectedOptions(selectedOptions.concat(optionsToAdd).sort((a, b) => a.localeCompare(b)));
            setFiles(fileListToAdd);
            setLoading(false);
        }

    }, [acceptedFiles, articleId, selectedOption]);

    function deleteFile(fileName: string) {
        if (files) {
            setFiles(files.filter(p => p.name !== fileName))
        }
    }
    function deleteSelectedOption(fileName: string) {
        console.log("nakurwiam")
        console.log(fileName);
        let newOptions = selectedOptions.filter(p => p !== fileName);
        console.log(newOptions);
        setSelectedOptions(newOptions);
    }
    function saveFiles() {
        var formData = new FormData();
        if (files && files.length > 0) {
            files.forEach(file => {
                console.log("-------------------")
                console.log(file);
                formData.append("files", file!, file!.name);
            });
        }
        if (selectedOptions.length > 0) {
            selectedOptions.forEach(fileName => {
                formData.append("exsistingFiles[]", fileName)
            })
        }
        console.log(formData);

        axios({
            method: "post",
            url: `/file/${articleId}`,
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
        }).then((response) => {
            if (response.status === 200)
                toast.success("Manage file successfully");
        })
    }
    if (loading) return <LoadingComponent></LoadingComponent>
    return (
        <>
            <Grid>
                <Grid.Row>
                    <Grid.Column width="8">
                        <div className="container">
                            <Container {...getRootProps({ isFocused, isDragAccept, isDragReject })}>
                                <input {...getInputProps()} />
                                <p>Drag 'n' drop images here, or click to select images from disk</p>
                            </Container>
                        </div>
                    </Grid.Column>
                    <Grid.Column width="8">
                        <div>
                            <label className="boldFont">Choose image located on server</label>
                            <Select
                                options={existinfFilesToSelect}
                                value={existinfFilesToSelect.filter(option =>
                                    option.value === selectedOption!.value)}
                                onChange={(d) => {
                                    setSelectedOption(d!);
                                    if(!selectedOptions.some(p=>p===d!.label)){
                                        setSelectedOptions([...selectedOptions, d!.label])
                                    }
                                    console.log(selectedOptions);
                                }}
                                placeholder={"Choose file"}
                            />
                        </div>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row textAlign="center">
                    <Grid.Column textAlign="left" width="7">
                        <Header as="h2">Images to upload:</Header>
                        {files && files.length > 0 && <List divided relaxed>
                            {files.map((file) => (
                                <List.Item key={file.name}>
                                    <Image src={URL.createObjectURL(file)} size="small"></Image>
                                    <List.Content>
                                        <List.Header as='a'>Name: {file.name}</List.Header>
                                        <List.Description as='a'>Size: {file.size}</List.Description>
                                    </List.Content>
                                    <List.Content floated="right" verticalAlign="middle">
                                        <List.Icon name='delete' size='large' onClick={() => { deleteFile(file.name) }} />
                                    </List.Content>
                                </List.Item>
                            ))}
                        </List>}
                        <Header as="h2">Images located in server</Header>
                        <List divided relaxed>
                            {selectedOptions.map((fileName) => (
                                <ManageImagesPreview key={fileName} deleteFile={deleteSelectedOption} fileName={fileName}></ManageImagesPreview>
                                
                            ))}
                        </List>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row textAlign="center">
                    <Grid.Column>
                        <Button positive onClick={() => saveFiles()}>Save files</Button>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </>
    )
}