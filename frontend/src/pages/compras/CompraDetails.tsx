import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, Package, Calendar, FileText, Truck, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

import { comprasService } from '@/api/services';
import { Card, Button, Spinner, Badge } from '@/components/common';

interface CompraDetails {
	id_compra: number;
	id_pedido: number;
	fecha_recepcion: string;
	nro_guia?: string;
	tipo_comprobante?: string;
	nro_comprobante?: string;
	monto_total: number | string;
	estado: string;
	fecha_pago?: string;
}

const CompraDetailsPage = () => {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const [compra, setCompra] = useState<CompraDetails | null>(null);
	const [loading, setLoading] = useState(true);

	// Fetch compra details
	useEffect(() => {
		const fetchCompra = async () => {
			if (!id) return;

			try {
				setLoading(true);
				const response = await comprasService.getById(Number(id));
				setCompra(response.data);
			} catch (error) {
				toast.error('Error al cargar detalles de la compra');
				console.error('Error fetching compra:', error);
				navigate('/compras');
			} finally {
				setLoading(false);
			}
		};

		void fetchCompra();
	}, [id, navigate]);

	// Get status badge
	const getStatusBadge = (estado: string) => {
		switch (estado.toLowerCase()) {
			case 'pagado':
				return <Badge variant="success">Pagado</Badge>;
			case 'pendiente':
				return <Badge variant="warning">Pendiente</Badge>;
			case 'cancelado':
				return <Badge variant="danger">Cancelado</Badge>;
			default:
				return <Badge variant="info">{estado}</Badge>;
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
	const formatCurrency = (amount: number | string) => {
		const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
		return new Intl.NumberFormat('es-PE', {
			style: 'currency',
			currency: 'PEN',
		}).format(numAmount);
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<Spinner size="lg" />
			</div>
		);
	}

	if (!compra) {
		return (
			<div className="text-center py-12">
				<p className="text-gray-600">Compra no encontrada</p>
				<Button variant="primary" onClick={() => navigate('/compras')} className="mt-4">
					Volver a Compras
				</Button>
			</div>
		);
	}

	return (
		<div>
			{/* Header */}
			<div className="mb-6">
				<button
					onClick={() => navigate('/compras')}
					className="flex items-center text-primary-600 hover:text-primary-800 mb-4"
				>
					<ArrowLeft size={20} className="mr-2" />
					Volver a Compras
				</button>

				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold text-gray-800">Compra #{compra.id_compra}</h1>
						<p className="text-gray-600 mt-1">Detalles del recibo de compra</p>
					</div>
					<div className="flex gap-3">
						<Button
							variant="secondary"
							onClick={() => navigate(`/compras/edit/${compra.id_compra}`)}
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
					{/* Purchase Information */}
					<Card title="Información de la Compra">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="flex items-start gap-3">
								<Package className="text-primary-600 mt-1" size={20} />
								<div>
									<p className="text-sm text-gray-600">Número de Compra</p>
									<p className="font-semibold text-gray-800">#{compra.id_compra}</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<FileText className="text-primary-600 mt-1" size={20} />
								<div>
									<p className="text-sm text-gray-600">Estado</p>
									<div className="mt-1">{getStatusBadge(compra.estado)}</div>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<FileText className="text-primary-600 mt-1" size={20} />
								<div>
									<p className="text-sm text-gray-600">Pedido Origen</p>
									<button
										onClick={() => navigate(`/pedidos/${compra.id_pedido}`)}
										className="font-semibold text-primary-600 hover:text-primary-800"
									>
										Ver Pedido #{compra.id_pedido}
									</button>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<Calendar className="text-primary-600 mt-1" size={20} />
								<div>
									<p className="text-sm text-gray-600">Fecha de Recepción</p>
									<p className="font-semibold text-gray-800">
										{formatDate(compra.fecha_recepcion)}
									</p>
								</div>
							</div>

							{compra.nro_guia && (
								<div className="flex items-start gap-3">
									<Truck className="text-primary-600 mt-1" size={20} />
									<div>
										<p className="text-sm text-gray-600">Número de Guía</p>
										<p className="font-semibold text-gray-800">{compra.nro_guia}</p>
									</div>
								</div>
							)}

							{compra.nro_comprobante && (
								<div className="flex items-start gap-3">
									<FileText className="text-primary-600 mt-1" size={20} />
									<div>
										<p className="text-sm text-gray-600">Comprobante</p>
										<p className="font-semibold text-gray-800">
											{compra.tipo_comprobante} {compra.nro_comprobante}
										</p>
									</div>
								</div>
							)}

							<div className="flex items-start gap-3">
								<DollarSign className="text-primary-600 mt-1" size={20} />
								<div>
									<p className="text-sm text-gray-600">Monto Total</p>
									<p className="text-xl font-bold text-primary-600">
										{formatCurrency(compra.monto_total)}
									</p>
								</div>
							</div>

							{compra.fecha_pago && (
								<div className="flex items-start gap-3">
									<Calendar className="text-primary-600 mt-1" size={20} />
									<div>
										<p className="text-sm text-gray-600">Fecha de Pago</p>
										<p className="font-semibold text-gray-800">
											{formatDate(compra.fecha_pago)}
										</p>
									</div>
								</div>
							)}
						</div>
					</Card>

					{/* Note about products */}
					<Card title="Productos Recibidos">
						<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
							<div className="flex items-start gap-3">
								<Package className="text-blue-600 mt-1" size={24} />
								<div>
									<p className="font-medium text-blue-900 mb-2">
										Ver productos del pedido original
									</p>
									<p className="text-sm text-blue-800 mb-4">
										Esta compra corresponde al Pedido #{compra.id_pedido}. Los
										productos recibidos son los mismos que se solicitaron en el pedido.
									</p>
									<Button
										variant="primary"
										onClick={() => navigate(`/pedidos/${compra.id_pedido}`)}
										className="text-sm"
									>
										Ver Detalles del Pedido
									</Button>
								</div>
							</div>
						</div>
					</Card>
				</div>

				{/* Sidebar */}
				<div className="space-y-6">
					{/* Quick Actions */}
					<Card title="Acciones Rápidas">
						<div className="space-y-3">
							{compra.estado.toLowerCase() === 'pendiente' && (
								<Button
									variant="success"
									className="w-full"
									onClick={() => navigate(`/compras/edit/${compra.id_compra}`)}
								>
									Marcar como Pagado
								</Button>
							)}

							<Button
								variant="secondary"
								className="w-full"
								onClick={() => navigate(`/pedidos/${compra.id_pedido}`)}
							>
								Ver Pedido Origen
							</Button>
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
									<p className="font-medium text-gray-800">Compra Registrada</p>
									<p className="text-sm text-gray-600">
										{formatDate(compra.fecha_recepcion)}
									</p>
								</div>
							</div>

							{compra.estado.toLowerCase() === 'pagado' && compra.fecha_pago && (
								<div className="flex gap-3">
									<div className="flex flex-col items-center">
										<div className="w-3 h-3 bg-green-600 rounded-full"></div>
									</div>
									<div>
										<p className="font-medium text-gray-800">Pagado</p>
										<p className="text-sm text-gray-600">
											{formatDate(compra.fecha_pago)}
										</p>
									</div>
								</div>
							)}

							{compra.estado.toLowerCase() === 'cancelado' && (
								<div className="flex gap-3">
									<div className="flex flex-col items-center">
										<div className="w-3 h-3 bg-red-600 rounded-full"></div>
									</div>
									<div>
										<p className="font-medium text-gray-800">Cancelado</p>
										<p className="text-sm text-gray-600">Compra cancelada</p>
									</div>
								</div>
							)}
						</div>
					</Card>

					{/* Summary */}
					<Card title="Resumen">
						<div className="space-y-2 text-sm">
							<div className="flex justify-between">
								<span className="text-gray-600">Estado:</span>
								<span className="font-medium">{compra.estado}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">Pedido:</span>
								<span className="font-medium">#{compra.id_pedido}</span>
							</div>
							{compra.nro_guia && (
								<div className="flex justify-between">
									<span className="text-gray-600">Guía:</span>
									<span className="font-medium">{compra.nro_guia}</span>
								</div>
							)}
							<div className="pt-2 border-t border-gray-200">
								<div className="flex justify-between">
									<span className="text-gray-600">Monto Total:</span>
									<span className="font-semibold text-primary-600">
										{formatCurrency(compra.monto_total)}
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

export default CompraDetailsPage;
