import Cookies from "js-cookie";

const USER_DATA_KEY = "userData";

export const setUserData = (data) => {
    Cookies.set(USER_DATA_KEY, JSON.stringify(data), { expires: 7 });
};

export const getUserData = () => {
    const data = Cookies.get(USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
};

export const clearUserData = () => {
    Cookies.remove(USER_DATA_KEY);
};
