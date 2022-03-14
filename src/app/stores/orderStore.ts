import { makeAutoObservable, runInAction, toJS } from "mobx";
import { OrderDetails, OrderFormValues, OrderListElem } from "../../models/orders";
import agent from "../api/agent";

export default class OrderStore {
    constructor() {
        makeAutoObservable(this);
    }
    orderList = [] as OrderListElem[];
    loading = false;
    orderDetails: OrderDetails | null = null;
    orderPositionsToRemove = [] as number[];
    ableToDeletePositions: boolean = false;

    clear = () => {
        this.orderList = [];
        this.orderDetails=null;
        this.orderPositionsToRemove=[];
    }

    getOrderList = async () => {
        try {
            this.loading = true;
            const orderList = await agent.Order.getList();
            orderList.forEach(orderListElem => {
                this.setOrder(orderListElem);
                console.log(orderList);
                this.setLoading(false);
            })
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

