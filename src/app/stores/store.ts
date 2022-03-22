import { createContext, useContext } from "react";
import ArticleStore from "./articleStore";
import CommonStore from "./commonStore";
import DeliveryPlaceStore from "./deliveryPlaceStore";
import FamillyStore from "./famillyStore";
import ModalStore from "./modalStore";
import OrderStore from "./orderStore";
import StuffStore from "./stuffStore";
import UserStore from "./userStore";

interface Store {
    commonStore: CommonStore;
    modalStore: ModalStore;
    userStore: UserStore;
    orderStore: OrderStore;
    articleStore: ArticleStore;
    deliveryPlaceStore: DeliveryPlaceStore;
    famillyStore: FamillyStore;
    stuffStore: StuffStore;
}

export const store: Store = {
    modalStore: new ModalStore(),
    commonStore: new CommonStore(),
    userStore: new UserStore(),
    orderStore: new OrderStore(),
    articleStore: new ArticleStore(),
    deliveryPlaceStore: new DeliveryPlaceStore(),
    famillyStore: new FamillyStore(),
    stuffStore: new StuffStore()
}

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}