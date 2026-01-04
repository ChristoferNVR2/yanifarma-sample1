import api from '../axios.config';
import type {
	Producto,
	ProductoCreate,
	Categoria,
	Presentacion,
	Componente,
} from '@/types';

export const productsService = {
	// Products
	getAll: () => api.get<Producto[]>('/productos/'),

	getById: (id: number) => api.get<Producto>(`/productos/${id}`),

	search: (query: string) =>
		api.get<Producto[]>(`/productos/search/?q=${query}`),

	create: (data: ProductoCreate) => api.post<Producto>('/productos/', data),

	update: (id: number, data: Partial<ProductoCreate>) =>
		api.put<Producto>(`/productos/${id}`, data),

	delete: (id: number) => api.delete(`/productos/${id}`),

	// Lookup tables
	getCategories: () => api.get<Categoria[]>('/categorias/'),

	getPresentations: () => api.get<Presentacion[]>('/presentaciones/'),

	getComponents: () => api.get<Componente[]>('/componentes/'),

	createCategory: (nombre: string) =>
		api.post<Categoria>('/categorias/', { nombre_categoria: nombre }),

	createPresentation: (desc: string) =>
		api.post<Presentacion>('/presentaciones/', { desc_presentacion: desc }),

	createComponent: (nombre: string) =>
		api.post<Componente>('/componentes/', { nombre_componente: nombre }),
};
