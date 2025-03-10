import { createBrowserRouter } from 'react-router-dom';
import BlankLayout from '../components/Layouts/BlankLayout';
import DefaultLayout from '../components/Layouts/DefaultLayout';
import PrivateRoute from '../components/Layouts/PrivateRoute';
import { routes } from './routes';

const finalRoutes = routes.map((route) => {
    const Layout = route.layout === "blank" ? BlankLayout : DefaultLayout;

    return {
        ...route,
        element: route.protected ? (
            <PrivateRoute>
                <Layout>{route.element}</Layout>
            </PrivateRoute>
        ) : (
            <Layout>{route.element}</Layout>
        ),
    };
});


const router = createBrowserRouter(finalRoutes);

export default router;
