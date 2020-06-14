import { API_BASE_URL, ACCESS_TOKEN, REFRESH_TOKEN } from '../constants/property';

//basic request
const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    })
    if (sessionStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + sessionStorage.getItem(ACCESS_TOKEN))
    }
    const defaults = { headers: headers };
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
        .then(response =>
            response.json().then(json => {
                if (!response.ok) {
                    /* response message 받는 부분 */
                    return Promise.reject(json);
                }
                return json;
            })
        );
};

//AeccessToken Refresh request 
export function refreshRequest() {
    return fetch(API_BASE_URL + "/user/refresh", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "refreshToken": sessionStorage.getItem(REFRESH_TOKEN) })
    })
        .then(response =>
            response.json().then(json => {
                if (!response.ok) {
                    return Promise.reject(json);
                }
                return json;
            })
        );
}


//회원 기능과 관련된 API
// login request
export function login(loginRequest) {
    return request({
        url: API_BASE_URL + "/user/login",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

// register request
export function signup(signupRequest) {
    return request({
        url: API_BASE_URL + "/user/register",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

// logout 
export function logout() {
    const data = { "refreshToken": sessionStorage.getItem(REFRESH_TOKEN) }
    return request({
        url: API_BASE_URL + "/user/logout",
        method: 'POST',
        body: JSON.stringify(data)
    });
}

//deleteUser
export function deleteUser(username, password) {
    const data = {
        "username": username,
        "password": password
    }
    return request({
        url: API_BASE_URL + "/user/deleteuser",
        method: 'DELETE',
        body: JSON.stringify(data)
    });
}

// ID 유효성검사
export function checkUsernameAvailability(username) {
    return request({
        url: API_BASE_URL + "/user/checkUsernameAvailability?username=" + username,
        method: 'GET'
    });
}

//email 유효성검사
export function checkEmailAvailability(email) {
    return request({
        url: API_BASE_URL + "/user/checkEmailAvailability?email=" + email,
        method: 'GET'
    });
}

//my profile
export function getCurrentUser() {
    if (!sessionStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }
    return request({
        url: API_BASE_URL + "/user/me",
        method: 'GET'
    });
}

//user profile
export function getUserProfile(username) {
    return request({
        url: API_BASE_URL + "/users/" + username,
        method: 'GET'
    });
}

//Load All User
export function loadAllUser() {
    return request({
        url: API_BASE_URL + "/user/alluser",
        method: 'GET'
    });
}

//Load All User
export function uploadUserEnabled(userid) {
    return request({
        url: API_BASE_URL + "/user/enabled/" + userid,
        method: 'PUT'
    });
}

//Load All User
export function uploadRoleEdit(userid, username) {
    return request({
        url: API_BASE_URL + "/user/role/" + userid,
        method: 'PUT',
        body: JSON.stringify({"username":username})
    });
}
