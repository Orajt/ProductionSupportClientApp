import { makeAutoObservable, runInAction} from "mobx";
import { Pagination, PagingParams } from "../../models/pagination";
import { ReactSelectInt } from "../../models/reactSelect";
import agent from "../api/agent";
export default class FamillyStore {
    constructor() {
        makeAutoObservable(this);
    }
    loading=true;
    familiesRS = [] as ReactSelectInt[];
    pagination: Pagination | null = null;
    pagingParams=new PagingParams(1,20);

    clear = () => {
        this.loading=true;
        this.familiesRS=[];
        this.pagination=null;
        this.pagingParams=new PagingParams();
    }

    getFamiliesRS = async()=>{
        try{
            let familiesRS = await agent.Families.getReactSelect();
            runInAction(()=>{
                this.familiesRS=familiesRS;
            })
        }catch(error){
            console.log(error);
        }
    }

    setPagingParams = (pagingParams: PagingParams) => {
        this.pagingParams = pagingParams;
    }
    setPagination = (pagination: Pagination) => {
        this.pagination = pagination;
    }
    setLoading(isLoaded: boolean) {
        this.loading = isLoaded;
    }
       
}