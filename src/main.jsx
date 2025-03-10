import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { Provider } from 'react-redux';
import store from './app/store.js';
import router from './router/index.jsx';
import 'react-perfect-scrollbar/dist/css/styles.css';
import Loader from './components/Loader.jsx';

// i18n (needs to be bundled)
import './i18n';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
        <Suspense>
         
            <Provider store={store}>
            <Loader></Loader>
                <RouterProvider router={router} />
            </Provider>
        </Suspense>
    </React.StrictMode>
);
