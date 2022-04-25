import { FabricVariantToSetInOrder } from "./fabricVariant";
import { ReactSelectInt } from "./reactSelect";

export interface OrderListElem {
    id: number;
    name: string;
    editDate: Date;
    shipmentDate: Date;
    productionDate: Date;
    done: Boolean;
    deliveryPlace: ReactSelectInt;
    deliveryPlaceId: number;
    deliveryPlaceName: string;
    fabricsCalculated: Boolean;
    
}
export interface OrderPosition{
    id:number;
    lp:number;
    articleName:string;
    articleId:number;
    articleRS?: ReactSelectInt;
    quanity:number;
    realization:string;
    client:string;
    setId:number;
}
export interface OrderDetails extends OrderListElem
{
    orderPositions: OrderPosition[];
}
export class OrderFormValues{
    id: number=0;
    name: string="";
    shipmentDate: Date | null =null;
    productionDate: Date | null=null;
    deliveryPlaceId: number =0;
    articleType? : ReactSelectInt | null;
    deliveryPlace : ReactSelectInt | null=null;
    orderPositions: OrderPositionFormValues[]=[];
}
export class OrderPositionFormValues{
    id:number=0;
    lp:number=0;
    articleName:string="";
    articleId:number=0;
    articleRS?: ReactSelectInt | null;
    quanity:number=0;
    realization:string="";
    client:string="";
    setId:number=0;
    index?:number;
    fabricRealization?: FabricVariantToSetInOrder[]=[];
}
export interface OrderSummaryPosition{
    setName: string;
    setId: number;
    positions: OrderPosition[];
}
export interface OrderSummaryClient{
    client: string;
    positions: OrderSummaryPosition[];
}
export interface OrderSummary{
    id: number;
    name: string;
    editDate: Date;
    shipmentDate: Date;
    productionDate: Date;
    deliveryPlaceName: string;
    positions: OrderSummaryClient[];
}
export interface OrderPositionListItem {
    id: number;
    orderId: number;
    articleId: number;
    orderName: string;
    setId: number;
    realization: string;
    client: string;
    quanity: number;
    articleFullName: string;
    shipmentDate: Date;
    productionDate: Date;
    articleTypeName: string;
    famillyName: string;
    stuffName: string;
}
