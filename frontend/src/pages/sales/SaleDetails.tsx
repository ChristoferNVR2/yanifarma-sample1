import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
	ArrowLeft,
	ShoppingCart,
	Calendar,
	Clock,
	User,
	CreditCard,
	FileText,
	Package,
	Edit,
	Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { salesService } from '@/api/services';
import { Card, Button, Spinner, Badge } from '@/components/common';

interface SaleDetails {
	id_venta: number;
	id_cliente: number;
	id_usuario: number;
	fecha_venta: string;
	hora_venta: string;
	monto_total: number | string;
}

const SaleDetails = () => {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const [venta, setVenta] = useState<SaleDetails | null>(null);
	const [loading, setLoading] = useState(true);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [deleting, setDeleting] = useState(false);

	// Fetch sale details
	useEffect(() => {
		const fetchVenta = async () => {
			if (!id) return;

			try {
				setLoading(true);
				const response = await salesService.getById(Number(id));
				setVenta(response.data);
			} catch (error) {
				toast.error('Error al cargar detalles de la venta');
				console.error('Error fetching venta:', error);
				navigate('/sales');
			} finally {
				setLoading(false);
			}
		};

		void fetchVenta();
	}, [id, navigate]);

	// Handle delete
	const handleDelete = async () => {
		if (!id) return;

		try {
			setDeleting(true);
			await salesService.delete(Number(id));
			toast.success('Venta eliminada exitosamente');
			navigate('/sales');
		} catch (error) {
			toast.error('Error al eliminar venta');
			console.error('Error deleting sale:', error);
		} finally {
			setDeleting(false);
			setShowDeleteConfirm(false);
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

	// Format time
	const formatTime = (timeString: string) => {
		const timePart = timeString.includes('T') ? timeString.split('T')[1] : timeString;
		return timePart.substring(0, 5);
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

	if (!venta) {
		return (
			<div className="text-center py-12">
				<p className="text-gray-600">Venta no encontrada</p>
				<Button variant="primary" onClick={() => navigate('/sales')} className="mt-4">
					Volver a Ventas
				</Button>
			</div>
		);
	}

	return (
		<div>
			{/* Header */}
			<div className="mb-6">
				<button
					onClick={() => navigate('/sales')}
					className="flex items-center text-primary-600 hover:text-primary-800 mb-4"
				>
					<ArrowLeft size={20} className="mr-2" />
					Volver a Ventas
				</button>

				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold text-gray-800">Venta #{venta.id_venta}</h1>
						<p className="text-gray-600 mt-1">Detalles de la venta realizada</p>
					</div>
					<div className="flex gap-3">
						<Button
							variant="secondary"
							onClick={() => navigate(`/sales/edit/${venta.id_venta}`)}
							className="flex items-center gap-2"
						>
							<Edit size={18} />
							Editar
						</Button>
						<Button
							variant="danger"
							onClick={() => setShowDeleteConfirm(true)}
							className="flex items-center gap-2"
						>
							<Trash2 size={18} />
							Eliminar
						</Button>
					</div>
				</div>
			</div>

			{/* Delete Confirmation Modal */}
			{showDeleteConfirm && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<Card className="max-w-md">
						<div className="p-6">
							<div className="flex items-center gap-3 mb-4">
								<Trash2 className="text-red-600" size={24} />
								<h3 className="text-xl font-bold text-gray-800">Confirmar Eliminación</h3>
							</div>
							<p className="text-gray-600 mb-6">
								¿Estás seguro de que deseas eliminar esta venta? Esta acción no se puede
								deshacer y afectará el inventario.
							</p>
							<div className="flex gap-3">
								<Button
									variant="danger"
									onClick={handleDelete}
									disabled={deleting}
									className="flex-1"
								>
									{deleting ? 'Eliminando...' : 'Sí, Eliminar'}
								</Button>
								<Button
									variant="secondary"
									onClick={() => setShowDeleteConfirm(false)}
									disabled={deleting}
									className="flex-1"
								>
									Cancelar
								</Button>
							</div>
						</div>
					</Card>
				</div>
			)}

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Main Content */}
				<div className="lg:col-span-2 space-y-6">
					{/* Sale Information */}
					<Card title="Información de la Venta">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="flex items-start gap-3">
								<ShoppingCart className="text-primary-600 mt-1" size={20} />
								<div>
									<p className="text-sm text-gray-600">Número de Venta</p>
									<p className="font-semibold text-gray-800">#{venta.id_venta}</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<Calendar className="text-primary-600 mt-1" size={20} />
								<div>
									<p className="text-sm text-gray-600">Fecha</p>
									<p className="font-semibold text-gray-800">
										{formatDate(venta.fecha_venta)}
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<Clock className="text-primary-600 mt-1" size={20} />
								<div>
									<p className="text-sm text-gray-600">Hora</p>
									<p className="font-semibold text-gray-800">
										{formatTime(venta.hora_venta)}
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<User className="text-primary-600 mt-1" size={20} />
								<div>
									<p className="text-sm text-gray-600">Cliente</p>
									<button
										onClick={() => navigate(`/customers/edit/${venta.id_cliente}`)}
										className="font-semibold text-primary-600 hover:text-primary-800"
									>
										Ver Cliente #{venta.id_cliente}
									</button>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<User className="text-primary-600 mt-1" size={20} />
								<div>
									<p className="text-sm text-gray-600">Atendido por</p>
									<p className="font-semibold text-gray-800">
										Usuario #{venta.id_usuario}
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<CreditCard className="text-primary-600 mt-1" size={20} />
								<div>
									<p className="text-sm text-gray-600">Monto Total</p>
									<p className="text-2xl font-bold text-green-600">
										{formatCurrency(venta.monto_total)}
									</p>
								</div>
							</div>
						</div>
					</Card>

					{/* Products Sold - Note */}
					<Card title="Productos Vendidos">
						<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
							<div className="flex items-start gap-3">
								<Package className="text-blue-600 mt-1" size={24} />
								<div>
									<p className="font-medium text-blue-900 mb-2">
										Detalles de productos disponibles en el backend
									</p>
									<p className="text-sm text-blue-800">
										El backend tiene la información detallada de los productos vendidos
										en la tabla <code className="bg-blue-100 px-1 rounded">detalle_venta</code>.
										Puedes consultar directamente la base de datos o actualizar el frontend
										para mostrar estos detalles.
									</p>
								</div>
							</div>
						</div>
					</Card>

					{/* Payment Information - Note */}
					<Card title="Información de Pago">
						<div className="bg-green-50 border border-green-200 rounded-lg p-6">
							<div className="flex items-start gap-3">
								<FileText className="text-green-600 mt-1" size={24} />
								<div>
									<p className="font-medium text-green-900 mb-2">
										Comprobante y método de pago
									</p>
									<p className="text-sm text-green-800">
										El backend almacena el comprobante en la tabla{' '}
										<code className="bg-green-100 px-1 rounded">comprobante</code> y el
										método de pago en la tabla{' '}
										<code className="bg-green-100 px-1 rounded">pago</code>. Esta
										información puede ser consultada para mostrar los detalles completos
										del pago.
									</p>
								</div>
							</div>
						</div>
					</Card>
				</div>

				{/* Sidebar */}
				<div className="space-y-6">
					{/* Quick Info */}
					<Card title="Resumen">
						<div className="space-y-3">
							<div className="flex justify-between items-center">
								<span className="text-sm text-gray-600">Estado:</span>
								<Badge variant="success">Completada</Badge>
							</div>
							<div className="flex justify-between items-center">
								<span className="text-sm text-gray-600">Cliente:</span>
								<span className="font-medium">#{venta.id_cliente}</span>
							</div>
							<div className="flex justify-between items-center">
								<span className="text-sm text-gray-600">Usuario:</span>
								<span className="font-medium">#{venta.id_usuario}</span>
							</div>
							<div className="pt-3 border-t border-gray-200">
								<div className="flex justify-between items-center">
									<span className="text-sm text-gray-600">Total:</span>
									<span className="text-xl font-bold text-green-600">
										{formatCurrency(venta.monto_total)}
									</span>
								</div>
							</div>
						</div>
					</Card>

					{/* Actions */}
					<Card title="Acciones">
						<div className="space-y-3">
							<Button
								variant="secondary"
								className="w-full"
								onClick={() => navigate(`/sales/edit/${venta.id_venta}`)}
							>
								Editar Comprobante
							</Button>
							<Button
								variant="secondary"
								className="w-full"
								onClick={() => navigate(`/customers/edit/${venta.id_cliente}`)}
							>
								Ver Cliente
							</Button>
							<Button
								variant="danger"
								className="w-full"
								onClick={() => setShowDeleteConfirm(true)}
							>
								Eliminar Venta
							</Button>
						</div>
					</Card>

					{/* Timeline */}
					<Card title="Historial">
						<div className="space-y-4">
							<div className="flex gap-3">
								<div className="flex flex-col items-center">
									<div className="w-3 h-3 bg-green-600 rounded-full"></div>
								</div>
								<div>
									<p className="font-medium text-gray-800">Venta Realizada</p>
									<p className="text-sm text-gray-600">
										{formatDate(venta.fecha_venta)} a las {formatTime(venta.hora_venta)}
									</p>
								</div>
							</div>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default SaleDetails;
