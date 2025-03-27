import { lazy } from 'react';
import LoginCover from '../pages/authentication/LoginCover';

const Index = lazy(() => import('../pages/index'));
const UserRoleList = lazy(() => import('../pages/userRoles/UserRoleList'));
const UserRoleMappingList = lazy(() => import('../pages/userRoleMapping/UserRoleMappingList'));
const MenuRoleMappingList = lazy(() => import('../pages/MenuRoleMapping/MenuRoleMappingList'));
const ClientHistory = lazy(() => import('../pages/clienthistory/ClientHistory')); // Import ClientHistory
const ClientList = lazy(() => import('../pages/client/ClientList')); // Import ClientList
const AppointmentList = lazy(()  => import('../pages/appointment/AppointmentList'));
const CustomerHistoryReport = lazy(() => import('../pages/report/CustomerHistoryReport')); // Import CustomerHistoryReport
const AppointmentHistoryReport = lazy(() => import('../pages/report/AppointmentHistoryReport')); // Import AppointmentHistoryReport
const PayTypeHistory = lazy(() => import('../pages/report/PayTypeHistory'));
 const ERROR404 = lazy(() => import('../pages/error/Error404'));
 const Error = lazy(() => import('../components/Error'));

const routes = [
    {
        path: '/',
        element: <LoginCover />,
        layout:'blank'
    },
    {
        path: '/index',
        element: <Index />,
        protected: true,
    },
    { path:'customerHistoryReport',
        element:<CustomerHistoryReport />
    },
    { 
        path: 'appointmentHistoryReport',
        element: <AppointmentHistoryReport />
    },
    { 
        path: 'payTypeHistory',
        element: <PayTypeHistory />
    },

    {
         path: '/userRoleList',
         element: <UserRoleList />,
    },

    {
        path: '/userRoleMappingList',
         element: <UserRoleMappingList />,
     },
     {
         path: '/menuRoleMappingList',
        element: <MenuRoleMappingList />,
     },

    {
        path: '/clientHistory', // Add ClientHistory route
        element: <ClientHistory />,
    },
    {
        path: '/clientInfo', // Add ClientList route
        element: <ClientList />,
    },
    {
        path: '/appointment',
        element: <AppointmentList />
    },

    {
        path: '*',
        element: <ERROR404 />,
        layout: 'blank',
    },
];

export { routes };