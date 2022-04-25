import { makeAutoObservable, runInAction} from "mobx";
import { CompanyDetails, CompanyListItem } from "../../models/company";
import { Pagination, PagingParams } from "../../models/pagination";
import { ReactSelectInt } from "../../models/reactSelect";
import agent from "../api/agent";

export default class CompanyStore {
    constructor() {
        makeAutoObservable(this);
    }
    companyListRS: ReactSelectInt[] =[];
    companyDetails: CompanyDetails | null = null;
    companyList: CompanyListItem[] | null =null;
    pagination: Pagination | null = null;
    pagingParams=new PagingParams(1,20);

    clear = () => {
        this.companyListRS=[];
        this.pagination=null;
        this.companyList=[];
        this.companyDetails=null;
        this.pagingParams=new PagingParams();
    }

    getCompanyList = async()=>{
        try{
            const companyList = await agent.Companies.list();
            runInAction(()=>{
                this.companyList=companyList;
            })
        }catch(error){
            console.log(error);
        }
    }
    getCompanyDetails = async(id: string)=>{
        try{
            const companyDetails = await agent.Companies.details(id);
            console.log(companyDetails);
            runInAction(()=>{
                this.companyDetails=companyDetails;
            })
            return companyDetails;
        }catch(error){
            console.log(error);
        }
    }
    

    getCompanyListRS = async(predicate: string)=>{
        try{
            const listRS = await agent.Companies.listReactSelect(predicate);
            console.log(listRS);
            runInAction(()=>{
                this.companyListRS=listRS;
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
       
}