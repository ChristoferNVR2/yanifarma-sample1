import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

import {
	pedidosService,
	suppliersService,
	productsService,
} from '@/api/services';
import type { Proveedor, Producto, EstadoPedido, MotivoPedido } from '@/types';
import { Button, Card, Input, Select, Spinner } from '@/components/common';

// Validation schema
const pedidoSchema = z.object({
	id_proveedor: z.number().min(1, 'Selecciona un proveedor'),
	id_motivo_pedido: z.number().min(1, 'Selecciona un motivo'),
	fecha_solicitud: z.string().min(1, 'Fecha de solicitud es requerida'),
	fecha_entrega_estimada: z.string().optional(),
	motivo: z.string().optional(),
});

type PedidoFormData = z.infer<typeof pedidoSchema>;

interface ProductoDetalle {
	id_producto: number;
	nombre_comercial: string;
	cantidad_solicitada: number;
}

const PedidoForm = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [initialLoading, setInitialLoading] = useState(true);

	// Lookup data
	const [proveedores, setProveedores] = useState<Proveedor[]>([]);
	const [productos, setProductos] = useState<Producto[]>([]);
	const [motivos, setMotivos] = useState<MotivoPedido[]>([]);

	// Product details
	const [productosDetalle, setProductosDetalle] = useState<ProductoDetalle[]>(
		[],
	);
	const [selectedProducto, setSelectedProducto] = useState<number>(0);
	const [cantidad, setCantidad] = useState<number>(1);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<PedidoFormData>({
		resolver: zodResolver(pedidoSchema),
		defaultValues: {
			fecha_solicitud: new Date().toISOString().split('T')[0], // Today's date
		},
	});

	// Load lookup data
	useEffect(() => {
		const loadData = async () => {
			try {
				setInitialLoading(true);
				const [proveedoresRes, productosRes, motivosRes] = await Promise.all([
					suppliersService.getAll(),
					productsService.getAll(),
					pedidosService.getMotivos(),
				]);

				setProveedores(proveedoresRes.data);
				setProductos(productosRes.data);
				setMotivos(motivosRes.data);
			} catch (error) {
				toast.error('Error al cargar datos del formulario');
				console.error('Error loading form data:', error);
			} finally {
				setInitialLoading(false);
			}
		};

		void loadData();
	}, []);

	// Add product to order
	const handleAddProducto = () => {
		if (selectedProducto === 0) {
			toast.error('Selecciona un producto');
			return;
		}

		if (cantidad <= 0) {
			toast.error('La cantidad debe ser mayor a 0');
			return;
		}

		// Check if product already exists
		const exists = productosDetalle.find(
			p => p.id_producto === selectedProducto,
		);
		if (exists) {
			toast.error('Este producto ya fue agregado');
			return;
		}

		const producto = productos.find(p => p.id_producto === selectedProducto);
		if (!producto) return;

		setProductosDetalle([
			...productosDetalle,
			{
				id_producto: selectedProducto,
				nombre_comercial: producto.nombre_comercial,
				cantidad_solicitada: cantidad,
			},
		]);

		// Reset
		setSelectedProducto(0);
		setCantidad(1);
		toast.success('Producto agregado');
	};

	// Remove product from order
	const handleRemoveProducto = (id_producto: number) => {
		setProductosDetalle(
			productosDetalle.filter(p => p.id_producto !== id_producto),
		);
		toast.success('Producto eliminado');
	};

	// Handle form submit
	const onSubmit = async (data: PedidoFormData) => {
		// Validate products
		if (productosDetalle.length === 0) {
			toast.error('Debes agregar al menos un producto');
			return;
		}

		try {
			setLoading(true);

			// Prepare data
			const pedidoData = {
				id_proveedor: data.id_proveedor,
				id_estado_pedido: 60002, // En proceso
				id_motivo_pedido: data.id_motivo_pedido,
				fecha_solicitud: data.fecha_solicitud,
				fecha_entrega_estimada: data.fecha_entrega_estimada || undefined,
				motivo: data.motivo || undefined,
				detalles: productosDetalle.map(p => ({
					id_producto: p.id_producto,
					cantidad_solicitada: p.cantidad_solicitada,
				})),
			};

			await pedidosService.create(pedidoData);
			toast.success('Pedido creado exitosamente');
			navigate('/pedidos');
		} catch (error) {
			toast.error('Error al crear pedido');
			console.error('Error creating pedido:', error);
		} finally {
			setLoading(false);
		}
	};

	if (initialLoading) {
		return (
			<div className='flex items-center justify-center h-64'>
				<Spinner size='lg' />
			</div>
		);
	}

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
				<h1 className='text-3xl font-bold text-gray-800'>Nuevo Pedido</h1>
				<p className='text-gray-600 mt-1'>Crear orden de compra a proveedor</p>
			</div>

			<form onSubmit={handleSubmit(onSubmit)}>
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
					{/* Main Information */}
					<div className='lg:col-span-2 space-y-6'>
						<Card title='Información General'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<Select
									label='Proveedor'
									{...register('id_proveedor', { valueAsNumber: true })}
									error={errors.id_proveedor?.message}
									required
								>
									<option value=''>Seleccionar proveedor</option>
									{proveedores.map(proveedor => (
										<option
											key={proveedor.id_proveedor}
											value={proveedor.id_proveedor}
										>
											{proveedor.razon_social}
										</option>
									))}
								</Select>

								<Select
									label='Motivo del Pedido'
									{...register('id_motivo_pedido', { valueAsNumber: true })}
									error={errors.id_motivo_pedido?.message}
									required
								>
									<option value=''>Seleccionar motivo</option>
									{motivos.map(motivo => (
										<option
											key={motivo.id_motivo_pedido}
											value={motivo.id_motivo_pedido}
										>
											{motivo.descripcion}
										</option>
									))}
								</Select>

								<Input
									label='Fecha de Solicitud'
									type='date'
									{...register('fecha_solicitud')}
									error={errors.fecha_solicitud?.message}
									required
								/>

								<Input
									label='Fecha de Entrega Estimada'
									type='date'
									{...register('fecha_entrega_estimada')}
									error={errors.fecha_entrega_estimada?.message}
								/>

								<div className='md:col-span-2'>
									<Input
										label='Notas / Motivo Adicional'
										{...register('motivo')}
										error={errors.motivo?.message}
										placeholder='Información adicional sobre el pedido...'
									/>
								</div>
							</div>
						</Card>

						{/* Products List */}
						<Card title='Productos del Pedido'>
							<div className='space-y-4'>
								{/* Current products */}
								{productosDetalle.length > 0 ? (
									<div className='space-y-2'>
										{productosDetalle.map(producto => (
											<div
												key={producto.id_producto}
												className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'
											>
												<div className='flex-1'>
													<p className='font-medium text-gray-800'>
														{producto.nombre_comercial}
													</p>
													<p className='text-sm text-gray-600'>
														Cantidad: {producto.cantidad_solicitada} unidades
													</p>
												</div>
												<button
													type='button'
													onClick={() =>
														handleRemoveProducto(producto.id_producto)
													}
													className='text-red-600 hover:text-red-800'
													title='Eliminar'
												>
													<Trash2 size={18} />
												</button>
											</div>
										))}
									</div>
								) : (
									<div className='text-center py-8 text-gray-500'>
										No hay productos agregados. Usa el panel lateral para
										agregar productos.
									</div>
								)}
							</div>
						</Card>
					</div>

					{/* Add Products Panel */}
					<div>
						<Card title='Agregar Producto' className='sticky top-4'>
							<div className='space-y-4'>
								<Select
									label='Producto'
									value={selectedProducto}
									onChange={e => setSelectedProducto(Number(e.target.value))}
								>
									<option value={0}>Seleccionar producto</option>
									{productos.map(producto => (
										<option
											key={producto.id_producto}
											value={producto.id_producto}
										>
											{producto.nombre_comercial}
										</option>
									))}
								</Select>

								<Input
									label='Cantidad'
									type='number'
									min='1'
									value={cantidad}
									onChange={e => setCantidad(Number(e.target.value))}
								/>

								<Button
									type='button'
									variant='primary'
									onClick={handleAddProducto}
									className='w-full flex items-center justify-center gap-2'
								>
									<Plus size={18} />
									Agregar Producto
								</Button>

								<div className='pt-4 border-t border-gray-200'>
									<div className='text-sm text-gray-600'>
										<p className='font-medium mb-2'>Resumen:</p>
										<p>
											Productos: <strong>{productosDetalle.length}</strong>
										</p>
										<p>
											Total Unidades:{' '}
											<strong>
												{productosDetalle.reduce(
													(sum, p) => sum + p.cantidad_solicitada,
													0,
												)}
											</strong>
										</p>
									</div>
								</div>
							</div>
						</Card>
					</div>
				</div>

				{/* Form Actions */}
				<div className='mt-6 flex justify-end space-x-4'>
					<Button
						type='button'
						variant='secondary'
						onClick={() => navigate('/pedidos')}
					>
						Cancelar
					</Button>
					<Button type='submit' variant='primary' loading={loading}>
						Crear Pedido
					</Button>
				</div>
			</form>
		</div>
	);
};

export default PedidoForm;
