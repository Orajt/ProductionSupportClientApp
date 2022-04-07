import { createContext, useContext } from "react";
import ArticleStore from "./articleStore";
import CommonStore from "./commonStore";
import CompanyStore from "./companyStore";
import DeliveryPlaceStore from "./deliveryPlaceStore";
import FamillyStore from "./famillyStore";
import FileStore from "./fileStore";
import ModalStore from "./modalStore";
import OrderPositionStore from "./OrderPositionStore";
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
    companyStore: CompanyStore;
    orderPositionStore: OrderPositionStore;
    fileStore: FileStore;
}

export const store: Store = {
    modalStore: new ModalStore(),
    commonStore: new CommonStore(),
    userStore: new UserStore(),
    orderStore: new OrderStore(),
    articleStore: new ArticleStore(),
    deliveryPlaceStore: new DeliveryPlaceStore(),
    famillyStore: new FamillyStore(),
    stuffStore: new StuffStore(),
    companyStore: new CompanyStore(),
    orderPositionStore: new OrderPositionStore(),
    fileStore: new FileStore(),
}

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}