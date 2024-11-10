import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import dayjs from 'dayjs';

const apiURL = 'http://localhost:1337/api/';
const token = localStorage.getItem('sisgbt-jwtoken')

// Función para obtener los pagos
const fetchPayments = async (_, orderBy = 'id', orderType = 'asc') => {
    try {
        const { data } = await axios.get(`${apiURL}payments`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                sort: `${orderBy}:${orderType}`,
                'pagination[pageSize]': 10000,
                'populate[sale][populate][0]': 'client',
            }
        });
        return data;
    } catch (error) {
        console.error('Error al obtener pagos:', error);
        return { data: [], meta: { pagination: { total: 0 } } };
    }
};

// Función para crear un nuevo pago
const createPayment = async (values) => {
    const { data } = await axios.post(`${apiURL}payments`, { data: values }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return data;
};

// Función para actualizar un pago
const updatePayment = async (id, updatedDataPayment) => {
    const { data } = await axios.put(`${apiURL}payments/${id}`, { data: updatedDataPayment }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return data;
};

// Función para eliminar un pago
const deletePayment = async (id) => {
    const { data } = await axios.delete(`${apiURL}payments/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return data;
};

// React Query Hooks
export const usePayments = (orderBy, orderType) => {
    return useQuery(
        ['payments', orderBy, orderType],
        () => fetchPayments(null, orderBy, orderType),
        {
            keepPreviousData: true
        }
    );
};
export const useCreatePayment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (paymentData) => {
            const response = await axios.post(`${apiURL}payments`, { data: paymentData }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['sales']);
        },
    });
};

export const useUpdatePayment = () => {
    return useMutation(({ id, data }) => updatePayment(id, data));
};

export const useDeletePayment = () => {
    return useMutation(deletePayment);
};

export {
    fetchPayments,
    createPayment,
    updatePayment,
    deletePayment
};

