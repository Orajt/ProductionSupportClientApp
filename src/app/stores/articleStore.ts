import { makeAutoObservable, runInAction, toJS} from "mobx";
import { Article } from "../../models/article";
import { Pagination, PagingParams } from "../../models/pagination";
import { ReactSelectInt } from "../../models/reactSelectInt";
import agent from "../api/agent";
import { Utilities } from "../common/utilities/Utilities";
import { FilterResult } from "../models/filter";

export default class ArticleStore {
    constructor() {
        makeAutoObservable(this);
    }
    loading=true;
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
                console.log(toJS(articlesRS));
            })
        }catch(error){
            console.log(error);
        }
    }
    getArticleTypesRS = async()=>{
        try{
            let articleTypes = await agent.Articles.getArticleTypesRS();
            runInAction(()=>{
                this.articleTypesRS=articleTypes;
            })
        }catch(error){
            console.log(error);
        }
    }
    getArticles = async(filters: FilterResult[])=>{
        try{
            this.loading = true;
            this.articleList=[];
            let queryString=Utilities.createFilterQueryString(filters);
            console.log(queryString);
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