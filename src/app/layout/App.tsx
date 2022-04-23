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
import ManageArtacleFabricRealization from '../../features/articles/manageFabricRealization/ManageArtacleFabricRealization';
import Unauthorized from '../../features/errors/Unauthrized';
import PrivateRoute from './PrivateRoute';

function App() {
  const location=useLocation();
  const { commonStore, userStore } = useStore();
  const { isLoggedIn}=userStore;

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
          <Route path="orders" element={<PrivateRoute component={<OrderList />}/>}/>
          <Route path="orders/:id" element={<PrivateRoute component={<OrderDetails />}/>} />
          <Route key={location.key} path="orders/form" element={<PrivateRoute component={<OrderForm />}/>} />
          <Route key={location.key} path="orders/form/:id" element={<PrivateRoute component={<OrderForm />}/>} />
          <Route path="orders/summary/:predicate" element={<PrivateRoute component={<OrderSummary />}/>}/>
          <Route path="orders/calculations/:orderId/:articleTypeId" element={<PrivateRoute component={<OrderCalculationPdf />}/>} />
          
          {/* Articles */}
          <Route path="articles" element={<PrivateRoute component={<ArticleList />}/>} />
          <Route path="articles/:id" element={<PrivateRoute component={<ArticleDetails />}/>} />
          <Route path="articles/form" element={<PrivateRoute component={<ArticleForm />}/>} />
          <Route path="articles/form/:id" element={<PrivateRoute component={<ArticleForm />}/>} />
          <Route path="fabrics/form" element={<PrivateRoute component={<FabricForm />}/>} />
          <Route path="fabrics/form/:id" element={<PrivateRoute component={<FabricForm />}/>} />
          
          {/* Companies */}
          <Route path="companies" element={<PrivateRoute component={<CompaniesList />}/>} />
          <Route path="companies/:id" element={<PrivateRoute component={<CompanyDetials />}/>} />
          <Route path="companies/form" element={<PrivateRoute component={<CompanyForm />}/>} />
          <Route path="companies/form/:id" element={<PrivateRoute component={<CompanyForm />}/>} />
          
          {/* Delivery Places */}
          <Route path="deliveryPlaces" element={<PrivateRoute component={<DeliveryPlacesList />}/>} />
          <Route path="deliveryPlaces/form" element={<PrivateRoute component={<DeliveryPlaceForm />}/>} />
          <Route path="deliveryPlaces/form/:id" element={<PrivateRoute component={<DeliveryPlaceForm />}/>} />

          
           {/* Stuffs*/}
          <Route path="stuffs" element={<PrivateRoute component={<StuffList></StuffList>}/>} />
          <Route key={1} path="stuffs/form" element={<PrivateRoute component={<StuffForm />}/>} />
          <Route key={2} path="stuffs/form/:id" element={<PrivateRoute component={<StuffForm />}/>} />
          
          {/* Article types*/}
          <Route path="articleTypes" element={<PrivateRoute component={<ArticleTypeList />}/>} />
          <Route path="articleTypes/assign/:id" element={<PrivateRoute component={<AssignStuffToArticleType />}/>} />
          
          {/* Families*/}
          <Route path="Famillies" element={<PrivateRoute component={<FamiliesList />}/>} />
          <Route key={1} path="famillies/form" element={<PrivateRoute component={<FamillyForm />}/>} />
          <Route key={2} path="famillies/form/:id" element={<PrivateRoute component={<FamillyForm />}/>} />

          {/* Files*/}
          <Route path="files/pdf/:id" element={<PrivateRoute component={<ArticlePdf />}/>} />

           {/* Images */}
           <Route path="images/:id" element={<PrivateRoute component={<ImageHighResolution />}/>} />

           {/* Fabric Variants*/}
          <Route path="fabricVariants" element={<PrivateRoute component={<FabricVariantList />}/>} />
          <Route key={1} path="fabricVariants/form" element={<PrivateRoute component={<FabricVariantForm />}/>} />
          <Route key={2} path="fabricVariants/form/:id" element={<PrivateRoute component={<FabricVariantForm />}/>} />
          
          {/* Fabric Variant Groups*/}
          <Route path="fabricVariantGroups" element={<PrivateRoute component={<FabricVariantGroupList />}/>} />
          <Route key={1} path="fabricVariantGroups/form" element={<PrivateRoute component={<FabricVariantGroupForm />}/>} />
          
          {/*Article Fabric realization */}
          <Route path="articles/realizations/:id" element={<PrivateRoute component={<ManageArtacleFabricRealization />}/>} />
          
          <Route path="unauthorized" element={<Unauthorized />} />
          <Route path="not-found" element={<NotFound />} />
        </Route>
      </Routes>
 
    </>
  );
}
export default observer(App);
