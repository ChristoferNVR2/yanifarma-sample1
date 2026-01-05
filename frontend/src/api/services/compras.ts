import api from '../axios.config';
import type { Compra } from '@/types';

export const comprasService = {
	// Get all compras
	getAll: () => api.get<Compra[]>('/compras/'),

	// Get compra by ID
	getById: (id: number) => api.get<Compra>(`/compras/${id}`),

	// Create new compra
	create: (data: any) => api.post<Compra>('/compras/', data),

	// Update compra
	update: (id: number, data: any) => api.patch<Compra>(`/compras/${id}`, data),

	// Delete compra
	delete: (id: number) => api.delete(`/compras/${id}`),
};
