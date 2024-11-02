import axios from 'axios';
import { useQuery, useMutation } from 'react-query';

const apiURL = 'http://localhost:1337/api/';
const token = localStorage.getItem('sisgbt-jwtoken')

// Función para obtener las categorías
const fetchCategories = async (_, orderBy = 'id', orderType = 'asc', filters = {}) => {
   
    const { data } = await axios.get(`${apiURL}categories`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            sort: `${orderBy}:${orderType}`,
            ...filters
        }
    });
    return data.data;
};

// Función para crear una nueva categoría
const createCategory = async (values) => {
    const { data } = await axios.post(`${apiURL}categories`, { data: values }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return data;
};

// Función para actualizar una categoría
const updateCategory = async (id, updatedDataCategory) => {
    const { data } = await axios.put(`${apiURL}categories/${id}`, { data: updatedDataCategory }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return data;
};

// Función para eliminar una categoría
const deleteCategory = async (id) => {
    const { data } = await axios.delete(`${apiURL}categories/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return data;
};

// Hook personalizado para obtener las categorías con React Query
export const useCategories =  (orderBy = 'id', orderType = 'asc', filters = {}) => {
    return  useQuery('categories', fetchCategories);
};

// Hook personalizado para crear una nueva categoría con React Query
export const useCreateCategory = () => {
    return useMutation(createCategory);
};

// Hook personalizado para actualizar una categoría con React Query
export const useUpdateCategory = () => {
    return useMutation(updateCategory);
};

// Hook personalizado para eliminar una categoría con React Query
export const useDeleteCategory = () => {
    return useMutation(deleteCategory);
};