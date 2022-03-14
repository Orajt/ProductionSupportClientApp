import { makeAutoObservable, runInAction} from "mobx";
import { ReactSelectInt } from "../../models/reactSelectInt";
import agent from "../api/agent";

export default class DeliveryPlaceStore {
    constructor() {
        makeAutoObservable(this);
    }
    loading=false;
    deliveryPlacesRS = [] as ReactSelectInt[];

    getDeliveryPlacesRS = async(predicate: string)=>{
        try{
            var deliveryPlacesRS = await agent.DeliveryPlace.getReactSelect(predicate);
            runInAction(()=>{
                this.deliveryPlacesRS=deliveryPlacesRS;
            })
        }catch(error){
            console.log(error);
        }
    }
}