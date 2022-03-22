import { makeAutoObservable, runInAction} from "mobx";
import { Pagination, PagingParams } from "../../models/pagination";
import { ReactSelectInt } from "../../models/reactSelect";
import { StuffListToSelect } from "../../models/stuff";
import agent from "../api/agent";
export default class StuffStore {
    constructor() {
        makeAutoObservable(this);
    }
    loading=true;
    stuffRS: StuffListToSelect[] | null=null;
    pagination: Pagination | null = null;
    pagingParams=new PagingParams(1,20);

    clear = () => {
        this.loading=true;
        this.stuffRS=[];
        this.pagination=null;
        this.pagingParams=new PagingParams();
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