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
import ArticlePdf from '../../features/ArticlePdf';
import OrderCalculationPdf from '../../features/orders/calculation/OrderCalculationPdf';
import FabricVariantList from '../../features/fabricVariant/FabricVariantList';
import FabricVariantForm from '../../features/fabricVariant/FabricVariantForm';
import FabricVariantGroupForm from '../../features/fabricVarianGroup/form/FabricVariantGroupForm';
import ImageHighResolution from '../../features/articles/ImageHighResolution';
import FabricVariantGroupList from '../../features/fabricVarianGroup/FabricVariantGroupList';
import FabricForm from '../../features/articles/FabricForm';

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
          <Route path="orders/calculations/:orderId/:articleTypeId" element={<OrderCalculationPdf />} />
          {/* Articles */}
          <Route path="articles" element={<ArticleList />} />
          <Route path="articles/:id" element={<ArticleDetails />} />
          <Route path="articles/form" element={<ArticleForm />} />
          <Route path="articles/form/:id" element={<ArticleForm />} />
          <Route path="fabrics/form" element={<FabricForm />} />
          <Route path="fabrics/form/:id" element={<FabricForm />} />
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

          {/* Files*/}
          <Route path="files/pdf/:id" element={<ArticlePdf />} />

           {/* Images */}
           <Route path="images/:id" element={<ImageHighResolution />} />

           {/* Fabric Variants*/}
          <Route path="fabricVariants" element={<FabricVariantList />} />
          <Route key={1} path="fabricVariants/form" element={<FabricVariantForm />} />
          <Route key={2} path="fabricVariants/form/:id" element={<FabricVariantForm />} />

          {/* Fabric Variant Groups*/}
          <Route path="fabricVariantGroups" element={<FabricVariantGroupList />} />
          <Route key={1} path="fabricVariantGroups/form" element={<FabricVariantGroupForm />} />

          <Route path="not-found" element={<NotFound />} />
        </Route>
      </Routes>
 
    </>
  );
}
export default observer(App);
