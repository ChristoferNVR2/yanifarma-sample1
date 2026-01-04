import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

import { productsService } from '@/api/services';
import type { Producto } from '@/types';
import {
	Button,
	Card,
	Table,
	SearchBar,
	Spinner,
	Badge,
} from '@/components/common';

const ProductsList = () => {
	const navigate = useNavigate();
	const [products, setProducts] = useState<Producto[]>([]);
	const [filteredProducts, setFilteredProducts] = useState<Producto[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');

	// Fetch products
	const fetchProducts = async () => {
		try {
			setLoading(true);
			const response = await productsService.getAll();
			setProducts(response.data);
			setFilteredProducts(response.data);
		} catch (error) {
			toast.error('Error al cargar productos');
			console.error('Error fetching products:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		void fetchProducts();
	}, []);

	// Handle search
	const handleSearch = (query: string) => {
		setSearchQuery(query);
		if (query.trim() === '') {
			setFilteredProducts(products);
		} else {
			const filtered = products.filter(
				product =>
					product.nombre_comercial
						.toLowerCase()
						.includes(query.toLowerCase()) ||
					product.codigo_interno.toLowerCase().includes(query.toLowerCase()),
			);
			setFilteredProducts(filtered);
		}
	};

	// Handle delete
	const handleDelete = async (id: number) => {
		if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;

		try {
			await productsService.delete(id);
			toast.success('Producto eliminado exitosamente');
			void fetchProducts();
		} catch (error) {
			toast.error('Error al eliminar producto');
			console.error('Error deleting product:', error);
		}
	};

	// Table columns
	const columns = [
		{
			header: 'Código',
			accessor: 'codigo_interno' as keyof Producto,
		},
		{
			header: 'Nombre Comercial',
			accessor: 'nombre_comercial' as keyof Producto,
		},
		{
			header: 'Precio',
			accessor: (row: Producto) => {
				const price =
					typeof row.precio_venta === 'number'
						? row.precio_venta
						: parseFloat(String(row.precio_venta));
				return `S/ ${price.toFixed(2)}`;
			},
		},
		{
			header: 'IGV',
			accessor: (row: Producto) =>
				row.afecta_igv ? (
					<Badge variant='success'>Sí</Badge>
				) : (
					<Badge variant='default'>No</Badge>
				),
		},
		{
			header: 'Receta',
			accessor: (row: Producto) =>
				row.requiere_receta ? (
					<Badge variant='warning'>Sí</Badge>
				) : (
					<Badge variant='default'>No</Badge>
				),
		},
		{
			header: 'Acciones',
			accessor: (row: Producto) => (
				<div className='flex space-x-2'>
					<button
						onClick={e => {
							e.stopPropagation();
							navigate(`/products/edit/${row.id_producto}`);
						}}
						className='text-primary-600 hover:text-primary-800'
						title='Editar'
					>
						<Edit size={18} />
					</button>
					<button
						onClick={e => {
							e.stopPropagation();
							void handleDelete(row.id_producto);
						}}
						className='text-danger-600 hover:text-danger-800'
						title='Eliminar'
					>
						<Trash2 size={18} />
					</button>
				</div>
			),
		},
	];

	if (loading) {
		return (
			<div className='flex items-center justify-center h-64'>
				<Spinner size='lg' />
			</div>
		);
	}

	return (
		<div>
			<div className='flex justify-between items-center mb-6'>
				<div>
					<h1 className='text-3xl font-bold text-gray-800'>Productos</h1>
					<p className='text-gray-600 mt-1'>
						Gestiona el catálogo de productos de la farmacia
					</p>
				</div>
				<Button
					variant='primary'
					onClick={() => navigate('/products/new')}
					className='flex items-center'
				>
					<Plus size={20} className='mr-2' />
					Nuevo Producto
				</Button>
			</div>

			<Card>
				{/* Search Bar */}
				<div className='mb-4'>
					<SearchBar
						value={searchQuery}
						onChange={e => handleSearch(e.target.value)}
						placeholder='Buscar por nombre o código...'
						className='max-w-md'
					/>
				</div>

				{/* Stats */}
				<div className='mb-4 flex items-center space-x-4 text-sm text-gray-600'>
					<span>
						Total: <strong>{filteredProducts.length}</strong> productos
					</span>
					{searchQuery && (
						<span>
							Mostrando resultados para:{' '}
							<strong>&ldquo;{searchQuery}&rdquo;</strong>
						</span>
					)}
				</div>

				{/* Table */}
				<Table
					data={filteredProducts}
					columns={columns}
					onRowClick={row => navigate(`/products/edit/${row.id_producto}`)}
					emptyMessage='No se encontraron productos'
				/>
			</Card>
		</div>
	);
};

export default ProductsList;
