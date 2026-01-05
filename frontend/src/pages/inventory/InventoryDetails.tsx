import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Package, Calendar, DollarSign, MapPin, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

import { Card, Button, Spinner, Badge } from '@/components/common';

interface InventoryDetails {
	id_inventario: number;
	id_lote: number;
	stock_actual: number;
	codigo_lote: string;
	fecha_vencimiento: string;
	precio_compra_unitario: number;
	id_producto: number;
	nombre_comercial: string;
	ubicacion_estante: string;
}

const InventoryDetails = () => {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const [inventory, setInventory] = useState<InventoryDetails | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchInventory = async () => {
			if (!id) return;

			try {
				setLoading(true);
				const response = await axios.get(`http://localhost:8000/api/inventario/${id}`);
				setInventory(response.data);
			} catch (error) {
				toast.error('Error al cargar inventario');
				console.error('Error fetching inventory:', error);
				navigate('/inventory');
			} finally {
				setLoading(false);
			}
		};

		void fetchInventory();
	}, [id, navigate]);

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

	// Check if expired
	const isExpired = (dateString: string) => {
		return new Date(dateString) < new Date();
	};

	// Check if near expiration (3 months)
	const isNearExpiration = (dateString: string) => {
		const expiryDate = new Date(dateString);
		const threeMonthsFromNow = new Date();
		threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
		return expiryDate < threeMonthsFromNow && !isExpired(dateString);
	};

	// Get stock status
	const getStockStatus = (stock: number) => {
		if (stock === 0) return { label: 'Sin Stock', color: 'red' };
		if (stock < 20) return { label: 'Stock Bajo', color: 'yellow' };
		return { label: 'Stock Normal', color: 'green' };
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<Spinner size="lg" />
			</div>
		);
	}

	if (!inventory) {
		return (
			<div className="text-center py-12">
				<p className="text-gray-600">Inventario no encontrado</p>
				<Button variant="primary" onClick={() => navigate('/inventory')} className="mt-4">
					Volver a Inventario
				</Button>
			</div>
		);
	}

	const stockStatus = getStockStatus(inventory.stock_actual);
	const expired = isExpired(inventory.fecha_vencimiento);
	const nearExpiry = isNearExpiration(inventory.fecha_vencimiento);

	return (
		<div>
			{/* Header */}
			<div className="mb-6">
				<button
					onClick={() => navigate('/inventory')}
					className="flex items-center text-primary-600 hover:text-primary-800 mb-4"
				>
					<ArrowLeft size={20} className="mr-2" />
					Volver a Inventario
				</button>

				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold text-gray-800">
							Lote: {inventory.codigo_lote}
						</h1>
						<p className="text-gray-600 mt-1">{inventory.nombre_comercial}</p>
					</div>
					<div className="flex gap-3">
						<Badge variant={stockStatus.color as any}>{stockStatus.label}</Badge>
						{expired && <Badge variant="red">VENCIDO</Badge>}
						{nearExpiry && <Badge variant="yellow">Próximo a vencer</Badge>}
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Main Content */}
				<div className="lg:col-span-2 space-y-6">
					{/* Lote Information */}
					<Card title="Información del Lote">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="flex items-start gap-3">
								<Package className="text-primary-600 mt-1" size={20} />
								<div>
									<p className="text-sm text-gray-600">Código de Lote</p>
									<p className="font-semibold text-gray-800">{inventory.codigo_lote}</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<Package className="text-primary-600 mt-1" size={20} />
								<div>
									<p className="text-sm text-gray-600">Producto</p>
									<button
										onClick={() => navigate(`/products/edit/${inventory.id_producto}`)}
										className="font-semibold text-primary-600 hover:text-primary-800"
									>
										{inventory.nombre_comercial}
									</button>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<Calendar className="text-primary-600 mt-1" size={20} />
								<div>
									<p className="text-sm text-gray-600">Fecha de Vencimiento</p>
									<p className={`font-semibold ${expired ? 'text-red-600' : nearExpiry ? 'text-yellow-600' : 'text-gray-800'}`}>
										{formatDate(inventory.fecha_vencimiento)}
									</p>
									{expired && (
										<p className="text-xs text-red-600 mt-1">Este lote está vencido</p>
									)}
									{nearExpiry && (
										<p className="text-xs text-yellow-600 mt-1">
											Vence en menos de 3 meses
										</p>
									)}
								</div>
							</div>

							<div className="flex items-start gap-3">
								<DollarSign className="text-primary-600 mt-1" size={20} />
								<div>
									<p className="text-sm text-gray-600">Costo Unitario</p>
									<p className="font-semibold text-gray-800">
										{formatCurrency(inventory.precio_compra_unitario)}
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<MapPin className="text-primary-600 mt-1" size={20} />
								<div>
									<p className="text-sm text-gray-600">Ubicación</p>
									<p className="font-semibold text-gray-800">
										{inventory.ubicacion_estante}
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<Package className="text-primary-600 mt-1" size={20} />
								<div>
									<p className="text-sm text-gray-600">Stock Actual</p>
									<p className="text-2xl font-bold text-green-600">
										{inventory.stock_actual} unidades
									</p>
								</div>
							</div>
						</div>
					</Card>

					{/* Warnings */}
					{(expired || nearExpiry || inventory.stock_actual < 20) && (
						<Card title="Alertas">
							<div className="space-y-3">
								{expired && (
									<div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
										<AlertTriangle className="text-red-600 mt-0.5" size={20} />
										<div>
											<p className="font-medium text-red-900">Producto Vencido</p>
											<p className="text-sm text-red-800 mt-1">
												Este lote venció el {formatDate(inventory.fecha_vencimiento)}.
												Se recomienda retirarlo del inventario.
											</p>
										</div>
									</div>
								)}

								{nearExpiry && !expired && (
									<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
										<AlertTriangle className="text-yellow-600 mt-0.5" size={20} />
										<div>
											<p className="font-medium text-yellow-900">
												Próximo a Vencer
											</p>
											<p className="text-sm text-yellow-800 mt-1">
												Este lote vence el {formatDate(inventory.fecha_vencimiento)}.
												Considere priorizar su venta.
											</p>
										</div>
									</div>
								)}

								{inventory.stock_actual < 20 && inventory.stock_actual > 0 && (
									<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
										<AlertTriangle className="text-yellow-600 mt-0.5" size={20} />
										<div>
											<p className="font-medium text-yellow-900">Stock Bajo</p>
											<p className="text-sm text-yellow-800 mt-1">
												Solo quedan {inventory.stock_actual} unidades. Considere
												reabastecer.
											</p>
										</div>
									</div>
								)}

								{inventory.stock_actual === 0 && (
									<div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
										<AlertTriangle className="text-red-600 mt-0.5" size={20} />
										<div>
											<p className="font-medium text-red-900">Sin Stock</p>
											<p className="text-sm text-red-800 mt-1">
												Este lote no tiene unidades disponibles.
											</p>
										</div>
									</div>
								)}
							</div>
						</Card>
					)}
				</div>

				{/* Sidebar */}
				<div className="space-y-6">
					{/* Quick Info */}
					<Card title="Resumen">
						<div className="space-y-3">
							<div className="flex justify-between items-center">
								<span className="text-sm text-gray-600">ID Inventario:</span>
								<span className="font-medium">#{inventory.id_inventario}</span>
							</div>
							<div className="flex justify-between items-center">
								<span className="text-sm text-gray-600">ID Lote:</span>
								<span className="font-medium">#{inventory.id_lote}</span>
							</div>
							<div className="flex justify-between items-center">
								<span className="text-sm text-gray-600">Stock:</span>
								<span className="text-xl font-bold text-green-600">
									{inventory.stock_actual}
								</span>
							</div>
							<div className="pt-3 border-t border-gray-200">
								<div className="flex justify-between items-center">
									<span className="text-sm text-gray-600">Valor Total:</span>
									<span className="text-lg font-bold text-gray-800">
										{formatCurrency(
											inventory.stock_actual * inventory.precio_compra_unitario,
										)}
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
								onClick={() =>
									navigate(`/products/edit/${inventory.id_producto}`)
								}
							>
								Ver Producto
							</Button>
							<Button variant="secondary" className="w-full" disabled>
								Ajustar Stock
							</Button>
							<Button variant="secondary" className="w-full" disabled>
								Ver Movimientos
							</Button>
						</div>
					</Card>

					{/* Additional Info */}
					<Card title="Información">
						<div className="space-y-3 text-sm text-gray-600">
							<p>
								Este lote contiene {inventory.stock_actual} unidades del producto{' '}
								<strong>{inventory.nombre_comercial}</strong>.
							</p>
							<p>
								El costo unitario de compra fue de{' '}
								<strong>{formatCurrency(inventory.precio_compra_unitario)}</strong>.
							</p>
							<p>
								Ubicado en <strong>{inventory.ubicacion_estante}</strong>.
							</p>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default InventoryDetails;
