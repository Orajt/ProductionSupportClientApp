import { makeAutoObservable, runInAction} from "mobx";
import { StuffListItem, StuffListToSelect } from "../../models/stuff";
import agent from "../api/agent";
export default class StuffStore {
    constructor() {
        makeAutoObservable(this);
    }
    stuffRS: StuffListToSelect[] | null=null;
    stuffDetails: StuffListItem | null = null;
    stuffList: StuffListItem[] | null =null;

    clear = () => {
        this.stuffRS=[];
        this.stuffDetails=null;
        this.stuffList=[];
    }

    getStuffsListToSelect = async()=>{
        console.log("nakurwiam getStuffa z api")
        try{
            const stuffRS = await agent.Stuffs.getReactSelect();
            runInAction(()=>{
                this.stuffRS=stuffRS;
            })
            return stuffRS;
        }catch(error){
            console.log(error);
        }
    }
    getStuffDetails = async(id: number)=>{
        try{
            const stuffDetails = await agent.Stuffs.details(id);
            runInAction(()=>{
                this.stuffDetails=stuffDetails;
            })
            return stuffDetails;
        }catch(error){
            console.log(error);
        }
    }
    getStuffList = async()=>{
        try{
            const stuffList = await agent.Stuffs.list();
            runInAction(()=>{
                this.stuffList=stuffList;
            })
        }catch(error){
            console.log(error);
        }
    }


       
}