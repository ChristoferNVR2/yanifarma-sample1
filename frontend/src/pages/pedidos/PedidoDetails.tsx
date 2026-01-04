import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, Package, Calendar, User, FileText, Truck } from 'lucide-react';
import toast from 'react-hot-toast';

import { pedidosService } from '@/api/services';
import type { Pedido } from '@/types';
import { Card, Button, Spinner, Badge } from '@/components/common';

const PedidoDetails = () => {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const [pedido, setPedido] = useState<Pedido | null>(null);
	const [loading, setLoading] = useState(true);

	// Fetch pedido details
	useEffect(() => {
		const fetchPedido = async () => {
			if (!id) return;

			try {
				setLoading(true);
				const response = await pedidosService.getById(Number(id));
				setPedido(response.data);
			} catch (error) {
				toast.error('Error al cargar detalles del pedido');
				console.error('Error fetching pedido:', error);
				navigate('/pedidos');
			} finally {
				setLoading(false);
			}
		};

		void fetchPedido();
	}, [id, navigate]);

	// Get status badge
	const getStatusBadge = (estadoId: number) => {
		switch (estadoId) {
			case 60001: // Entregado
				return <Badge variant="success">Entregado</Badge>;
			case 60002: // En proceso
				return <Badge variant="warning">En Proceso</Badge>;
			case 60003: // Cancelado
				return <Badge variant="danger">Cancelado</Badge>;
			default:
				return <Badge variant="info">Desconocido</Badge>;
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

	if (loading) {
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
					onClick={() => navigate('/pedidos')}
					className="flex items-center text-primary-600 hover:text-primary-800 mb-4"
				>
					<ArrowLeft size={20} className="mr-2" />
					Volver a Pedidos
				</button>

				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold text-gray-800">Pedido #{pedido.id_pedido}</h1>
						<p className="text-gray-600 mt-1">Detalles de la orden de compra</p>
					</div>
					<div className="flex gap-3">
						<Button
							variant="secondary"
							onClick={() => navigate(`/pedidos/edit/${pedido.id_pedido}`)}
							className="flex items-center gap-2"
						>
							<Edit size={18} />
							Editar
						</Button>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Main Content */}
				<div className="lg:col-span-2 space-y-6">
					{/* Order Information */}
					<Card title="Información del Pedido">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="flex items-start gap-3">
								<Package className="text-primary-600 mt-1" size={20} />
								<div>
									<p className="text-sm text-gray-600">Número de Pedido</p>
									<p className="font-semibold text-gray-800">#{pedido.id_pedido}</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<FileText className="text-primary-600 mt-1" size={20} />
								<div>
									<p className="text-sm text-gray-600">Estado</p>
									<div className="mt-1">{getStatusBadge(pedido.id_estado_pedido)}</div>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<Calendar className="text-primary-600 mt-1" size={20} />
								<div>
									<p className="text-sm text-gray-600">Fecha de Solicitud</p>
									<p className="font-semibold text-gray-800">
										{formatDate(pedido.fecha_solicitud)}
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<Calendar className="text-primary-600 mt-1" size={20} />
								<div>
									<p className="text-sm text-gray-600">Fecha de Entrega Estimada</p>
									<p className="font-semibold text-gray-800">
										{pedido.fecha_entrega_estimada
											? formatDate(pedido.fecha_entrega_estimada)
											: 'No especificada'}
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<Truck className="text-primary-600 mt-1" size={20} />
								<div>
									<p className="text-sm text-gray-600">Proveedor</p>
									<p className="font-semibold text-gray-800">
										Proveedor #{pedido.id_proveedor}
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<User className="text-primary-600 mt-1" size={20} />
								<div>
									<p className="text-sm text-gray-600">Solicitado por</p>
									<p className="font-semibold text-gray-800">
										Usuario #{pedido.id_usuario}
									</p>
								</div>
							</div>

							{pedido.motivo && (
								<div className="md:col-span-2 flex items-start gap-3">
									<FileText className="text-primary-600 mt-1" size={20} />
									<div>
										<p className="text-sm text-gray-600">Notas / Motivo</p>
										<p className="text-gray-800">{pedido.motivo}</p>
									</div>
								</div>
							)}
						</div>
					</Card>

					{/* Products - Placeholder for now */}
					<Card title="Productos Solicitados">
						<div className="text-center py-8 text-gray-500">
							<Package size={48} className="mx-auto mb-4 text-gray-400" />
							<p>Los detalles de productos se mostrarán aquí</p>
							<p className="text-sm mt-2">
								(Se requiere endpoint backend para detalle_pedido)
							</p>
						</div>
					</Card>
				</div>

				{/* Sidebar */}
				<div className="space-y-6">
					{/* Quick Actions */}
					<Card title="Acciones Rápidas">
						<div className="space-y-3">
							<Button
								variant="primary"
								className="w-full"
								onClick={() => navigate(`/pedidos/edit/${pedido.id_pedido}`)}
							>
								<Edit size={18} className="mr-2" />
								Editar Pedido
							</Button>

							{pedido.id_estado_pedido === 60002 && (
								<>
									<Button variant="success" className="w-full">
										Marcar como Entregado
									</Button>
									<Button variant="danger" className="w-full">
										Cancelar Pedido
									</Button>
								</>
							)}

							{pedido.id_estado_pedido === 60001 && (
								<Button variant="info" className="w-full">
									Generar Compra
								</Button>
							)}
						</div>
					</Card>

					{/* Timeline */}
					<Card title="Historial">
						<div className="space-y-4">
							<div className="flex gap-3">
								<div className="flex flex-col items-center">
									<div className="w-3 h-3 bg-primary-600 rounded-full"></div>
									<div className="w-0.5 h-full bg-gray-300"></div>
								</div>
								<div className="pb-4">
									<p className="font-medium text-gray-800">Pedido Creado</p>
									<p className="text-sm text-gray-600">
										{formatDate(pedido.fecha_solicitud)}
									</p>
								</div>
							</div>

							{pedido.id_estado_pedido === 60001 && (
								<div className="flex gap-3">
									<div className="flex flex-col items-center">
										<div className="w-3 h-3 bg-green-600 rounded-full"></div>
										<div className="w-0.5 h-full bg-gray-300"></div>
									</div>
									<div className="pb-4">
										<p className="font-medium text-gray-800">Entregado</p>
										<p className="text-sm text-gray-600">
											{pedido.fecha_entrega_estimada
												? formatDate(pedido.fecha_entrega_estimada)
												: 'Fecha no especificada'}
										</p>
									</div>
								</div>
							)}

							{pedido.id_estado_pedido === 60003 && (
								<div className="flex gap-3">
									<div className="flex flex-col items-center">
										<div className="w-3 h-3 bg-red-600 rounded-full"></div>
									</div>
									<div>
										<p className="font-medium text-gray-800">Cancelado</p>
										<p className="text-sm text-gray-600">Pedido cancelado</p>
									</div>
								</div>
							)}
						</div>
					</Card>

					{/* Summary */}
					<Card title="Resumen">
						<div className="space-y-2">
							<div className="flex justify-between text-sm">
								<span className="text-gray-600">Motivo:</span>
								<span className="font-medium">Motivo #{pedido.id_motivo_pedido}</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-gray-600">Proveedor:</span>
								<span className="font-medium">Proveedor #{pedido.id_proveedor}</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-gray-600">Usuario:</span>
								<span className="font-medium">Usuario #{pedido.id_usuario}</span>
							</div>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default PedidoDetails;
