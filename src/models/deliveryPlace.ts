import { ReactSelectInt } from "./reactSelect";

export interface DeliveryPlaceListItem {
    id: number;
    name: string;
    companyName: string;
    nameWithCompany?: string;
    fullAdress: string;
}
export interface DeliveryPlaceDetails {
    id: number;
    name: string;
    country: string;
    city: string;
    street: string;
    postalCode: string;
    numberOfBuilding: number;
    apartment: number;
    companyID: number;
    companyName: string;
    companyReactSelect?: ReactSelectInt | null;
}
export class DeliveryPlaceFormValues {
    id: number = 0;
    name: string = "";
    country: string = "";
    city: string = "";
    street: string = "";
    postalCode: string = "";
    numberOfBuilding: number = 0;
    apartment: number = 0;
    companyReactSelect: ReactSelectInt | null = null;
    companyID: number = 0;
    companyName: string="";
}
