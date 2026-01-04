import api from '../axios.config';
import type { Pedido, EstadoPedido, MotivoPedido } from '@/types';

export const pedidosService = {
	// Get all pedidos
	getAll: () => api.get<Pedido[]>('/pedidos/'),

	// Get pedido by ID
	getById: (id: number) => api.get<Pedido>(`/pedidos/${id}`),

	// Create pedido
	create: (data: {
		id_proveedor: number;
		id_estado_pedido: number;
		id_motivo_pedido: number;
		fecha_solicitud: string;
		fecha_entrega_estimada?: string;
		motivo?: string;
		detalles: Array<{
			id_producto: number;
			cantidad_solicitada: number;
		}>;
	}) => api.post<Pedido>('/pedidos/', data),

	// Update pedido status
	updateStatus: (id: number, id_estado_pedido: number) =>
		api.patch<Pedido>(`/pedidos/${id}/estado`, { id_estado_pedido }),

	// Get estados pedido
	getEstados: () => api.get<EstadoPedido[]>('/estados-pedido/'),

	// Get motivos pedido
	getMotivos: () => api.get<MotivoPedido[]>('/motivos-pedido/'),
};
