import { makeAutoObservable, runInAction, toJS} from "mobx";
import { Article, ArticleDetails } from "../../models/article";
import { Pagination, PagingParams } from "../../models/pagination";
import { ReactSelectInt } from "../../models/reactSelect";
import agent from "../api/agent";
import { Utilities } from "../common/utilities/Utilities";
import { FilterResult } from "../models/filter";

export default class ArticleStore {
    constructor() {
        makeAutoObservable(this);
    }
    loading=true;
    articleDetails: ArticleDetails | null = null;
    articlesRS = [] as ReactSelectInt[];
    articleTypesRS = [] as ReactSelectInt[];
    articleList = [] as Article[];
    pagination: Pagination | null = null;
    pagingParams=new PagingParams(1,20);

    clear = () => {
        this.loading=true;
        this.articleList = [];
        this.articlesRS=[];
        this.articleTypesRS=[];
        this.pagination=null;
        this.pagingParams=new PagingParams();
    }

    getArticlesRS = async(articleTypeId: number, fullList: boolean)=>{
        let predicate=fullList ? "FULLLIST" : "TOASSIGN";
        try{
            let articlesRS = await agent.Articles.getReactSelect(articleTypeId, predicate);
            runInAction(()=>{
                this.articlesRS=articlesRS;
            })
            return articlesRS;
        }catch(error){
            console.log(error);
        }
    }
    getArticleTypesRS = async(noSet: boolean)=>{
        try{
            let articleTypes = await agent.Articles.getArticleTypesRS();
            runInAction(()=>{
                if(noSet)
                    articleTypes=articleTypes.filter(p=>p.value!==5);
                this.articleTypesRS=articleTypes;
            })
        }catch(error){
            console.log(error);
        }
    }
    getArticleTypeDetails = async(id: number)=>{
        try{
            let articleTypeDetails = await agent.Articles.getArticleTypeDetails(id);
            return articleTypeDetails;
           
        }catch(error){
            console.log(error);
        }
    }

    getArticles = async(filters: FilterResult[])=>{
        try{
            this.loading = true;
            this.articleList=[];
            let queryString=Utilities.createFilterQueryString(filters);
            queryString.append('pageNumber', this.pagingParams.pageNumber.toString());
            queryString.append('pageSize', this.pagingParams.pageSize.toString());
            const result = await agent.Articles.getList(queryString);
            runInAction(()=>{
                result.data.forEach(article => {
                    article.createDate=new Date(article.createDate);
                    article.editDate=new Date(article.editDate);
                    this.articleList.push(article);
                })
            })
            
            this.setPagination(result.pagination);
        }catch(error){
            console.log(error);
        }finally{
            this.setLoading(false);
        }
    }
    getArticleDetails = async(id: string)=>{
        try{
            this.loading = true;
            let article = await agent.Articles.details(id);
            runInAction(()=>{
                if(article.nameWithoutFamilly===null)
                    article.nameWithoutFamilly="";
                article.editDate=new Date(article.editDate!);
                article.createDate=new Date(article.createDate!);
                this.articleDetails=article;
            })

        }catch(error){
            console.log(error);
        }finally{
            this.setLoading(false);
            return this.articleDetails;
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