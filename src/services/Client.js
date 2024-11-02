import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from 'react-query';

const apiURL = 'http://localhost:1337/api/';
const token = localStorage.getItem('sisgbt-jwtoken')


const fetchClients = async (orderBy = 'id', orderType = 'asc', filters = {}) => {
    try {
        const response = await axios.get(`${apiURL}clients`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                sort: `${orderBy}:${orderType}`,
                ...filters
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

const createClient = async (values) => {
    try {
        const response = await axios.post(`${apiURL}clients`, { data: values }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

const updateClient = async (dataClient) => {
    const updatedDataClient = {
        "name": dataClient.attributes.name,
        "last_name": dataClient.attributes.last_name,
        "direction": dataClient.attributes.direction,
        "kind_of_client": dataClient.attributes.kind_of_client,
        "phone_1": dataClient.attributes.phone_1,
        "phone_2": dataClient.attributes.phone_2,
        "city": dataClient.attributes.city
    }
    try {
        const response = await axios.put(`${apiURL}clients/${dataClient.id}`, { data: updatedDataClient }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

const deleteClient = async (idClient) => {
    try {
        const response = await axios.delete(`${apiURL}clients/${idClient}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const useClients = (orderBy = 'id', orderType = 'asc', filters = {}) => {
    return useQuery('clients', () => fetchClients(orderBy, orderType, filters));
};

export const useCreateClient = () => {
    const  queryClient = useQueryClient()
    return useMutation(createClient,{
        onSuccess: () =>{
            queryClient.invalidateQueries('clients')
        },
        onError: () => {

        }
    });
};

export const useUpdateClient = () => {
    const  queryClient = useQueryClient()
    return useMutation(updateClient,{
        onSuccess: () =>{
            queryClient.invalidateQueries('clients')
        },
        onError: () => {

        }
    });
};

export const useDeleteClient = () => {
    const  queryClient = useQueryClient()
    return useMutation(deleteClient,{
        onSuccess: () =>{
            queryClient.invalidateQueries('clients')
        },
        onError: () => {

        }
    });
};
