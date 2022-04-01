import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Route, Routes, useLocation} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useStore } from '../stores/store';
import LoadingComponent from './LoadingComponent';
import ModalContainer from '../common/modals/ModalContainer';
import HomePage from '../../features/home/HomePage';
import AfterSuccessLogin from './AfterSuccessLogin';
import NotFound from '../../features/errors/NotFound';
import OrderList from '../../features/orders/OrderList/OrderList';
import OrderDetails from '../../features/orders/OrderList/OrderDetails';
import OrderForm from '../../features/orders/form/OrderForm';
import OrderSummary from '../../features/orders/orderSummary/OrderSummary';
import ArticleList from '../../features/articles/ArticleList';
import ArticleDetails from '../../features/articles/ArticleDetails';
import ArticleForm from '../../features/articles/form/ArticleForm';
import CompanyForm from '../../features/companies/form/CompanyForm';
import CompaniesList from '../../features/companies/CompaniesList';
import CompanyDetials from '../../features/companies/CompanyDetials';
import DeliveryPlacesList from '../../features/deliveryPlaces/DeliveryPlacesList';
import DeliveryPlaceForm from '../../features/deliveryPlaces/form/DeliveryPlaceForm';
import StuffList from '../../features/stuffs/StuffList';
import StuffForm from '../../features/stuffs/Form/StuffForm';
import ArticleTypeList from '../../features/articles/ArticleTypeList';
import AssignStuffToArticleType from '../../features/articles/articleTypeForm/AssignStuffToArticleType';
import FamiliesList from '../../features/famillies/FamiliesList';
import FamillyForm from '../../features/famillies/form/FamillyForm';

function App() {
  const location=useLocation();
  const { commonStore, userStore } = useStore();

  useEffect(() => {
    if (commonStore.token) {
      userStore.getUser().finally(() => commonStore.setAppLoaded());
    }
    commonStore.setAppLoaded();
  }, [commonStore, userStore])

  if (!commonStore.appLoaded) return <LoadingComponent content='Loading app...' />

  return (
    <>
      <ToastContainer position='bottom-right' hideProgressBar />
      <ModalContainer />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path="/*" element={<AfterSuccessLogin />}>
          <Route path="home" element={<AfterSuccessLogin />} />
          {/* Orders */}
          <Route path="orders" element={<OrderList />} />
          <Route path="orders/:id" element={<OrderDetails />} />
          <Route key={location.key} path="orders/form" element={<OrderForm />} />
          <Route key={location.key} path="orders/form/:id" element={<OrderForm />} />
          <Route path="orders/summary/:predicate" element={<OrderSummary />} />
          {/* Articles */}
          <Route path="articles" element={<ArticleList />} />
          <Route path="articles/:id" element={<ArticleDetails />} />
          <Route path="articles/form" element={<ArticleForm />} />
          <Route path="articles/form/:id" element={<ArticleForm />} />
          {/* Companies */}
          <Route path="companies" element={<CompaniesList />} />
          <Route path="companies/:id" element={<CompanyDetials />} />
          <Route path="companies/form" element={<CompanyForm />} />
          <Route path="companies/form/:id" element={<CompanyForm />} />

          {/* Delivery Places */}
          <Route path="deliveryPlaces" element={<DeliveryPlacesList />} />
          <Route path="deliveryPlaces/form" element={<DeliveryPlaceForm />} />
          <Route path="deliveryPlaces/form/:id" element={<DeliveryPlaceForm />} />

           {/* Stuffs*/}
          <Route path="stuffs" element={<StuffList />} />
          <Route key={1} path="stuffs/form" element={<StuffForm />} />
          <Route key={2} path="stuffs/form/:id" element={<StuffForm />} />

          {/* Article types*/}
          <Route path="articleTypes" element={<ArticleTypeList />} />
          <Route path="articleTypes/assign/:id" element={<AssignStuffToArticleType />} />

           {/* Stuffs*/}
           <Route path="Famillies" element={<FamiliesList />} />
          <Route key={1} path="famillies/form" element={<FamillyForm />} />
          <Route key={2} path="famillies/form/:id" element={<FamillyForm />} />

          <Route path="notFound" element={<NotFound />} />
        </Route>
      </Routes>
 
    </>
  );
}
export default observer(App);
