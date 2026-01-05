import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { salesService, customersService, productsService } from '@/api/services';
import { Card, Button, Input, Select } from '@/components/common';
import type { Customer, Product } from '@/types';

const saleFormSchema = z.object({
	id_cliente: z.number().min(1, 'Cliente es requerido'),
	tipo_comprobante: z.string().min(1, 'Tipo de comprobante es requerido'),
	nro_comprobante: z.string().min(1, 'Número de comprobante es requerido'),
	id_metodo_pago: z.number().min(1, 'Método de pago es requerido'),
	detalles: z
		.array(
			z.object({
				id_producto: z.number(),
				cantidad: z.number().min(1),
				precio_unitario_venta: z.number().min(0),
			}),
		)
		.min(1, 'Debe agregar al menos un producto'),
});

type SaleFormData = z.infer<typeof saleFormSchema>;

interface ProductItem {
	id_producto: number;
	nombre_comercial: string;
	cantidad: number;
	precio_unitario_venta: number;
}

const SaleForm = () => {
	const navigate = useNavigate();
	const [submitting, setSubmitting] = useState(false);
	const [customers, setCustomers] = useState<Customer[]>([]);
	const [products, setProducts] = useState<Product[]>([]);
	const [loadingData, setLoadingData] = useState(true);

	const [formData, setFormData] = useState<Partial<SaleFormData>>({
		id_cliente: undefined,
		tipo_comprobante: 'Boleta',
		nro_comprobante: '',
		id_metodo_pago: 1, // Default: Efectivo
		detalles: [],
	});

	const [productItems, setProductItems] = useState<ProductItem[]>([]);
	const [newProduct, setNewProduct] = useState({
		id_producto: 0,
		cantidad: 1,
	});

	const [errors, setErrors] = useState<Partial<Record<keyof SaleFormData, string>>>({});

	// Load customers and products
	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoadingData(true);
				const [customersRes, productsRes] = await Promise.all([
					customersService.getAll(),
					productsService.getAll(),
				]);
				setCustomers(customersRes.data);
				setProducts(productsRes.data);
			} catch (error) {
				toast.error('Error al cargar datos');
				console.error('Error loading data:', error);
			} finally {
				setLoadingData(false);
			}
		};

		void fetchData();
	}, []);

	// Handle form change
	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value, type } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: type === 'number' ? parseFloat(value) || 0 : value,
		}));
		if (errors[name as keyof SaleFormData]) {
			setErrors(prev => ({ ...prev, [name]: undefined }));
		}
	};

	// Add product to sale
	const handleAddProduct = () => {
		if (newProduct.id_producto === 0) {
			toast.error('Selecciona un producto');
			return;
		}

		if (newProduct.cantidad <= 0) {
			toast.error('La cantidad debe ser mayor a 0');
			return;
		}

		// Check if product already added
		if (productItems.find(item => item.id_producto === newProduct.id_producto)) {
			toast.error('El producto ya fue agregado');
			return;
		}

		const product = products.find(p => p.id_producto === newProduct.id_producto);
		if (!product) return;

		const newItem: ProductItem = {
			id_producto: product.id_producto,
			nombre_comercial: product.nombre_comercial,
			cantidad: newProduct.cantidad,
			precio_unitario_venta: parseFloat(product.precio_venta.toString()),
		};

		setProductItems(prev => [...prev, newItem]);
		setNewProduct({ id_producto: 0, cantidad: 1 });

		// Clear error if exists
		if (errors.detalles) {
			setErrors(prev => ({ ...prev, detalles: undefined }));
		}
	};

	// Remove product from sale
	const handleRemoveProduct = (id_producto: number) => {
		setProductItems(prev => prev.filter(item => item.id_producto !== id_producto));
	};

	// Update product quantity
	const handleUpdateQuantity = (id_producto: number, cantidad: number) => {
		if (cantidad <= 0) return;
		setProductItems(prev =>
			prev.map(item => (item.id_producto === id_producto ? { ...item, cantidad } : item)),
		);
	};

	// Calculate total
	const calculateTotal = () => {
		return productItems.reduce(
			(sum, item) => sum + item.cantidad * item.precio_unitario_venta,
			0,
		);
	};

	// Handle submit
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			// Prepare detalles
			const detalles = productItems.map(item => ({
				id_producto: item.id_producto,
				cantidad: item.cantidad,
				precio_unitario_venta: item.precio_unitario_venta,
			}));

			const submitData = {
				...formData,
				detalles,
			};

			// Validate
			saleFormSchema.parse(submitData);
			setErrors({});

			setSubmitting(true);

			const response = await salesService.create(submitData);

			toast.success('Venta registrada exitosamente');
			navigate(`/sales/${response.data.id_venta}`);
		} catch (error) {
			if (error instanceof z.ZodError) {
				const fieldErrors: Partial<Record<keyof SaleFormData, string>> = {};
				error.errors.forEach(err => {
					if (err.path[0]) {
						fieldErrors[err.path[0] as keyof SaleFormData] = err.message;
					}
				});
				setErrors(fieldErrors);
			} else {
				toast.error('Error al registrar venta');
				console.error('Error creating sale:', error);
			}
		} finally {
			setSubmitting(false);
		}
	};

	if (loadingData) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
					<p className="mt-4 text-gray-600">Cargando datos...</p>
				</div>
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

				<h1 className="text-3xl font-bold text-gray-800">Registrar Nueva Venta</h1>
				<p className="text-gray-600 mt-1">Ingresa los detalles de la venta realizada</p>
			</div>

			<form onSubmit={handleSubmit}>
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Main Form */}
					<div className="lg:col-span-2 space-y-6">
						{/* Customer & Receipt Info */}
						<Card title="Información General">
							<div className="space-y-4">
								{/* Cliente */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Cliente <span className="text-red-500">*</span>
									</label>
									<Select
										name="id_cliente"
										value={formData.id_cliente || ''}
										onChange={handleChange}
										error={errors.id_cliente}
									>
										<option value="">Seleccionar cliente...</option>
										{customers.map(customer => (
											<option key={customer.id_cliente} value={customer.id_cliente}>
												{customer.nombres} {customer.apellido_paterno} - {customer.nro_doc}
											</option>
										))}
									</Select>
									{errors.id_cliente && (
										<p className="mt-1 text-sm text-red-600">{errors.id_cliente}</p>
									)}
								</div>

								{/* Comprobante */}
								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Tipo de Comprobante <span className="text-red-500">*</span>
										</label>
										<Select
											name="tipo_comprobante"
											value={formData.tipo_comprobante || ''}
											onChange={handleChange}
										>
											<option value="Boleta">Boleta</option>
											<option value="Factura">Factura</option>
										</Select>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											N° Comprobante <span className="text-red-500">*</span>
										</label>
										<Input
											type="text"
											name="nro_comprobante"
											value={formData.nro_comprobante || ''}
											onChange={handleChange}
											placeholder="Ej: B001-001234"
											error={errors.nro_comprobante}
										/>
									</div>
								</div>

								{/* Método de Pago */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Método de Pago <span className="text-red-500">*</span>
									</label>
									<Select
										name="id_metodo_pago"
										value={formData.id_metodo_pago || ''}
										onChange={handleChange}
									>
										<option value="1">Efectivo</option>
										<option value="2">Tarjeta</option>
										<option value="3">Yape</option>
										<option value="4">Transferencia</option>
									</Select>
								</div>
							</div>
						</Card>

						{/* Add Products */}
						<Card title="Agregar Productos">
							<div className="space-y-4">
								<div className="flex gap-4">
									<div className="flex-1">
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Producto
										</label>
										<Select
											value={newProduct.id_producto}
											onChange={e =>
												setNewProduct(prev => ({
													...prev,
													id_producto: parseInt(e.target.value),
												}))
											}
										>
											<option value="0">Seleccionar producto...</option>
											{products.map(product => (
												<option key={product.id_producto} value={product.id_producto}>
													{product.nombre_comercial} - S/ {product.precio_venta}
												</option>
											))}
										</Select>
									</div>
									<div className="w-32">
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Cantidad
										</label>
										<Input
											type="number"
											value={newProduct.cantidad}
											onChange={e =>
												setNewProduct(prev => ({
													...prev,
													cantidad: parseInt(e.target.value) || 1,
												}))
											}
											min="1"
										/>
									</div>
									<div className="flex items-end">
										<Button
											type="button"
											variant="primary"
											onClick={handleAddProduct}
											className="flex items-center gap-2"
										>
											<Plus size={18} />
											Agregar
										</Button>
									</div>
								</div>

								{errors.detalles && (
									<p className="text-sm text-red-600">{errors.detalles}</p>
								)}
							</div>
						</Card>

						{/* Products List */}
						{productItems.length > 0 && (
							<Card title="Productos en la Venta">
								<div className="space-y-2">
									{productItems.map(item => (
										<div
											key={item.id_producto}
											className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
										>
											<div className="flex-1">
												<p className="font-medium text-gray-800">
													{item.nombre_comercial}
												</p>
												<p className="text-sm text-gray-600">
													S/ {item.precio_unitario_venta.toFixed(2)} c/u
												</p>
											</div>
											<div className="flex items-center gap-4">
												<div className="flex items-center gap-2">
													<label className="text-sm text-gray-600">Cant:</label>
													<Input
														type="number"
														value={item.cantidad}
														onChange={e =>
															handleUpdateQuantity(
																item.id_producto,
																parseInt(e.target.value) || 1,
															)
														}
														min="1"
														className="w-20"
													/>
												</div>
												<div className="w-28 text-right">
													<p className="font-semibold text-gray-800">
														S/{' '}
														{(item.cantidad * item.precio_unitario_venta).toFixed(2)}
													</p>
												</div>
												<button
													type="button"
													onClick={() => handleRemoveProduct(item.id_producto)}
													className="text-red-600 hover:text-red-800"
												>
													<Trash2 size={18} />
												</button>
											</div>
										</div>
									))}
								</div>
							</Card>
						)}
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						{/* Summary */}
						<Card title="Resumen">
							<div className="space-y-3">
								<div className="flex justify-between text-sm">
									<span className="text-gray-600">Productos:</span>
									<span className="font-medium">{productItems.length}</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-gray-600">Total Items:</span>
									<span className="font-medium">
										{productItems.reduce((sum, item) => sum + item.cantidad, 0)}
									</span>
								</div>
								<div className="pt-3 border-t border-gray-200">
									<div className="flex justify-between">
										<span className="font-medium text-gray-800">Total:</span>
										<span className="text-2xl font-bold text-green-600">
											S/ {calculateTotal().toFixed(2)}
										</span>
									</div>
								</div>
							</div>
						</Card>

						{/* Actions */}
						<Card>
							<div className="space-y-3">
								<Button
									type="submit"
									variant="primary"
									disabled={submitting || productItems.length === 0}
									className="w-full flex items-center justify-center gap-2"
								>
									<Save size={18} />
									{submitting ? 'Registrando...' : 'Registrar Venta'}
								</Button>
								<Button
									type="button"
									variant="secondary"
									onClick={() => navigate('/sales')}
									disabled={submitting}
									className="w-full"
								>
									Cancelar
								</Button>
							</div>
						</Card>

						{/* Help */}
						<Card title="Información">
							<div className="space-y-3 text-sm text-gray-600">
								<div className="flex items-start gap-2">
									<ShoppingCart className="text-primary-600 mt-0.5" size={16} />
									<p>
										Agrega productos a la venta seleccionando el producto y la cantidad.
									</p>
								</div>
								<div className="pt-3 border-t border-gray-200">
									<p className="font-medium text-gray-700 mb-2">Nota:</p>
									<p>
										Asegúrate de ingresar correctamente el número de comprobante para
										mantener el registro contable.
									</p>
								</div>
							</div>
						</Card>
					</div>
				</div>
			</form>
		</div>
	);
};

export default SaleForm;
