import { ReactSelectInt } from "./reactSelect";

export interface Article{
    id: number;
    fullName:string;
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
}
export class ArticleFormValues{
    id: number=0;
    fullName: string="";
    nameWithoutFamilly: string="";
    articleTypeReactSelect: ReactSelectInt | null=null;
    articleTypeId: number=0;
    articleTypeName: string="";
    famillyReactSelect: ReactSelectInt | null=null;
    famillyId: number | null=null;
    famillyName: string="";
    editDate: Date | null=null;
    createDate: Date | null=null;
    stuffId: number | null=0;
    stuffReactSelect: ReactSelectInt | null=null;
    stuffName: string="";
    fabricVariantGroupId: number | null=null;
    fabricVariantGroupName: string ="";
    length: number=0;
    width: number=0;
    high: number=0;
    createdInCompany: boolean=false;
    ableToEditPrimaries: boolean=false;
    childArticles: ArticleDetailsChildArticles[]=[];
}
export class ArticlePositionFormValues{
    childId: number=0;
    childArticleName: string="";
    childArticleType: string="";
    childArticleHasChild: boolean=false;
    articleRS?: ReactSelectInt | null = null;
    quanity: number=0;
}
