import { createContext, useContext } from "react";
import ArticleStore from "./articleStore";
import CommonStore from "./commonStore";
import DeliveryPlaceStore from "./deliveryPlaceStore";
import ModalStore from "./modalStore";
import OrderStore from "./orderStore";
import UserStore from "./userStore";

interface Store {
    commonStore: CommonStore;
    modalStore: ModalStore;
    userStore: UserStore;
    orderStore: OrderStore;
    articleStore: ArticleStore;
    deliveryPlaceStore: DeliveryPlaceStore;
}

export const store: Store = {
    modalStore: new ModalStore(),
    commonStore: new CommonStore(),
    userStore: new UserStore(),
    orderStore: new OrderStore(),
    articleStore: new ArticleStore(),
    deliveryPlaceStore: new DeliveryPlaceStore()
}

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}