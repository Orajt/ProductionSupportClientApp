import { makeAutoObservable, runInAction} from "mobx";
import { FabricVariantDetails } from "../../models/fabricVariant";
import { ReactSelectInt } from "../../models/reactSelect";
import agent from "../api/agent";

export default class FabricVariantStore {
    constructor() {
        makeAutoObservable(this);
    }
    fabricVariantListRS: ReactSelectInt[] | null=null;
    fabricVariantGroupListRS: ReactSelectInt[] | null=null;
    fabricVariantList: FabricVariantDetails[] | null = null;

    getFabricVariantList = async()=>{
        try{
            let fvList = await agent.FabricVariants.list();
            runInAction(()=>{
                this.fabricVariantList=fvList;
            })
            
        }catch(error){
            console.log(error);
        }
    }
    getListReactSelect = async()=>{
        try{
            let fvRS = await agent.FabricVariants.listReactSelect();
            runInAction(()=>{
                this.fabricVariantListRS=fvRS;
            })
            return fvRS;
        }catch(error){
            console.log(error);
        }
    }
    getFabricVariantDetails = async(id:string)=>{
        try{
            let fvDetails = await agent.FabricVariants.details(id);
            return fvDetails;
        }catch(error){
            console.log(error);
        }
    }
    getFabricVariantGroupDetails = async(id:string)=>{
        try{
            let fvgDetails = await agent.FabricVariants.detailsFVG(id);
            return fvgDetails;
        }catch(error){
            console.log(error);
        }
    }
    getListReactSelectFVG = async(id: number)=>{
        try{
            let fvgRS = await agent.FabricVariants.listReactSelectFVG(id);
            runInAction(()=>{
                this.fabricVariantGroupListRS=fvgRS;
            })

            return fvgRS;
        }catch(error){
            console.log(error);
    }
    }
    getFabricVariantGroupByArticleId = async(id:number)=>{
        try{
            let fvgDetails = await agent.FabricVariants.detailsFVGByArtId(id);
            console.log("gowno");
            console.log(fvgDetails);
            console.log("gowno");
            return fvgDetails;
        }catch(error){
            console.log(error);
        }
    }

       
}