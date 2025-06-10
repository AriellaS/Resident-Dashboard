import axios from "axios";

let ajax = {};
export default ajax;

export function request(method, path, data) {
    let headers = {
        "Content-type": "application/json"
    };
    let token = localStorage.getItem('token');
    if (token) {
        try {
            let jwtPayload = JSON.parse(window.atob(token.split('.')[1]));
            if (jwtPayload.exp*1000 < new Date().getTime()) {
                axios.post("/api/refresh")
                    .then(res => {
                        let newToken = res.data.accessToken;
                        localStorage.setItem('token', JSON.stringify(newToken));
                    }).catch(err => {
                        console.error(err)
                        localStorage.removeItem('token');
                    });
            }
            headers["Authorization"] = `Bearer ${JSON.parse(token)}`;
        } catch (err) {
            console.log(err);
        }
    }
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

ajax.request = request;
