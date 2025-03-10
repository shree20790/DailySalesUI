import { Navigate } from "react-router-dom";
import { getUserData } from "../../utils/userData";
const PrivateRoute = ({ children }) => {
    const userData = getUserData();

    return userData ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
