import { makeAutoObservable, runInAction } from "mobx";
import { OrderDetails, OrderFormValues, OrderListElem, OrderSummary } from "../../models/orders";
import { PagingParams, Pagination } from "../../models/pagination";
import agent from "../api/agent";
import { Utilities } from "../common/utilities/Utilities";
import { FilterResult } from "../models/filter";

export default class OrderStore {
    constructor() {
        makeAutoObservable(this);
    }
    orderList = [] as OrderListElem[];
    loading = true;
    orderDetails: OrderDetails | null = null;
    orderPositionsToRemove = [] as number[];
    ableToDeletePositions: boolean = false;
    pagination: Pagination | null = null;
    pagingParams=new PagingParams();
    orderSummary: OrderSummary | null = null;

    clear = () => {
        this.loading=true;
        this.orderList = [];
        this.orderDetails=null;
        this.orderPositionsToRemove=[];
        this.pagination=null;
        this.pagingParams=new PagingParams();
    }

    getOrderList = async (filters: FilterResult[]) => {
        try {
            this.loading = true;
            this.clear();
            let queryString=Utilities.createFilterQueryString(filters);
            console.log(queryString);
            queryString.append('pageNumber', this.pagingParams.pageNumber.toString());
            queryString.append('pageSize', this.pagingParams.pageSize.toString());
            const result = await agent.Order.getList(queryString);
            result.data.forEach(orderListElem => {
                this.setOrder(orderListElem);
            })
            console.log(this.orderList);
            this.setPagination(result.pagination);
            this.setLoading(false);
        }catch (error) {
            console.log(error);
            this.setLoading(false);
        }
    }
    getOrderDetails = async (id: number) => {
        try {
            this.loading = true;
            const order = await agent.Order.details(id);
            runInAction(() => {
                order.editDate = new Date(order.editDate);
                order.shipmentDate = new Date(order.shipmentDate);
                order.productionDate = new Date(order.productionDate);
                this.orderDetails =  order
            })
            
            this.setLoading(false);
            return order;
        } catch (error) {
            console.log(error);
            this.setLoading(false);
            return null;
        }
    }
    getOrderSummary = async (predicate: string) =>{
        this.setLoading(true);
        try{
            const orderSummary = await agent.Order.orderSummary(predicate);
            runInAction(()=>{
                console.log("To ja order summary")
                orderSummary.productionDate=new Date(orderSummary.productionDate);
                orderSummary.shipmentDate=new Date(orderSummary.shipmentDate);
                orderSummary.editDate=new Date(orderSummary.editDate);
                console.log(orderSummary);
                this.orderSummary=orderSummary;
                
            })
        }catch(error){
            console.log(error);
        }finally{
            console.log(this.orderSummary);
            this.setLoading(false);
        }
    }

    handlePositionToRemove = (id: number, add: boolean) => {
        if (add) {
            this.orderPositionsToRemove.push(id);
            this.setAbleToDelete(true);
            return;
        }
        this.orderPositionsToRemove = this.orderPositionsToRemove.filter(x => x !== id);
        if (!this.orderPositionsToRemove.some(x => x))
            this.setAbleToDelete(false);
        console.log(this.ableToDeletePositions);
    }
    deleteOrderPosition = async () => {
        try {
            this.setLoading(true);
            if (this.orderDetails !== null && this.orderPositionsToRemove.length > 0)
                await agent.OrderPosition.deleteOrderPositions(this.orderDetails.id, this.orderPositionsToRemove);
            runInAction(() => {
                if (this.orderDetails)
                    this.orderDetails.orderPositions = this.orderDetails?.orderPositions.filter(p => !this.orderPositionsToRemove.includes(p.id));
                this.orderPositionsToRemove = [];
                this.setAbleToDelete(false);
                this.setLoading(false);
            })
        } catch (error) {
            console.log(error);
            this.setLoading(false);
        }
    }
    createOrder = async (order: OrderFormValues)=>{
        try {
            this.setLoading(true);
            await agent.Order.create(order);
        }catch (error) {
            console.log(error);
        }finally{
            this.setLoading(false);

        };
    }
    editOrder = async (order: OrderFormValues)=>{
        try {
            this.setLoading(true);
            await agent.Order.edit(order, order.id);
        }catch (error) {
            console.log(error);
        }finally{this.setLoading(false)};
    }

    setLoading(isLoaded: boolean) {
        this.loading = isLoaded;
    }
    setPagingParams = (pagingParams: PagingParams) => {
        this.pagingParams = pagingParams;
    }
    setPagination = (pagination: Pagination) => {
        this.pagination = pagination;
    }
    private setAbleToDelete(isAble: boolean) {
        this.ableToDeletePositions = isAble;
    }
    private setOrder = (item: OrderListElem) => {

        item.editDate = new Date(item.editDate);
        item.shipmentDate = new Date(item.shipmentDate);
        item.productionDate = new Date(item.productionDate);
        this.orderList.push(item);
    }

}

