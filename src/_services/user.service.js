import config from 'config';
import { authHeader } from '../_helpers';

export const userService = {
    login,
    logout
};

function login(email, password) {
    const formData  = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    const requestOptions = {
        method: 'POST',
        body: formData
    };

    return fetch(`${config.apiUrl}/login`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // login successful if there's a token in the response
            if (user.token) {
                // store user details and the token in the local storage to keep the user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
            }

            return user;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status !== 200) {
                logout();
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}