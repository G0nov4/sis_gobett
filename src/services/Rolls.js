import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from 'react-query';

const apiURL = 'http://localhost:1337/api/';
const token = localStorage.getItem('sisgbt-jwtoken');


const fetchRolls = async (_, orderBy = 'id', orderType = 'asc', filters = {}) => {
    try {
        const response = await axios.get(`${apiURL}rolls`, {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                sort: `${orderBy}:${orderType}`,
                populate: ['color'],
                ...filters
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener rollos:', error);
        throw error;
    }
};


const createRoll = async (rollData) => {
    // Validaciones
    if (!rollData.code || !/^BM816-\d+-\d+$/.test(rollData.code)) {
        throw new Error('El código del rollo debe seguir el formato BM816-X-Y');
    }

    if (!rollData.roll_footage || rollData.roll_footage <= 0) {
        throw new Error('El metraje debe ser mayor a 0');
    }

    if (!rollData.color || !rollData.color.data) {
        throw new Error('Se requiere especificar el color del rollo');
    }

    if (!['DISPONIBLE', 'RESERVADO'].includes(rollData.status)) {
        throw new Error('Estado inválido. Debe ser DISPONIBLE o RESERVADO');
    }

    try {
        const response = await axios.post(`${apiURL}rolls`, {
            data: {
                ...rollData,
                unit: rollData.unit || 'Metros'
            }
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error al crear rollo:', error);
        throw error;
    }
};

const updateRoll = async ({ id, ...updateData }) => {
    if (!id) {
        throw new Error('Se requiere ID para actualizar');
    }

    // Validaciones específicas para actualización
    if (updateData.roll_footage && updateData.roll_footage <= 0) {
        throw new Error('El metraje debe ser mayor a 0');
    }

    if (updateData.status && !['DISPONIBLE', 'RESERVADO'].includes(updateData.status)) {
        throw new Error('Estado inválido. Debe ser DISPONIBLE o RESERVADO');
    }

    try {
        const response = await axios.put(`${apiURL}rolls/${id}`, {
            data: updateData
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error al actualizar rollo:', error);
        throw error;
    }
};

/**
 * Elimina un rollo
 * @param {number} id - ID del rollo a eliminar
 */
const deleteRoll = async (id) => {
    if (!id) {
        throw new Error('Se requiere ID para eliminar');
    }

    try {
        const response = await axios.delete(`${apiURL}rolls/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error al eliminar rollo:', error);
        throw error;
    }
};


const VALID_STATES = ['DISPONIBLE', 'NO DISPONIBLE', 'EN TIENDA', 'RESERVADO'];
const updateRollStatus = async (id, newStatus) => {
    if (!id) {
        throw new Error('Se requiere ID para actualizar el estado');
    }

    if (!VALID_STATES.includes(newStatus.toUpperCase())) {
        throw new Error(`Estado inválido. Debe ser uno de: ${VALID_STATES.join(', ')}`);
    }

    console.log("id", id, "newStatus", newStatus);
    try {
        const response = await axios.put(`${apiURL}rolls/${id}`, {
            data: {
                status: newStatus.toUpperCase()
            }
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error al actualizar estado del rollo:', error);
        throw error;
    }
};


export const useUpdateRollStatus = () => {
    const queryClient = useQueryClient();
    return useMutation(
        ({ id, newStatus }) => updateRollStatus(id, newStatus),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('rolls');
            }
        }
    );
};


export const useRolls = (orderBy, orderType, filters) => {
    return useQuery(['rolls', orderBy, orderType, filters], 
        () => fetchRolls(null, orderBy, orderType, filters));
};

export const useCreateRoll = () => {
    const queryClient = useQueryClient();
    return useMutation(createRoll, {
        onSuccess: () => {
            queryClient.invalidateQueries('rolls');
        }
    });
};

export const useUpdateRoll = () => {
    const queryClient = useQueryClient();
    return useMutation(updateRoll, {
        onSuccess: () => {
            queryClient.invalidateQueries('rolls');
        }
    });
};

export const useDeleteRoll = () => {
    const queryClient = useQueryClient();
    return useMutation(deleteRoll, {
        onSuccess: () => {
            queryClient.invalidateQueries('rolls');
        }
    });
};

/**
 * Actualiza el metraje de un rollo
 * @param {number} id - ID del rollo
 * @param {number} newFootage - Nuevo metraje del rollo
 * @param {string} [unit='Metros'] - Unidad de medida
 * @returns {Promise} Resultado de la actualización
 * @throws {Error} Si el metraje no es válido o falta el ID
 */
const updateRollFootage = async (id, newFootage, unit = 'Metros') => {
    if (!id) {
        throw new Error('Se requiere ID para actualizar el metraje');
    }

    if (!newFootage || newFootage <= 0) {
        throw new Error('El metraje debe ser mayor a 0');
    }

    // Validar que el metraje sea un número
    if (isNaN(Number(newFootage))) {
        throw new Error('El metraje debe ser un número válido');
    }

    try {
        const response = await axios.put(`${apiURL}rolls/${id}`, {
            data: {
                roll_footage: Number(newFootage),
                unit
            }
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error al actualizar metraje del rollo:', error);
        throw error;
    }
};

/**
 * Hook personalizado para actualizar el metraje de un rollo
 */
export const useUpdateRollFootage = () => {
    const queryClient = useQueryClient();
    return useMutation(
        ({ id, newFootage, unit }) => updateRollFootage(id, newFootage, unit),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('rolls');
            },
            onError: (error) => {
                console.error('Error en la mutación:', error);
                throw error;
            }
        }
    );
};
