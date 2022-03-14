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
          <Route path="orders" element={<OrderList />} />
          <Route path="orders/:id" element={<OrderDetails />} />
          <Route key={location.key} path="orders/form" element={<OrderForm />} />
          <Route key={location.key} path="orders/form/:id" element={<OrderForm />} />
          <Route path="notFound" element={<NotFound />} />
        </Route>
      </Routes>


    </>
  );
}

export default observer(App);
