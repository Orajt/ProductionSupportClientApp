export interface QuanityPerGroup {
    groupId: number;
    stuffId: number;
    calculatedCode: string;
    quanityChaanged: boolean;
    quanity: number;
}

export interface StuffGroup {
    stuffName: string;
    stuffId: number;
    groupsQuanities: QuanityPerGroup[];
}
export interface ArticleFabricRealizationDetails{
    articleName: string;
    variantGroup: string;
    groupByStuffList: StuffGroup[]
}
export interface FabricVariantInGroup{
    name: string;
    placeInGroup: number;
    value: number;
}