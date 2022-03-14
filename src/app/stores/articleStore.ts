import { makeAutoObservable, runInAction, toJS} from "mobx";
import { ReactSelectInt } from "../../models/reactSelectInt";
import agent from "../api/agent";

export default class ArticleStore {
    constructor() {
        makeAutoObservable(this);
    }
    loading=false;
    articlesRS = [] as ReactSelectInt[];
    articleTypesRS = [] as ReactSelectInt[];

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
}