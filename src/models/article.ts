import { ReactSelectInt } from "./reactSelect";

export interface Article{
    id: number;
    fullName:string;
    articleTypeId:number;
    articleTypeName: string;
    famillyName: string;
    stuffName: string;
    createDate: Date;
    editDate: Date;
}

export interface ArticleDetailsChildArticles {
    childId: number;
    childArticleName: string;
    childArticleType: string;
    childArticleHasChild: boolean;
    quanity: number;
}
export interface DetailFileDto {
    id: number;
    fileName: string;
}

export interface ArticleDetails {
    id: number;
    fullName: string;
    nameWithoutFamilly: string;
    articleTypeReactSelect: ReactSelectInt | null;
    articleTypeId: number;
    articleTypeName: string;
    famillyReactSelect: ReactSelectInt | null;
    famillyId: number | null;
    famillyName: string;
    editDate: Date | null;
    createDate: Date | null;
    stuffId: number | null;
    stuffReactSelect: ReactSelectInt | null;
    stuffName: string;
    fabricVariantGroupReactSelect: ReactSelectInt | null;
    fabricVariantGroupId: number | null;
    fabricVariantGroupName: string;
    price: number;
    length: number;
    width: number;
    high: number;
    area: number;
    capacity: number;
    createdInCompany: boolean;
    ableToEditPrimaries: boolean;
    childArticles: ArticleDetailsChildArticles[];
    pdfFile: DetailFileDto;
    images: DetailFileDto[];

}
export class ArticleFormValues{
    id: number=0;
    fullName: string="";
    nameWithoutFamilly: string="";
    articleTypeReactSelect: ReactSelectInt | null=null;
    articleTypeId: number=0;
    articleTypeName: string="";
    famillyReactSelect?: ReactSelectInt | null=null;
    famillyId: number | null=null;
    famillyName: string="";
    editDate: Date | null=null;
    createDate: Date | null=null;
    stuffId: number | null=0;
    stuffReactSelect?: ReactSelectInt | null=null;
    stuffName: string="";
    fabricVariantGroupReactSelect?: ReactSelectInt | null=null;
    fabricVariantGroupId: number | null=null;
    fabricVariantGroupName: string ="";
    length: number=0;
    width: number=0;
    high: number=0;
    createdInCompany: boolean=false;
    ableToEditPrimaries: boolean=false;
    childArticles: ArticleDetailsChildArticles[]=[];
    pdfFile?: DetailFileDto;
    images?: DetailFileDto[];
}
export class ArticlePositionFormValues{
    childId: number=0;
    childArticleName: string="";
    childArticleType: string="";
    childArticleHasChild: boolean=false;
    articleRS?: ReactSelectInt | null = null;
    quanity: number=0;
}

export interface ArticleTypeDetails {
    id: number;
    name: string;
    stuffs: ReactSelectInt[];
}
export class AssignArticleFormValues{
    id: number=0;
    name: string="";
    stuffs: ReactSelectInt[]=[];
}
