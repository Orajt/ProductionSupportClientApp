import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { history } from '../..';
import { OrderDetails, OrderFormValues, OrderListElem, OrderPositionListItem, OrderSummary} from '../../models/orders';
import { ReactSelectInt} from '../../models/reactSelect';
import { User, UserFormValues } from '../models/user';
import { store } from '../stores/store';
import { PaginatedResult } from '../../models/pagination';
import { Article, ArticleDetails, ArticleTypeDetails } from '../../models/article';
import {  StuffFormValues, StuffListItem, StuffListToSelect } from '../../models/stuff';
import { CompanyDetails, CompanyFormValues, CompanyListItem } from '../../models/company';
import { DeliveryPlaceDetails, DeliveryPlaceFormValues, DeliveryPlaceListItem } from '../../models/deliveryPlace';
import { FabricVariantDetails, FabricVariantGroupDetails } from '../../models/fabricVariant';
import { ArticleFabricRealizationDetails } from '../../models/articleFabricRealization';

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay)
    })
}

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.request.use(config => {
    const token = store.commonStore.token;
    if (token) config.headers!.Authorization = `Bearer ${token}`
    return config;
})

axios.interceptors.response.use(async response => {
    // if (process.env.NODE_ENV === 'development') await sleep(1000);
    const pagination = response.headers['pagination'];
    if (pagination) {
        response.data = new PaginatedResult(response.data, JSON.parse(pagination));
        return response as AxiosResponse<PaginatedResult<any>>
    }
    return response;
}, (error: AxiosError) => {
    const { data, status, config, headers } = error.response!;
    switch (status) {
        case 400:
            if (config.method === 'get' && data.errors.hasOwnProperty('id')) {
                history.push('/not-found');
            }
            if (data.errors) {
                const modalStateErrors = [];
                for (const key in data.errors) {
                    if (data.errors[key]) {
                        modalStateErrors.push(data.errors[key])
                    }
                }
                throw modalStateErrors.flat();
            } else {
                toast.error(data);
            }
            break;
        case 401:
            if (status === 401 && headers['www-authenticate']?.startsWith('Bearer error="invalid_token"')) {
                store.userStore.logout();
                toast.error('Session expired - please login again');
            }
            break;
        case 404:
            history.push('/not-found');
            break;
        case 500:
            store.commonStore.setServerError(data);
            history.push('/server-error');
            break;
    }
    return Promise.reject(error);
})

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T>(url: string, body:{}) => axios.delete<T>(url, body).then(responseBody),
}

