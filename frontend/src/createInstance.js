import axios from "axios";
import {jwtDecode} from "jwt-decode";

const refreshToken = async () => {
    try {
        const res = await axios.post('/v1/auth/refresh',{}, {
            withCredentials: true
        });
        return res.data;
    } catch (error) {
        console.error("Error refreshing token:", error);
        return null;
    }
};

const newInstance = axios.create();

export const createAxios = (user, dispatch, stateSuccess) => {
    newInstance.interceptors.request.use(
        async (config) => {
            const date = new Date();
            const decodedToken = jwtDecode(user.accessToken);
                if (decodedToken.exp < date.getTime() / 1000) {
                    const data = await refreshToken();
                    const refreshUser = {
                        ...user,
                        accessToken: data.accessToken
                    };
                    dispatch(stateSuccess(refreshUser));
                    config.headers["token"] = "Bearer " + data.accessToken;
                }   
            return config;
        },
        (err) => {
            return Promise.reject(err);
        }
    );

    return newInstance;
};
