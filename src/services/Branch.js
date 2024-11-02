import axios from 'axios';
const apiURL = 'http://localhost:1337/api/'

export const bracnhService = {
    get: async (orderBy = 'id', orderType = 'asc', filters = {}) => {
        try {
            let response;
            await axios.get(apiURL + 'branches', {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('sisgbt-jwtoken')
                },
                params: {
                    sort: 'id' + ':' + orderType,
                    ...filters,  // Filtros adicionales
                },
            }).then(res => {
                response = res.data.data
            })
            return response
        } catch (error) { return error }

    },
    post: async (values) => {
        new Promise(resolve => setTimeout(resolve, 5000));
        try {
            const response = await axios.post(apiURL + 'branches',
                { data: values },
                {
                    headers: {
                        Authorization: 'Bearer ' +  localStorage.getItem('sisgbt-jwtoken')
                    },
                }
            );
            return response.data;
        } catch (error) {
            return error
        }
    },
    put: async (dataBranch) => {
        new Promise(resolve => setTimeout(resolve, 3000));
        const updatedDataBranch = {
            "name":dataBranch.attributes.name,
            "departament": dataBranch.attributes.departament,
            "address": dataBranch.attributes.address,
            "phone": dataBranch.attributes.phone,
            "available": dataBranch.attributes.available
        }
        try {
            const response = await axios.put(apiURL + 'branches/' + dataBranch.id,
                { data: updatedDataBranch },
                {
                    headers: {
                        Authorization: 'Bearer ' +  localStorage.getItem('sisgbt-jwtoken')
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    },
    delete: async (idBranch) => {
        try {
            const response = await axios.delete(apiURL + 'branches/' + idBranch,
                {
                    headers: {
                        Authorization: 'Bearer ' +  localStorage.getItem('sisgbt-jwtoken')
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    },
}