import React from 'react';
import ReactDOM from 'react-dom';
import './app/layout/styles.css'
import 'react-datepicker/dist/react-datepicker.css'
import reportWebVitals from './reportWebVitals';
import "semantic-ui-css/semantic.css";
import App from './app/layout/App';
import { store, StoreContext } from './app/stores/store';
import { BrowserRouter } from 'react-router-dom';
import {createBrowserHistory} from 'history';
import ScrollToTop from './app/layout/ScrollToTop';
import 'react-toastify/dist/ReactToastify.css'

export const history = createBrowserHistory();

ReactDOM.render(
  <StoreContext.Provider value={store}>
    <BrowserRouter>
      <ScrollToTop />
        <App />
    </BrowserRouter>
  </StoreContext.Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
