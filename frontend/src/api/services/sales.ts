import api from '../axios.config';
import type { Venta, MetodoPago } from '@/types';

export const salesService = {
	// Sales
	getAll: (skip = 0, limit = 100) => 
		api.get<Venta[]>('/ventas/', { params: { skip, limit } }),
	
	getById: (id: number) => api.get<Venta>(`/ventas/${id}`),

	// Payment methods
	getPaymentMethods: () => api.get<MetodoPago[]>('/metodos-pago/'),
};
