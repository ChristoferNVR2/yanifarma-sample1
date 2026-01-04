import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';

import { pedidosService } from '@/api/services';
import type { Pedido, EstadoPedido } from '@/types';
import { Button, Card, Input, Select, Spinner } from '@/components/common';

// Validation schema
const editPedidoSchema = z.object({
	id_estado_pedido: z.number().min(1, 'Selecciona un estado'),
	fecha_entrega_estimada: z.string().optional(),
});

type EditPedidoFormData = z.infer<typeof editPedidoSchema>;

const PedidoEdit = () => {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const [loading, setLoading] = useState(false);
	const [initialLoading, setInitialLoading] = useState(true);
	const [pedido, setPedido] = useState<Pedido | null>(null);
	const [estados, setEstados] = useState<EstadoPedido[]>([]);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<EditPedidoFormData>({
		resolver: zodResolver(editPedidoSchema),
	});

	// Load pedido and estados
	useEffect(() => {
		const loadData = async () => {
			if (!id) return;

			try {
				setInitialLoading(true);
				const [pedidoRes, estadosRes] = await Promise.all([
					pedidosService.getById(Number(id)),
					pedidosService.getEstados(),
				]);

				setPedido(pedidoRes.data);
				setEstados(estadosRes.data);

				// Set form defaults
				reset({
					id_estado_pedido: pedidoRes.data.id_estado_pedido,
					fecha_entrega_estimada: pedidoRes.data.fecha_entrega_estimada || '',
				});
			} catch (error) {
				toast.error('Error al cargar datos del pedido');
				console.error('Error loading pedido:', error);
				navigate('/pedidos');
			} finally {
				setInitialLoading(false);
			}
		};

		void loadData();
	}, [id, navigate, reset]);

	// Get status badge color
	const getStatusColor = (estadoId: number) => {
		switch (estadoId) {
			case 60001:
				return 'text-green-700 bg-green-50 border-green-200';
			case 60002:
				return 'text-yellow-700 bg-yellow-50 border-yellow-200';
			case 60003:
				return 'text-red-700 bg-red-50 border-red-200';
			default:
				return 'text-gray-700 bg-gray-50 border-gray-200';
		}
	};

	// Format date
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('es-PE', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	// Handle form submit
	const onSubmit = async (data: EditPedidoFormData) => {
		if (!id) return;

		try {
			setLoading(true);

			// Update status
			await pedidosService.updateStatus(Number(id), data.id_estado_pedido);

			toast.success('Pedido actualizado exitosamente');
			navigate(`/pedidos/${id}`);
		} catch (error) {
			toast.error('Error al actualizar pedido');
			console.error('Error updating pedido:', error);
		} finally {
			setLoading(false);
		}
	};

	if (initialLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<Spinner size="lg" />
			</div>
		);
	}

	if (!pedido) {
		return (
			<div className="text-center py-12">
				<p className="text-gray-600">Pedido no encontrado</p>
				<Button variant="primary" onClick={() => navigate('/pedidos')} className="mt-4">
					Volver a Pedidos
				</Button>
			</div>
		);
	}

	return (
		<div>
			{/* Header */}
			<div className="mb-6">
				<button
					onClick={() => navigate(`/pedidos/${id}`)}
					className="flex items-center text-primary-600 hover:text-primary-800 mb-4"
				>
					<ArrowLeft size={20} className="mr-2" />
					Volver a Detalles
				</button>
				<h1 className="text-3xl font-bold text-gray-800">Editar Pedido #{pedido.id_pedido}</h1>
				<p className="text-gray-600 mt-1">Modificar estado y fechas del pedido</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Edit Form */}
				<div className="lg:col-span-2">
					<form onSubmit={handleSubmit(onSubmit)}>
						<Card title="Actualizar Pedido">
							<div className="space-y-6">
								{/* Read-only info */}
								<div className="bg-gray-50 p-4 rounded-lg space-y-3">
									<h3 className="font-medium text-gray-800 mb-3">
										Información del Pedido
									</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
										<div>
											<p className="text-gray-600">Número de Pedido</p>
											<p className="font-semibold text-gray-800">
												#{pedido.id_pedido}
											</p>
										</div>
										<div>
											<p className="text-gray-600">Proveedor</p>
											<p className="font-semibold text-gray-800">
												Proveedor #{pedido.id_proveedor}
											</p>
										</div>
										<div>
											<p className="text-gray-600">Fecha de Solicitud</p>
											<p className="font-semibold text-gray-800">
												{formatDate(pedido.fecha_solicitud)}
											</p>
										</div>
										<div>
											<p className="text-gray-600">Solicitado por</p>
											<p className="font-semibold text-gray-800">
												Usuario #{pedido.id_usuario}
											</p>
										</div>
									</div>
								</div>

								{/* Editable fields */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<Select
										label="Estado del Pedido"
										{...register('id_estado_pedido', { valueAsNumber: true })}
										error={errors.id_estado_pedido?.message}
										required
									>
										<option value="">Seleccionar estado</option>
										{estados.map(estado => (
											<option
												key={estado.id_estado_pedido}
												value={estado.id_estado_pedido}
											>
												{estado.descripcion}
											</option>
										))}
									</Select>

									<Input
										label="Fecha de Entrega Estimada"
										type="date"
										{...register('fecha_entrega_estimada')}
										error={errors.fecha_entrega_estimada?.message}
									/>
								</div>

								{/* Form Actions */}
								<div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
									<Button
										type="button"
										variant="secondary"
										onClick={() => navigate(`/pedidos/${id}`)}
									>
										Cancelar
									</Button>
									<Button
										type="submit"
										variant="primary"
										loading={loading}
										className="flex items-center gap-2"
									>
										<Save size={18} />
										Guardar Cambios
									</Button>
								</div>
							</div>
						</Card>
					</form>
				</div>

				{/* Info Sidebar */}
				<div className="space-y-6">
					{/* Current Status */}
					<Card title="Estado Actual">
						<div
							className={`p-4 rounded-lg border ${getStatusColor(pedido.id_estado_pedido)}`}
						>
							<p className="text-sm font-medium">
								{estados.find(e => e.id_estado_pedido === pedido.id_estado_pedido)
									?.descripcion || 'Desconocido'}
							</p>
						</div>
					</Card>

					{/* Help */}
					<Card title="Ayuda">
						<div className="space-y-3 text-sm text-gray-600">
							<div>
								<p className="font-medium text-gray-800 mb-1">Estados disponibles:</p>
								<ul className="list-disc list-inside space-y-1">
									<li>
										<strong>En Proceso:</strong> Pedido pendiente de recepción
									</li>
									<li>
										<strong>Entregado:</strong> Mercadería recibida
									</li>
									<li>
										<strong>Cancelado:</strong> Pedido anulado
									</li>
								</ul>
							</div>

							<div className="pt-3 border-t border-gray-200">
								<p className="font-medium text-gray-800 mb-1">Nota:</p>
								<p>
									Al marcar como "Entregado", podrás generar la compra
									correspondiente para actualizar el inventario.
								</p>
							</div>
						</div>
					</Card>

					{/* Warning */}
					{pedido.id_estado_pedido === 60001 && (
						<Card>
							<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
								<p className="text-sm text-yellow-800">
									<strong>Atención:</strong> Este pedido ya fue marcado como
									entregado. Cambiar el estado puede afectar el inventario.
								</p>
							</div>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
};

export default PedidoEdit;
