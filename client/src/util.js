import axios from "axios";
import Cookies from "js-cookie";

let ajax = {};

const handleRequest = (headers, method, path, data) => {
    if (method === "get" && data) {
        return axios.get("/api" + path, {
            params: data,
        }).catch(err => {
            throw err;
        });
    }
    return axios({
        method: method,
        url: "/api" + path,
        data: data,
        headers: headers
    }).catch(err => {
        throw err;
    });
}

export async function refreshAccessTokenAndHandleRequest(headers, method, path, data) {
    return await axios.post("/api/refresh")
        .then(res => {
            let tokenString = JSON.stringify(res.data.accessToken);
            localStorage.setItem('token', tokenString);
            headers["Authorization"] = `Bearer ${JSON.parse(tokenString)}`;
            return handleRequest(headers, method, path, data);
        }).catch(err => {
            console.error(err)
            if (err.response.data === 'Refresh token is invalid or expired') {
                localStorage.removeItem('token');
                Cookies.remove('refreshToken');
            }
        });
}

export async function request(method, path, data) {
    let headers = {
        "Content-type": "application/json"
    };
    let tokenString = localStorage.getItem('token');
    if (tokenString) {
        try {
            let jwtPayload = JSON.parse(window.atob(tokenString.split('.')[1]));
            if (jwtPayload.exp*1000 < new Date().getTime()) {
                return refreshAccessTokenAndHandleRequest(headers, method, path, data);
            }
            headers["Authorization"] = `Bearer ${JSON.parse(tokenString)}`;
            return handleRequest(headers, method, path, data);
        } catch (err) {
            console.log(err);
        }
    }
    if (!tokenString && Cookies.get('refreshToken')) {
        return refreshAccessTokenAndHandleRequest(headers, method, path, data);
    }
    return handleRequest(headers, method, path, data);
}
ajax.request = request;

export default ajax;