const Account = {
    current: () => requests.get<User>('/account'),
    login: (user: UserFormValues) => requests.post<User>('/account/login', user),
    register: (user: UserFormValues) => requests.post<User>('/account/register', user)
}
const Order={
    getList:(params: URLSearchParams)=>axios.get<PaginatedResult<OrderListElem[]>>(`/order`,{params}).then(responseBody),
    details:(id: number)=>requests.get<OrderDetails>(`/order/${id}`),
    create:(order: OrderFormValues) => requests.post<void>(`/order`, order),
    edit:(order: OrderFormValues, id: number)=>requests.put<void>(`/order/${id}`,order),
    checkName:(name: string)=>requests.get<number>(`/order/${name}/CHECK`),
    delete:(id: number)=>requests.del<void>(`order/${id}`,{}),
    orderSummary:(predicate: string)=>requests.get<OrderSummary>(`/order/summary/order/${predicate}`)
    
}
const Articles={
    getReactSelect:(id: number, predicate: string)=>requests.get<ReactSelectInt[]>(`/article/${id}/${predicate}`),
    getArticleTypesRS:()=>requests.get<ReactSelectInt[]>('/articleType'),
    getArticleTypeDetails:(id: number)=>requests.get<ArticleTypeDetails>(`/articleType/${id}`),
    getList:(params: URLSearchParams)=>axios.get<PaginatedResult<Article[]>>(`/article`,{params}).then(responseBody),
    details:(id: string)=>requests.get<ArticleDetails>(`/article/${id}`),
    checkNameOrGetId:(params: URLSearchParams, articleName: string)=>axios.get<number>(`/article/check/name/${articleName}`, {params}).then(responseBody),
    delete: (id: number)=>requests.del<void>(`article/${id}`,{})
}
const OrderPosition={
    deleteOrderPositions: (id: number, positions: number[])=>requests.post<void>(`/orderPosition/${id}`, {positionsToRemove: positions}),
    getList:(params: URLSearchParams)=>axios.get<PaginatedResult<OrderPositionListItem[]>>(`/orderPosition`,{params}).then(responseBody), 
}
const DeliveryPlace={
    getReactSelect: (predicate:string)=>requests.get<ReactSelectInt[]>(`/deliveryPlace/list/reactSelect?predicate=${predicate}`),
    list: () => requests.get<DeliveryPlaceListItem[]>(`/deliveryPlace`),
    details: (id: string)=>requests.get<DeliveryPlaceDetails>(`/deliveryPlace/${id}`),
    create:(deliveryPlace: DeliveryPlaceFormValues) => requests.post<void>(`/deliveryPlace`, deliveryPlace),
    edit:(deliveryPlace: DeliveryPlaceFormValues) => requests.put<void>(`/deliveryPlace/${deliveryPlace.id}`, deliveryPlace)

}
const Families ={
    getReactSelect: () =>requests.get<ReactSelectInt[]>(`/familly/list/reactSelect`) 
}
const Stuffs ={
    getReactSelect: () =>requests.get<StuffListToSelect[]>(`/stuff/list/reactSelect`),
    list: () => requests.get<StuffListItem[]>(`/stuff`),
    details: (id: number)=>requests.get<StuffListItem>(`/stuff/${id}`),
    create:(stuff: StuffFormValues) => requests.post<void>(`/company`, stuff),
    edit:(stuff: StuffFormValues) => requests.put<void>(`/company/${stuff.id}`, stuff), 
    getReactSelectByArticleType: (articleTypeId: number)=>requests.get<ReactSelectInt[]>(`/stuff/list/reactSelect/${articleTypeId}`)
}
const Companies={
    list: () => requests.get<CompanyListItem[]>(`/company`),
    details: (id: string)=>requests.get<CompanyDetails>(`/company/${id}`),
    listReactSelect: (predicate: string)=>requests.get<ReactSelectInt[]>(`/company/reactSelect/${predicate}`),
    create:(company: CompanyFormValues) => requests.post<void>(`/company`, company),
    edit:(company: CompanyFormValues) => requests.put<void>(`/company/${company.id}`, company),
}
const Files ={
    listRS:(type: string)=>requests.get<ReactSelectInt[]>(`/file/list/reactSelect/${type}`),
    getArticlePdf: (id: number)=>requests.get<Blob>(`/file/${id}`)
};
const FabricVariants={
    list: () => requests.get<FabricVariantDetails[]>(`/fabricVariant`),
    listReactSelect: () => requests.get<ReactSelectInt[]>(`/fabricVariant/list/reactSelect`),
    details: (id: string)=>requests.get<FabricVariantDetails>(`/fabricVariant/${id}`),   
    listReactSelectFVG: (id: number) => requests.get<ReactSelectInt[]>(`/fabricVariantGroup/list/${id}`),
    detailsFVG: (id: string)=>requests.get<FabricVariantGroupDetails>(`/fabricVariantGroup/${id}`),
    detailsFVGByArtId: (id: number)=>requests.get<FabricVariantGroupDetails>(`/fabricVariantGroup/details/byArticle/${id}`),
}
const FabricRealizations={
    details: (id: number) => requests.get<ArticleFabricRealizationDetails>(`/articleFabricRealization/${id}`),
}


const agent = {
    Account,
    Order,
    OrderPosition,
    Articles,
    DeliveryPlace,
    Families,
    Stuffs,
    Companies,
    Files,
    FabricVariants,
    FabricRealizations
}

export default agent;