import { ReactSelectInt } from "./reactSelect";

export interface StuffListToSelect extends ReactSelectInt{
    articleTypeId: number;
}
export interface StuffListItem {
    id: number;
    name: string;
    ableToDelete?: boolean;
}
export class StuffFormValues{
    id: number=0;
    name: string="";
    articleTypeId: number=0;
    articleTypeName: string="";
    articleTypeReactSelect?: ReactSelectInt | null=null;
}

