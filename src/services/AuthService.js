import axios from 'axios';
const apiURL = 'http://localhost:1337/api'



const authService = {
    getRole: async (user) => {
        try {
            const response = await fetch(apiURL + '/users/me?populate=role', {
                headers: { Authorization: 'Bearer ' + user.jwt }
            })
            const userinfo = await response.json()
            return userinfo ? { jwt: user.jwt, role: userinfo.role } : null;
        } catch (error) {
            return null;
        }
    },
    login: async (username, password) => {
        try {
            const response = await axios.post(apiURL + '/auth/local', { identifier: username, password });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    logout: () => {
        localStorage.removeItem('sisgbt-jwtoken');
    },
};

export default authService;