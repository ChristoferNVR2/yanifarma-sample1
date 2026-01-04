import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

import { productsService } from '@/api/services';
import type { Producto, Categoria, Presentacion, Componente } from '@/types';
import { Button, Card, Input, Spinner, Modal } from '@/components/common';

// Validation schema
const productSchema = z.object({
	codigo_interno: z.string().min(1, 'Código interno es requerido'),
	nombre_comercial: z.string().min(1, 'Nombre comercial es requerido'),
	precio_venta: z.number().min(0, 'El precio debe ser mayor a 0'),
	afecta_igv: z.boolean(),
	requiere_receta: z.boolean(),
	categorias: z.array(z.number()).min(1, 'Selecciona al menos una categoría'),
	presentaciones: z.array(z.number()).min(1, 'Selecciona al menos una presentación'),
	componentes: z.array(z.number()).min(1, 'Selecciona al menos un componente'),
});

type ProductFormData = z.infer<typeof productSchema>;

const ProductForm = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const isEditMode = Boolean(id);

	const [loading, setLoading] = useState(false);
	const [initialLoading, setInitialLoading] = useState(isEditMode);

	// Lookup data
	const [categorias, setCategorias] = useState<Categoria[]>([]);
	const [presentaciones, setPresentaciones] = useState<Presentacion[]>([]);
	const [componentes, setComponentes] = useState<Componente[]>([]);

	// Selected items for multi-select
	const [selectedCategorias, setSelectedCategorias] = useState<number[]>([]);
	const [selectedPresentaciones, setSelectedPresentaciones] = useState<number[]>([]);
	const [selectedComponentes, setSelectedComponentes] = useState<number[]>([]);

	// Modal states
	const [showCategoriaModal, setShowCategoriaModal] = useState(false);
	const [showPresentacionModal, setShowPresentacionModal] = useState(false);
	const [showComponenteModal, setShowComponenteModal] = useState(false);

	// New item inputs
	const [newCategoria, setNewCategoria] = useState('');
	const [newPresentacion, setNewPresentacion] = useState('');
	const [newComponente, setNewComponente] = useState('');

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<ProductFormData>({
		resolver: zodResolver(productSchema),
		defaultValues: {
			afecta_igv: true,
			requiere_receta: false,
		},
	});

	// Load lookup data
	const loadLookupData = async () => {
		try {
			const [categoriasRes, presentacionesRes, componentesRes] = await Promise.all([
				productsService.getCategories(),
				productsService.getPresentations(),
				productsService.getComponents(),
			]);

			setCategorias(categoriasRes.data);
			setPresentaciones(presentacionesRes.data);
			setComponentes(componentesRes.data);
		} catch (error) {
			toast.error('Error al cargar datos del formulario');
			console.error('Error loading lookup data:', error);
		}
	};

	useEffect(() => {
		void loadLookupData();
	}, []);

	// Load product data if editing
	useEffect(() => {
		if (!isEditMode || !id) return;

		const loadProduct = async () => {
			try {
				setInitialLoading(true);
				const response = await productsService.getById(Number(id));
				const product: Producto = response.data;

				// Set form values
				setValue('codigo_interno', product.codigo_interno);
				setValue('nombre_comercial', product.nombre_comercial);
				setValue(
					'precio_venta',
					typeof product.precio_venta === 'number'
						? product.precio_venta
						: parseFloat(String(product.precio_venta)),
				);
				setValue('afecta_igv', product.afecta_igv);
				setValue('requiere_receta', product.requiere_receta);

				// TODO: Load related data (categorias, presentaciones, componentes)
				// This would require additional API calls to get the relationships
			} catch (error) {
				toast.error('Error al cargar producto');
				console.error('Error loading product:', error);
				navigate('/products');
			} finally {
				setInitialLoading(false);
			}
		};

		void loadProduct();
	}, [id, isEditMode, navigate, setValue]);

	// Handle multi-select toggle
	const toggleSelection = (
		id: number,
		selectedItems: number[],
		setSelectedItems: (items: number[]) => void,
	) => {
		if (selectedItems.includes(id)) {
			setSelectedItems(selectedItems.filter(item => item !== id));
		} else {
			setSelectedItems([...selectedItems, id]);
		}
	};

	// Update form values when selections change
	useEffect(() => {
		setValue('categorias', selectedCategorias);
	}, [selectedCategorias, setValue]);

	useEffect(() => {
		setValue('presentaciones', selectedPresentaciones);
	}, [selectedPresentaciones, setValue]);

	useEffect(() => {
		setValue('componentes', selectedComponentes);
	}, [selectedComponentes, setValue]);

	// Create new Categoria
	const handleCreateCategoria = async () => {
		if (!newCategoria.trim()) {
			toast.error('Ingresa un nombre para la categoría');
			return;
		}

		try {
			const response = await productsService.createCategory(newCategoria);
			toast.success('Categoría creada exitosamente');

			// Reload categories
			await loadLookupData();

			// Auto-select the new category
			setSelectedCategorias([...selectedCategorias, response.data.id_categoria]);

			// Close modal and reset
			setShowCategoriaModal(false);
			setNewCategoria('');
		} catch (error) {
			toast.error('Error al crear categoría');
			console.error('Error creating categoria:', error);
		}
	};

	// Create new Presentacion
	const handleCreatePresentacion = async () => {
		if (!newPresentacion.trim()) {
			toast.error('Ingresa una descripción para la presentación');
			return;
		}

		try {
			const response = await productsService.createPresentation(newPresentacion);
			toast.success('Presentación creada exitosamente');

			// Reload presentations
			await loadLookupData();

			// Auto-select the new presentation
			setSelectedPresentaciones([...selectedPresentaciones, response.data.id_presentacion]);

			// Close modal and reset
			setShowPresentacionModal(false);
			setNewPresentacion('');
		} catch (error) {
			toast.error('Error al crear presentación');
			console.error('Error creating presentacion:', error);
		}
	};

	// Create new Componente
	const handleCreateComponente = async () => {
		if (!newComponente.trim()) {
			toast.error('Ingresa un nombre para el componente');
			return;
		}

		try {
			const response = await productsService.createComponent(newComponente);
			toast.success('Componente creado exitosamente');

			// Reload components
			await loadLookupData();

			// Auto-select the new component
			setSelectedComponentes([...selectedComponentes, response.data.id_componente]);

			// Close modal and reset
			setShowComponenteModal(false);
			setNewComponente('');
		} catch (error) {
			toast.error('Error al crear componente');
			console.error('Error creating componente:', error);
		}
	};

	// Delete Categoria
	const handleDeleteCategoria = async (categoriaId: number, nombre: string) => {
		if (!window.confirm(`¿Estás seguro de eliminar la categoría "${nombre}"?`)) return;

		try {
			// Note: You'll need to add delete endpoints to your API service
			await fetch(`http://localhost:8000/api/categorias/${categoriaId}`, {
				method: 'DELETE',
			});

			toast.success('Categoría eliminada exitosamente');

			// Remove from selected if it was selected
			setSelectedCategorias(selectedCategorias.filter(id => id !== categoriaId));

			// Reload categories
			await loadLookupData();
		} catch (error) {
			toast.error('Error al eliminar categoría');
			console.error('Error deleting categoria:', error);
		}
	};

	// Delete Presentacion
	const handleDeletePresentacion = async (presentacionId: number, desc: string) => {
		if (!window.confirm(`¿Estás seguro de eliminar la presentación "${desc}"?`)) return;

		try {
			await fetch(`http://localhost:8000/api/presentaciones/${presentacionId}`, {
				method: 'DELETE',
			});

			toast.success('Presentación eliminada exitosamente');

			// Remove from selected if it was selected
			setSelectedPresentaciones(selectedPresentaciones.filter(id => id !== presentacionId));

			// Reload presentations
			await loadLookupData();
		} catch (error) {
			toast.error('Error al eliminar presentación');
			console.error('Error deleting presentacion:', error);
		}
	};

	// Delete Componente
	const handleDeleteComponente = async (componenteId: number, nombre: string) => {
		if (!window.confirm(`¿Estás seguro de eliminar el componente "${nombre}"?`)) return;

		try {
			await fetch(`http://localhost:8000/api/componentes/${componenteId}`, {
				method: 'DELETE',
			});

			toast.success('Componente eliminado exitosamente');

			// Remove from selected if it was selected
			setSelectedComponentes(selectedComponentes.filter(id => id !== componenteId));

			// Reload components
			await loadLookupData();
		} catch (error) {
			toast.error('Error al eliminar componente');
			console.error('Error deleting componente:', error);
		}
	};

	// Handle form submit
	const onSubmit = async (data: ProductFormData) => {
		try {
			setLoading(true);

			if (isEditMode && id) {
				await productsService.update(Number(id), data);
				toast.success('Producto actualizado exitosamente');
			} else {
				await productsService.create(data);
				toast.success('Producto creado exitosamente');
			}

			navigate('/products');
		} catch (error) {
			toast.error(
				isEditMode ? 'Error al actualizar producto' : 'Error al crear producto',
			);
			console.error('Error saving product:', error);
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

	return (
		<div>
			{/* Header */}
			<div className="mb-6">
				<button
					onClick={() => navigate('/products')}
					className="flex items-center text-primary-600 hover:text-primary-800 mb-4"
				>
					<ArrowLeft size={20} className="mr-2" />
					Volver a Productos
				</button>
				<h1 className="text-3xl font-bold text-gray-800">
					{isEditMode ? 'Editar Producto' : 'Nuevo Producto'}
				</h1>
				<p className="text-gray-600 mt-1">
					{isEditMode
						? 'Actualiza la información del producto'
						: 'Completa los datos del nuevo producto'}
				</p>
			</div>

			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Main Information */}
					<div className="lg:col-span-2">
						<Card title="Información General">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<Input
									label="Código Interno"
									{...register('codigo_interno')}
									error={errors.codigo_interno?.message}
									placeholder="P-001"
									required
								/>

								<Input
									label="Nombre Comercial"
									{...register('nombre_comercial')}
									error={errors.nombre_comercial?.message}
									placeholder="Paracetamol 500mg"
									required
								/>

								<Input
									label="Precio de Venta (S/)"
									type="number"
									step="0.01"
									{...register('precio_venta', { valueAsNumber: true })}
									error={errors.precio_venta?.message}
									placeholder="10.50"
									required
								/>

								<div className="space-y-3">
									<label className="flex items-center space-x-2">
										<input
											type="checkbox"
											{...register('afecta_igv')}
											className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
										/>
										<span className="text-sm font-medium text-gray-700">
											Afecta IGV
										</span>
									</label>

									<label className="flex items-center space-x-2">
										<input
											type="checkbox"
											{...register('requiere_receta')}
											className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
										/>
										<span className="text-sm font-medium text-gray-700">
											Requiere Receta
										</span>
									</label>
								</div>
							</div>
						</Card>
					</div>

					{/* Categories */}
					<div>
						<Card title="Categorías" className="h-full">
							<div className="flex justify-between items-center mb-3">
								<span className="text-sm text-gray-600">Selecciona categorías</span>
								<button
									type="button"
									onClick={() => setShowCategoriaModal(true)}
									className="flex items-center text-primary-600 hover:text-primary-800 text-sm"
								>
									<Plus size={16} className="mr-1" />
									Nueva
								</button>
							</div>
							<div className="space-y-2 max-h-64 overflow-y-auto">
								{categorias.map(categoria => (
									<div
										key={categoria.id_categoria}
										className="flex items-center justify-between group hover:bg-gray-50 p-2 rounded"
									>
										<label className="flex items-center space-x-2 cursor-pointer flex-1">
											<input
												type="checkbox"
												checked={selectedCategorias.includes(categoria.id_categoria)}
												onChange={() =>
													toggleSelection(
														categoria.id_categoria,
														selectedCategorias,
														setSelectedCategorias,
													)
												}
												className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
											/>
											<span className="text-sm text-gray-700">
												{categoria.nombre_categoria}
											</span>
										</label>
										<button
											type="button"
											onClick={() =>
												void handleDeleteCategoria(
													categoria.id_categoria,
													categoria.nombre_categoria,
												)
											}
											className="opacity-0 group-hover:opacity-100 text-danger-600 hover:text-danger-800 transition-opacity"
											title="Eliminar"
										>
											<Trash2 size={16} />
										</button>
									</div>
								))}
								{errors.categorias && (
									<p className="text-sm text-danger-600">{errors.categorias.message}</p>
								)}
							</div>
						</Card>
					</div>

					{/* Presentations */}
					<div>
						<Card title="Presentaciones" className="h-full">
							<div className="flex justify-between items-center mb-3">
								<span className="text-sm text-gray-600">Selecciona presentaciones</span>
								<button
									type="button"
									onClick={() => setShowPresentacionModal(true)}
									className="flex items-center text-primary-600 hover:text-primary-800 text-sm"
								>
									<Plus size={16} className="mr-1" />
									Nueva
								</button>
							</div>
							<div className="space-y-2 max-h-64 overflow-y-auto">
								{presentaciones.map(presentacion => (
									<div
										key={presentacion.id_presentacion}
										className="flex items-center justify-between group hover:bg-gray-50 p-2 rounded"
									>
										<label className="flex items-center space-x-2 cursor-pointer flex-1">
											<input
												type="checkbox"
												checked={selectedPresentaciones.includes(
													presentacion.id_presentacion,
												)}
												onChange={() =>
													toggleSelection(
														presentacion.id_presentacion,
														selectedPresentaciones,
														setSelectedPresentaciones,
													)
												}
												className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
											/>
											<span className="text-sm text-gray-700">
												{presentacion.desc_presentacion}
											</span>
										</label>
										<button
											type="button"
											onClick={() =>
												void handleDeletePresentacion(
													presentacion.id_presentacion,
													presentacion.desc_presentacion,
												)
											}
											className="opacity-0 group-hover:opacity-100 text-danger-600 hover:text-danger-800 transition-opacity"
											title="Eliminar"
										>
											<Trash2 size={16} />
										</button>
									</div>
								))}
								{errors.presentaciones && (
									<p className="text-sm text-danger-600">
										{errors.presentaciones.message}
									</p>
								)}
							</div>
						</Card>
					</div>

					{/* Components */}
					<div>
						<Card title="Componentes" className="h-full">
							<div className="flex justify-between items-center mb-3">
								<span className="text-sm text-gray-600">Selecciona componentes</span>
								<button
									type="button"
									onClick={() => setShowComponenteModal(true)}
									className="flex items-center text-primary-600 hover:text-primary-800 text-sm"
								>
									<Plus size={16} className="mr-1" />
									Nuevo
								</button>
							</div>
							<div className="space-y-2 max-h-64 overflow-y-auto">
								{componentes.map(componente => (
									<div
										key={componente.id_componente}
										className="flex items-center justify-between group hover:bg-gray-50 p-2 rounded"
									>
										<label className="flex items-center space-x-2 cursor-pointer flex-1">
											<input
												type="checkbox"
												checked={selectedComponentes.includes(componente.id_componente)}
												onChange={() =>
													toggleSelection(
														componente.id_componente,
														selectedComponentes,
														setSelectedComponentes,
													)
												}
												className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
											/>
											<span className="text-sm text-gray-700">
												{componente.nombre_componente}
											</span>
										</label>
										<button
											type="button"
											onClick={() =>
												void handleDeleteComponente(
													componente.id_componente,
													componente.nombre_componente,
												)
											}
											className="opacity-0 group-hover:opacity-100 text-danger-600 hover:text-danger-800 transition-opacity"
											title="Eliminar"
										>
											<Trash2 size={16} />
										</button>
									</div>
								))}
								{errors.componentes && (
									<p className="text-sm text-danger-600">{errors.componentes.message}</p>
								)}
							</div>
						</Card>
					</div>
				</div>

				{/* Form Actions */}
				<div className="mt-6 flex justify-end space-x-4">
					<Button type="button" variant="secondary" onClick={() => navigate('/products')}>
						Cancelar
					</Button>
					<Button type="submit" variant="primary" loading={loading}>
						{isEditMode ? 'Actualizar Producto' : 'Crear Producto'}
					</Button>
				</div>
			</form>

			{/* Modal: New Categoria */}
			<Modal
				isOpen={showCategoriaModal}
				onClose={() => {
					setShowCategoriaModal(false);
					setNewCategoria('');
				}}
				title="Nueva Categoría"
				size="sm"
			>
				<div className="space-y-4">
					<Input
						label="Nombre de la Categoría"
						value={newCategoria}
						onChange={e => setNewCategoria(e.target.value)}
						placeholder="Ej: Analgésico"
						autoFocus
					/>
					<div className="flex justify-end space-x-3">
						<Button
							variant="secondary"
							onClick={() => {
								setShowCategoriaModal(false);
								setNewCategoria('');
							}}
						>
							Cancelar
						</Button>
						<Button variant="primary" onClick={() => void handleCreateCategoria()}>
							Crear
						</Button>
					</div>
				</div>
			</Modal>

			{/* Modal: New Presentacion */}
			<Modal
				isOpen={showPresentacionModal}
				onClose={() => {
					setShowPresentacionModal(false);
					setNewPresentacion('');
				}}
				title="Nueva Presentación"
				size="sm"
			>
				<div className="space-y-4">
					<Input
						label="Descripción de la Presentación"
						value={newPresentacion}
						onChange={e => setNewPresentacion(e.target.value)}
						placeholder="Ej: Caja x 10 tabletas"
						autoFocus
					/>
					<div className="flex justify-end space-x-3">
						<Button
							variant="secondary"
							onClick={() => {
								setShowPresentacionModal(false);
								setNewPresentacion('');
							}}
						>
							Cancelar
						</Button>
						<Button variant="primary" onClick={() => void handleCreatePresentacion()}>
							Crear
						</Button>
					</div>
				</div>
			</Modal>

			{/* Modal: New Componente */}
			<Modal
				isOpen={showComponenteModal}
				onClose={() => {
					setShowComponenteModal(false);
					setNewComponente('');
				}}
				title="Nuevo Componente"
				size="sm"
			>
				<div className="space-y-4">
					<Input
						label="Nombre del Componente"
						value={newComponente}
						onChange={e => setNewComponente(e.target.value)}
						placeholder="Ej: Paracetamol 500mg"
						autoFocus
					/>
					<div className="flex justify-end space-x-3">
						<Button
							variant="secondary"
							onClick={() => {
								setShowComponenteModal(false);
								setNewComponente('');
							}}
						>
							Cancelar
						</Button>
						<Button variant="primary" onClick={() => void handleCreateComponente()}>
							Crear
						</Button>
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default ProductForm;
