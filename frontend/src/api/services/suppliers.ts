import api from '../axios.config';
import type { Proveedor, ProveedorCreate, ContactoProveedor, Cargo } from '@/types';

export const suppliersService = {
	// Suppliers
	getAll: (skip = 0, limit = 100) => 
		api.get<Proveedor[]>('/proveedores/', { params: { skip, limit } }),
	
	getById: (id: number) => api.get<Proveedor>(`/proveedores/${id}`),
	
	create: (data: ProveedorCreate) => api.post<Proveedor>('/proveedores/', data),
	
	update: (id: number, data: Partial<ProveedorCreate>) => 
		api.put<Proveedor>(`/proveedores/${id}`, data),
	
	delete: (id: number) => api.delete(`/proveedores/${id}`),

	// Contacts
	getContacts: (supplierId: number) => 
		api.get<ContactoProveedor[]>(`/proveedores/${supplierId}/contactos/`),
	
	createContact: (data: Omit<ContactoProveedor, 'id_contacto'>) => 
		api.post<ContactoProveedor>('/contactos-proveedor/', data),

	// Cargos
	getCargos: () => api.get<Cargo[]>('/cargos/'),
	
	createCargo: (descripcion: string) => 
		api.post<Cargo>('/cargos/', { descripcion }),
};
