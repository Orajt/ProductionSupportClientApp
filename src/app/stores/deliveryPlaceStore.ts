import { makeAutoObservable, runInAction} from "mobx";
import { DeliveryPlaceDetails, DeliveryPlaceListItem } from "../../models/deliveryPlace";
import { ReactSelectInt } from "../../models/reactSelect";
import agent from "../api/agent";

export default class DeliveryPlaceStore {
    constructor() {
        makeAutoObservable(this);
    }
    deliveryPlacesRS = [] as ReactSelectInt[];
    deliveryPlaceDetails: DeliveryPlaceDetails | null = null;
    deliveryPlaceList: DeliveryPlaceListItem[] | null =null;

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
    getDeliveryPlaceList = async()=>{
        try{
            const deliveryPlaceList = await agent.DeliveryPlace.list();
            runInAction(()=>{
                this.deliveryPlaceList=deliveryPlaceList;
            })
        }catch(error){
            console.log(error);
        }
    }
    getDeliveryPlaceDetails = async(id: string)=>{
        try{
            const deliveryPlaceDetails = await agent.DeliveryPlace.details(id);
            runInAction(()=>{
                this.deliveryPlaceDetails=deliveryPlaceDetails;
            })
            return deliveryPlaceDetails;
        }catch(error){
            console.log(error);
        }
    }
}