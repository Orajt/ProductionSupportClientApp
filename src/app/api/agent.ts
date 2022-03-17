import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { history } from '../..';
import { OrderDetails, OrderFormValues, OrderListElem, OrderSummary} from '../../models/orders';
import { ReactSelectInt } from '../../models/reactSelectInt';
import { User, UserFormValues } from '../models/user';
import { store } from '../stores/store';
import { PaginatedResult } from '../../models/pagination';
import { Article } from '../../models/article';

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
    getList:(params: URLSearchParams)=>axios.get<PaginatedResult<Article[]>>(`/article`,{params}).then(responseBody),

}
const OrderPosition={
    deleteOrderPositions: (id: number, positions: number[])=>requests.post<void>(`/orderPosition/${id}`, {positionsToRemove: positions}) 
}
const DeliveryPlace={
    getReactSelect: (predicate:string)=>requests.get<ReactSelectInt[]>(`/deliveryPlace/reactSelect?predicate=${predicate}`) 
}


const agent = {
    Account,
    Order,
    OrderPosition,
    Articles,
    DeliveryPlace
}

export default agent;