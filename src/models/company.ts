import { DeliveryPlaceListItem } from "./deliveryPlace";

export class CompanyFormValues{
    id: number=0;
    name: string="";
    companyIdentifier: string="";
    supplier: boolean=false;
    merchant: boolean=false;
}
export interface CompanyListItem {
    id: number;
    name: string;
    companyIdentifier: string;
    supplier: boolean;
    merchant: boolean;
}

export interface CompanyDetails {
    id: number;
    name: string;
    companyIdentifier: string;
    supplier: boolean;
    merchant: boolean;
    deliveryPlaces: DeliveryPlaceListItem[];
}

