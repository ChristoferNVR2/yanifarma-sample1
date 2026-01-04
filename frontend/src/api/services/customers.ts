import api from '../axios.config';
import type { Cliente, ClienteCreate } from '@/types';

export const customersService = {
	getAll: (skip = 0, limit = 100) =>
		api.get<Cliente[]>('/clientes/', { params: { skip, limit } }),

	getById: (id: number) => api.get<Cliente>(`/clientes/${id}`),

	create: (data: ClienteCreate) => api.post<Cliente>('/clientes/', data),

	update: (id: number, data: Partial<ClienteCreate>) =>
		api.put<Cliente>(`/clientes/${id}`, data),

	delete: (id: number) => api.delete(`/clientes/${id}`),
};
