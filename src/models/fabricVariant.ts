import { ReactSelectInt } from "./reactSelect";

export class FabricVariantFormValues{
    id: number=0;
    fullName: string="";
    shortName: string="";
}
export interface FabricVariantDetails{
    id: number;
    fullName: string;
    shortName: string;
}
export interface FabricVariantCreateDto{
    fabricVariantId: number;
    placeInGroup: number;
}
export class FabricVariantGroupFormValues{
    fabricVariant: ReactSelectInt | null = null; 
    placeInGroup: number=0;
}
export interface FabricVariantGroupDetailsMember {
    id: number;
    fullName: string;
    shortName: string;
    placeInGroup: number;
}
export interface FabricVariantGroupDetails {
    id: number;
    name: string;
    fabricVariants: FabricVariantGroupDetailsMember[];
}
export interface FabricVariantToSetInOrder extends FabricVariantGroupDetailsMember {
    group?: number;
    hasError: boolean;
    fabricId: number;
    fabricName: string;
}