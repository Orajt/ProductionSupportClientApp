import { makeAutoObservable} from "mobx";
import { OrderPositionListItem } from "../../models/orders";
import { PagingParams, Pagination } from "../../models/pagination";
import agent from "../api/agent";
import { Utilities } from "../common/utilities/Utilities";
import { FilterResult } from "../models/filter";

export default class OrderPositionStore {
    constructor() {
        makeAutoObservable(this);
    }
    orderPositionList = [] as OrderPositionListItem[];
    loading = true;
    pagination: Pagination | null = null;
    pagingParams=new PagingParams(1,30);

    clear = () => {
        this.loading=true;
        this.orderPositionList = [];
        this.pagination=null;
        this.pagingParams=new PagingParams();
    }

    getOrderPositionList = async (filters: FilterResult[]) => {
        try {
            this.loading = true;
            this.clear();
            let queryString=Utilities.createFilterQueryString(filters);
            console.log(queryString);
            queryString.append('pageNumber', this.pagingParams.pageNumber.toString());
            queryString.append('pageSize', this.pagingParams.pageSize.toString());
            const result = await agent.OrderPosition.getList(queryString);
            result.data.forEach(orderListItem => {
                this.setOrderPosition(orderListItem);
            })
            this.setPagination(result.pagination);
        }catch (error) {
            console.log(error);
        }
    }
    setPagingParams = (pagingParams: PagingParams) => {
        this.pagingParams = pagingParams;
    }
    setPagination = (pagination: Pagination) => {
        this.pagination = pagination;
    }
    private setOrderPosition = (item: OrderPositionListItem) => {

        item.shipmentDate = new Date(item.shipmentDate);
        item.productionDate = new Date(item.productionDate);
        this.orderPositionList.push(item);
    }

}

