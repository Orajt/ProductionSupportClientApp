import { makeAutoObservable, runInAction} from "mobx";
import agent from "../api/agent";

export default class FileStore {
    constructor() {
        makeAutoObservable(this);
    }

    getFilesRS = async(type:string)=>{
        try{
            let filesRS = await agent.Files.listRS(type);
            return filesRS;
        }catch(error){
            console.log(error);
        }
    }
       
}