import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Button, Grid } from "semantic-ui-react";
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

interface Props{
    file: Blob;
    name: string;
    downloadable: boolean;
}

export default observer(function ViewPdf( {file, name, downloadable} : Props) {

    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    const onDocumentLoadSuccess = (document: any) => {
        setNumPages(document.numPages);
      };
    
      const nextPage = (next: number) => {
        if(next===(-1) && pageNumber > 1){
          setPageNumber(pageNumber+next);
          return;
        } 
        if(pageNumber!==numPages && next!==(-1))
          setPageNumber(pageNumber+next);
    
      };
      const downloadFile = () => {
        const url = window.URL.createObjectURL(new Blob([file]));
        console.log(url);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${name}.pdf`);
        document.body.appendChild(link);
        link.click();
      };

    useEffect(() => {

    }, [file]);


    return (
        <Grid>
        {downloadable && <Grid.Row>
          <Button positive onClick={() => downloadFile()}>
            Download
          </Button>
        </Grid.Row>}
        <Grid.Row>
          <h1>
            Page {pageNumber} from {numPages}
          </h1>
        </Grid.Row>
        <Grid.Row>
          <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
            <Button color="teal" onClick={()=>nextPage(-1)}>Prev</Button>
            <Button color="green" onClick={()=>nextPage(1)}>Next</Button>
            <Page scale={96 / 72} pageNumber={pageNumber}></Page>
          </Document>
        </Grid.Row>
      </Grid>
    )
})