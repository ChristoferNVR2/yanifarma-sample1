import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
	ArrowLeft,
	Edit,
	Package,
	Calendar,
	User,
	FileText,
	Truck,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { pedidosService } from '@/api/services';
import { Card, Button, Spinner, Badge } from '@/components/common';

interface PedidoDetalle {
	id_producto: number;
	nombre_comercial: string;
	cantidad_solicitada: number;
	precio_venta: number;
}

interface PedidoDetails {
	id_pedido: number;
	id_proveedor: number;
	id_usuario: number;
	id_estado_pedido: number;
	id_motivo_pedido: number;
	fecha_solicitud: string;
	fecha_entrega_estimada?: string;
	motivo?: string;
	proveedor?: {
		razon_social: string;
		ruc: string;
	};
	usuario?: {
		nombres: string;
		apellido_paterno: string;
	};
	estado?: {
		descripcion: string;
	};
	motivo_descripcion?: string;
	detalles?: PedidoDetalle[];
}

const PedidoDetailsPage = () => {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const [pedido, setPedido] = useState<PedidoDetails | null>(null);
	const [loading, setLoading] = useState(true);

	// Fetch pedido details
	useEffect(() => {
		const fetchPedido = async () => {
			if (!id) return;

			try {
				setLoading(true);
				const response = await pedidosService.getById(Number(id));
				console.log('Pedido data:', response.data); // Debug
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
				return <Badge variant='success'>Entregado</Badge>;
			case 60002: // En proceso
				return <Badge variant='warning'>En Proceso</Badge>;
			case 60003: // Cancelado
				return <Badge variant='danger'>Cancelado</Badge>;
			default:
				return <Badge variant='info'>Desconocido</Badge>;
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

	// Format currency
	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('es-PE', {
			style: 'currency',
			currency: 'PEN',
		}).format(amount);
	};

	if (loading) {
		return (
			<div className='flex items-center justify-center h-64'>
				<Spinner size='lg' />
			</div>
		);
	}

	if (!pedido) {
		return (
			<div className='text-center py-12'>
				<p className='text-gray-600'>Pedido no encontrado</p>
				<Button
					variant='primary'
					onClick={() => navigate('/pedidos')}
					className='mt-4'
				>
					Volver a Pedidos
				</Button>
			</div>
		);
	}

	// Calculate total with safe defaults
	const detalles = pedido.detalles || [];
	const totalUnidades = detalles.reduce(
		(sum, d) => sum + (d.cantidad_solicitada || 0),
		0,
	);
	const totalEstimado = detalles.reduce(
		(sum, d) => sum + (d.cantidad_solicitada || 0) * (d.precio_venta || 0),
		0,
	);

	return (
		<div>
			{/* Header */}
			<div className='mb-6'>
				<button
					onClick={() => navigate('/pedidos')}
					className='flex items-center text-primary-600 hover:text-primary-800 mb-4'
				>
					<ArrowLeft size={20} className='mr-2' />
					Volver a Pedidos
				</button>

				<div className='flex items-center justify-between'>
					<div>
						<h1 className='text-3xl font-bold text-gray-800'>
							Pedido #{pedido.id_pedido}
						</h1>
						<p className='text-gray-600 mt-1'>Detalles de la orden de compra</p>
					</div>
					<div className='flex gap-3'>
						<Button
							variant='secondary'
							onClick={() => navigate(`/pedidos/edit/${pedido.id_pedido}`)}
							className='flex items-center gap-2'
						>
							<Edit size={18} />
							Editar
						</Button>
					</div>
				</div>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* Main Content */}
				<div className='lg:col-span-2 space-y-6'>
					{/* Order Information */}
					<Card title='Información del Pedido'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div className='flex items-start gap-3'>
								<Package className='text-primary-600 mt-1' size={20} />
								<div>
									<p className='text-sm text-gray-600'>Número de Pedido</p>
									<p className='font-semibold text-gray-800'>
										#{pedido.id_pedido}
									</p>
								</div>
							</div>

							<div className='flex items-start gap-3'>
								<FileText className='text-primary-600 mt-1' size={20} />
								<div>
									<p className='text-sm text-gray-600'>Estado</p>
									<div className='mt-1'>
										{getStatusBadge(pedido.id_estado_pedido)}
									</div>
								</div>
							</div>

							<div className='flex items-start gap-3'>
								<Calendar className='text-primary-600 mt-1' size={20} />
								<div>
									<p className='text-sm text-gray-600'>Fecha de Solicitud</p>
									<p className='font-semibold text-gray-800'>
										{formatDate(pedido.fecha_solicitud)}
									</p>
								</div>
							</div>

							<div className='flex items-start gap-3'>
								<Calendar className='text-primary-600 mt-1' size={20} />
								<div>
									<p className='text-sm text-gray-600'>
										Fecha de Entrega Estimada
									</p>
									<p className='font-semibold text-gray-800'>
										{pedido.fecha_entrega_estimada
											? formatDate(pedido.fecha_entrega_estimada)
											: 'No especificada'}
									</p>
								</div>
							</div>

							<div className='flex items-start gap-3'>
								<Truck className='text-primary-600 mt-1' size={20} />
								<div>
									<p className='text-sm text-gray-600'>Proveedor</p>
									<p className='font-semibold text-gray-800'>
										{pedido.proveedor?.razon_social ||
											`Proveedor #${pedido.id_proveedor}`}
									</p>
									{pedido.proveedor?.ruc && (
										<p className='text-xs text-gray-500'>
											RUC: {pedido.proveedor.ruc}
										</p>
									)}
								</div>
							</div>

							<div className='flex items-start gap-3'>
								<User className='text-primary-600 mt-1' size={20} />
								<div>
									<p className='text-sm text-gray-600'>Solicitado por</p>
									<p className='font-semibold text-gray-800'>
										{pedido.usuario
											? `${pedido.usuario.nombres} ${pedido.usuario.apellido_paterno}`
											: `Usuario #${pedido.id_usuario}`}
									</p>
								</div>
							</div>

							<div className='flex items-start gap-3'>
								<FileText className='text-primary-600 mt-1' size={20} />
								<div>
									<p className='text-sm text-gray-600'>Motivo</p>
									<p className='font-semibold text-gray-800'>
										{pedido.motivo_descripcion ||
											`Motivo #${pedido.id_motivo_pedido}`}
									</p>
								</div>
							</div>

							{pedido.motivo && (
								<div className='md:col-span-2 flex items-start gap-3'>
									<FileText className='text-primary-600 mt-1' size={20} />
									<div className='flex-1'>
										<p className='text-sm text-gray-600'>Notas Adicionales</p>
										<p className='text-gray-800'>{pedido.motivo}</p>
									</div>
								</div>
							)}
						</div>
					</Card>

					{/* Products */}
					<Card title='Productos Solicitados'>
						{detalles.length > 0 ? (
							<div className='space-y-3'>
								{detalles.map(detalle => (
									<div
										key={detalle.id_producto}
										className='flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
									>
										<div className='flex-1'>
											<p className='font-medium text-gray-800'>
												{detalle.nombre_comercial}
											</p>
											<p className='text-sm text-gray-600'>
												Cantidad: {detalle.cantidad_solicitada} unidades
											</p>
										</div>
										<div className='text-right'>
											<p className='text-sm text-gray-600'>Precio unitario</p>
											<p className='font-semibold text-gray-800'>
												{formatCurrency(detalle.precio_venta)}
											</p>
										</div>
									</div>
								))}

								{/* Total */}
								<div className='pt-4 border-t border-gray-200'>
									<div className='flex justify-between items-center'>
										<div>
											<p className='text-gray-600'>Total de productos</p>
											<p className='font-semibold text-gray-800'>
												{detalles.length} productos diferentes
											</p>
										</div>
										<div className='text-right'>
											<p className='text-gray-600'>Total unidades</p>
											<p className='font-semibold text-gray-800'>
												{totalUnidades}
											</p>
										</div>
									</div>
									<div className='mt-3 pt-3 border-t border-gray-200'>
										<div className='flex justify-between items-center'>
											<p className='text-lg font-medium text-gray-800'>
												Total Estimado
											</p>
											<p className='text-xl font-bold text-primary-600'>
												{formatCurrency(totalEstimado)}
											</p>
										</div>
									</div>
								</div>
							</div>
						) : (
							<div className='bg-yellow-50 border border-yellow-200 rounded-lg p-6'>
								<div className='text-center'>
									<Package size={48} className='mx-auto mb-4 text-yellow-600' />
									<p className='text-yellow-800 font-medium mb-2'>
										No se encontraron productos
									</p>
									<p className='text-sm text-yellow-700'>
										El backend aún no está devolviendo los detalles del pedido.
										<br />
										Por favor, actualiza el backend según las instrucciones.
									</p>
								</div>
							</div>
						)}
					</Card>
				</div>

				{/* Sidebar */}
				<div className='space-y-6'>
					{/* Quick Actions */}
					<Card title='Acciones Rápidas'>
						<div className='space-y-3'>
							{pedido.id_estado_pedido === 60002 && (
								<>
									<Button variant='success' className='w-full'>
										Marcar como Entregado
									</Button>
									<Button variant='danger' className='w-full'>
										Cancelar Pedido
									</Button>
								</>
							)}

							{pedido.id_estado_pedido === 60001 && (
								<Button variant='info' className='w-full'>
									Generar Compra
								</Button>
							)}
						</div>
					</Card>

					{/* Timeline */}
					<Card title='Historial'>
						<div className='space-y-4'>
							<div className='flex gap-3'>
								<div className='flex flex-col items-center'>
									<div className='w-3 h-3 bg-primary-600 rounded-full'></div>
									<div className='w-0.5 h-full bg-gray-300'></div>
								</div>
								<div className='pb-4'>
									<p className='font-medium text-gray-800'>Pedido Creado</p>
									<p className='text-sm text-gray-600'>
										{formatDate(pedido.fecha_solicitud)}
									</p>
								</div>
							</div>

							{pedido.id_estado_pedido === 60001 && (
								<div className='flex gap-3'>
									<div className='flex flex-col items-center'>
										<div className='w-3 h-3 bg-green-600 rounded-full'></div>
										<div className='w-0.5 h-full bg-gray-300'></div>
									</div>
									<div className='pb-4'>
										<p className='font-medium text-gray-800'>Entregado</p>
										<p className='text-sm text-gray-600'>
											{pedido.fecha_entrega_estimada
												? formatDate(pedido.fecha_entrega_estimada)
												: 'Fecha no especificada'}
										</p>
									</div>
								</div>
							)}

							{pedido.id_estado_pedido === 60003 && (
								<div className='flex gap-3'>
									<div className='flex flex-col items-center'>
										<div className='w-3 h-3 bg-red-600 rounded-full'></div>
									</div>
									<div>
										<p className='font-medium text-gray-800'>Cancelado</p>
										<p className='text-sm text-gray-600'>Pedido cancelado</p>
									</div>
								</div>
							)}
						</div>
					</Card>

					{/* Summary */}
					<Card title='Resumen'>
						<div className='space-y-2 text-sm'>
							<div className='flex justify-between'>
								<span className='text-gray-600'>Estado:</span>
								<span className='font-medium'>
									{pedido.estado?.descripcion || 'Desconocido'}
								</span>
							</div>
							<div className='flex justify-between'>
								<span className='text-gray-600'>Productos:</span>
								<span className='font-medium'>{detalles.length}</span>
							</div>
							<div className='flex justify-between'>
								<span className='text-gray-600'>Total Unidades:</span>
								<span className='font-medium'>{totalUnidades}</span>
							</div>
							<div className='pt-2 border-t border-gray-200'>
								<div className='flex justify-between'>
									<span className='text-gray-600'>Total Estimado:</span>
									<span className='font-semibold text-primary-600'>
										{formatCurrency(totalEstimado)}
									</span>
								</div>
							</div>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default PedidoDetailsPage;
