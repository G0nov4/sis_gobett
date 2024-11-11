import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from 'react-query';

const apiURL = 'http://localhost:1337/api/';
const token = localStorage.getItem('sisgbt-jwtoken');

// Obtener todas las ventas
const fetchSales = async (_, orderBy = 'id', orderType = 'asc', filters = {}) => {
    try {
        const response = await axios.get(`${apiURL}sales?populate[0]=client&populate[1]=detail.fabric&populate[2]=detail.color&populate[3]=promo&populate[4]=payments&populate[5]=payments`, {
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
        console.error('Error al obtener ventas:', error);
        throw error;
    }
};

// Crear una nueva venta
const createSale = async (saleData) => {
    // Validaciones
    if (!saleData.detail || saleData.detail.length === 0) {
        throw new Error('La venta debe tener al menos un detalle');
    }

    if (saleData.total_sale <= 0) {
        throw new Error('El total de la venta debe ser mayor a 0');
    }

    if (saleData.delivery === 'EN DOMICILIO' && !saleData.address) {
        throw new Error('La dirección es requerida para entregas a domicilio');
    }

    // Validar detalles
    saleData.detail.forEach(item => {
        if (item.quantity <= 0) {
            throw new Error('La cantidad debe ser mayor a 0');
        }
        if (item.unitPrice <= 0) {
            throw new Error('El precio unitario debe ser mayor a 0');
        }
        if (!item.isRoll && item.cuts > item.quantity) {
            throw new Error('El número de cortes no puede ser mayor que la cantidad');
        }
    });

    try {
        const response = await axios.post(`${apiURL}sales`, {
            data: saleData
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al crear venta:', error);
        throw error;
    }
};

// Actualizar una venta
const updateSale = async ({ id, ...updateData }) => {
    if (!id) {
        throw new Error('Se requiere ID para actualizar');
    }

    try {
        const response = await axios.put(`${apiURL}sales/${id}`, {
            data: updateData
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al actualizar venta:', error);
        throw error;
    }
};

// Eliminar una venta
const deleteSale = async (id) => {
    if (!id) {
        throw new Error('Se requiere ID para eliminar');
    }

    try {
        const response = await axios.delete(`${apiURL}sales/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al eliminar venta:', error);
        throw error;
    }
};

// Actualizar el estado de una venta
export const updateSaleStatus = async (saleId, status) => {
    try {
        const response = await fetch(`${apiURL}sales/${saleId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                    status: status
            })
        });
        
        if (!response.ok) throw new Error('Error al actualizar la venta');
        
        return await response.json();
    } catch (error) {
        throw error;
    }
};

// Cancelar una venta
export const cancelSale = async (saleId) => {
    // Implementar lógica de cancelación según tus necesidades
    // Podría ser similar a updateSaleStatus pero con un estado "cancelado"
    // o podría ser una eliminación lógica
};

// Hooks personalizados
export const useSales = (orderBy, orderType, filters) => {
    return useQuery(['sales', orderBy, orderType, filters], 
        () => fetchSales(null, orderBy, orderType, filters));
};

export const useCreateSale = () => {
    const queryClient = useQueryClient();
    return useMutation(createSale, {
        onSuccess: () => {
            queryClient.invalidateQueries('sales');
        }
    });
};

export const useUpdateSale = () => {
    const queryClient = useQueryClient();
    return useMutation(updateSale, {
        onSuccess: () => {
            queryClient.invalidateQueries('sales');
        }
    });
};

export const useDeleteSale = () => {
    const queryClient = useQueryClient();
    return useMutation(deleteSale, {
        onSuccess: () => {
            queryClient.invalidateQueries('sales');
        }
    });
};
