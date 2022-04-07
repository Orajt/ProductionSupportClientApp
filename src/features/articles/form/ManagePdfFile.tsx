import axios from "axios";
import { useEffect, useState } from "react";
import { useDropzone } from 'react-dropzone'
import { Button, Grid, List } from "semantic-ui-react";
import styled from 'styled-components';
import Select from "react-select"
import { useStore } from "../../../app/stores/store";
import { ReactSelectInt } from "../../../models/reactSelect";
import { toast } from "react-toastify";
import LoadingComponent from "../../../app/layout/LoadingComponent";



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
    pdfName?: string;
}

export default function ManagePdfFile({ articleId, pdfName }: Props) {

    const {
        getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject,
        acceptedFiles
    } = useDropzone({ accept: 'application/pdf' });

    const { fileStore } = useStore();
    const { getFilesRS } = fileStore;

    const [file, setFile] = useState<File | null>(null);
    const [existinfFilesToSelect, setExistingFilesToSelect] = useState<ReactSelectInt[]>([]);
    const [loading, setLoading] = useState(true);
    const [initialInit, setInitialInit] = useState(true);
    const [selectedOption, setSelectedOption] = useState<ReactSelectInt>({ label: "", value: 0 } as ReactSelectInt);
    const [baseOnSelected, setBaseOnSelcted] = useState(false);

    useEffect(() => {
        console.log(pdfName)
        if (initialInit) {
            setLoading(true);
            getFilesRS("pdf").then((value) => {
                if (value)
                    setExistingFilesToSelect(value);
            }).finally(() => {
                setInitialInit(false);
                setLoading(false)
            })
            if (pdfName) {
                setSelectedOption({ label: pdfName, value: 0 } as ReactSelectInt)
                setBaseOnSelcted(true);
            }
        }
        if (!initialInit) {
            setFile(acceptedFiles[0]);
            setBaseOnSelcted(false);
        }

    }, [acceptedFiles, articleId]);

    function deleteFile() {
        setFile(null);
    }
    function saveFile() {
        var formData = new FormData();
        console.log(file);
        if (!baseOnSelected && file)
            formData.append("file", file!, file!.name);
        if (baseOnSelected)
            formData.append("exsistingFile", selectedOption.label);
        axios({
            method: "post",
            url: `/file/pdf/${articleId}`,
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
                                <p>Drag 'n' drop pdf file here, or click to select file from disk</p>
                            </Container>
                        </div>
                    </Grid.Column>
                    <Grid.Column width="8">
                        <div>
                            <label className="boldFont">Choose from existing file</label>
                            <Select
                                options={existinfFilesToSelect}
                                value={existinfFilesToSelect.filter(option =>
                                    option.value === selectedOption!.value)}
                                onChange={(d) => {
                                    setSelectedOption(d!);
                                    setBaseOnSelcted(true);
                                }}
                                placeholder={"Choose file"}
                            />
                        </div>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row textAlign="center">
                    <Grid.Column textAlign="center" width="7">
                        {file && !baseOnSelected && <List divided relaxed>
                            <List.Item>
                                <List.Content>
                                    <List.Header as='a'>Name: {file.name}</List.Header>
                                    <List.Description as='a'>Size: {file.size}</List.Description>
                                </List.Content>
                                <List.Content floated="right" verticalAlign="middle">
                                    <List.Icon name='delete' size='large' onClick={() => { deleteFile() }} />
                                </List.Content>
                            </List.Item>
                        </List>}
                        {baseOnSelected && <List divided relaxed>
                            <List.Item>
                                <List.Content>
                                    <List.Header as='a'>Name: {selectedOption.label}</List.Header>
                                    <List.Description as='a'>Size: 0</List.Description>
                                </List.Content>
                                <List.Content floated="right" verticalAlign="middle">
                                    <List.Icon name='delete' size='large' onClick={() => { setBaseOnSelcted(false) }} />
                                </List.Content>
                            </List.Item>
                        </List>}
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row textAlign="center">
                    <Grid.Column>
                        <Button positive onClick={() => saveFile()}>Save file</Button>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </>
    )
}