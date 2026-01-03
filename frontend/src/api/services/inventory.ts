import api from '../axios.config';
import type { Inventario, Lote, UbicacionEstante } from '@/types';

export const inventoryService = {
	// Inventory
	getAll: () => api.get<Inventario[]>('/inventario/'),
	
	getById: (id: number) => api.get<Inventario>(`/inventario/${id}`),
	
	getByProduct: (productId: number) => 
		api.get<Inventario[]>(`/inventario/producto/${productId}`),
	
	updateStock: (id: number, stock: number) => 
		api.patch(`/inventario/${id}/stock`, { stock_actual: stock }),

	// Lotes
	getLotes: () => api.get<Lote[]>('/lotes/'),
	
	createLote: (data: Omit<Lote, 'id_lote'>) => 
		api.post<Lote>('/lotes/', data),

	// Ubicaciones
	getLocations: () => api.get<UbicacionEstante[]>('/ubicaciones/'),
	
	createLocation: (estante: string, nivel: string) => 
		api.post<UbicacionEstante>('/ubicaciones/', { estante, nivel }),
};
