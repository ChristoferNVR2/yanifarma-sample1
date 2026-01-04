import { useEffect, useState } from 'react';
import { Package, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

import { inventoryService } from '@/api/services';
import type { Inventario } from '@/types';
import { Card, Table, SearchBar, Spinner, Badge } from '@/components/common';

const InventoryList = () => {
	const [inventory, setInventory] = useState<Inventario[]>([]);
	const [filteredInventory, setFilteredInventory] = useState<Inventario[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const [filterStatus, setFilterStatus] = useState<'all' | 'low' | 'medium' | 'high'>('all');

	// Fetch inventory
	const fetchInventory = async () => {
		try {
			setLoading(true);
			const response = await inventoryService.getAll();
			setInventory(response.data);
			setFilteredInventory(response.data);
		} catch (error) {
			toast.error('Error al cargar inventario');
			console.error('Error fetching inventory:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		void fetchInventory();
	}, []);

	// Calculate stock level based on stock_actual
	const getStockLevel = (stockActual: number): 'low' | 'medium' | 'high' => {
		if (stockActual <= 20) return 'low';
		if (stockActual <= 50) return 'medium';
		return 'high';
	};

	// Check if product is near expiration (within 3 months)
	const isNearExpiration = (fechaVencimiento: string): boolean => {
		const expirationDate = new Date(fechaVencimiento);
		const today = new Date();
		const threeMonthsFromNow = new Date();
		threeMonthsFromNow.setMonth(today.getMonth() + 3);

		return expirationDate <= threeMonthsFromNow && expirationDate > today;
	};

	// Check if product is expired
	const isExpired = (fechaVencimiento: string): boolean => {
		const expirationDate = new Date(fechaVencimiento);
		const today = new Date();
		return expirationDate < today;
	};

	// Handle search and filter
	useEffect(() => {
		let filtered = inventory;

		// Apply search filter
		if (searchQuery.trim() !== '') {
			filtered = filtered.filter(item =>
				item.codigo_lote.toLowerCase().includes(searchQuery.toLowerCase()),
			);
		}

		// Apply stock level filter
		if (filterStatus !== 'all') {
			filtered = filtered.filter(item => getStockLevel(item.stock_actual) === filterStatus);
		}

		setFilteredInventory(filtered);
	}, [searchQuery, filterStatus, inventory]);

	// Get stock badge
	const getStockBadge = (stockActual: number) => {
		const level = getStockLevel(stockActual);

		if (level === 'low') {
			return (
				<Badge variant="danger" className="flex items-center gap-1">
					<XCircle size={14} />
					Bajo
				</Badge>
			);
		}
		if (level === 'medium') {
			return (
				<Badge variant="warning" className="flex items-center gap-1">
					<AlertTriangle size={14} />
					Medio
				</Badge>
			);
		}
		return (
			<Badge variant="success" className="flex items-center gap-1">
				<CheckCircle size={14} />
				Alto
			</Badge>
		);
	};

	// Get expiration badge
	const getExpirationBadge = (fechaVencimiento: string) => {
		if (isExpired(fechaVencimiento)) {
			return <Badge variant="danger">Vencido</Badge>;
		}
		if (isNearExpiration(fechaVencimiento)) {
			return <Badge variant="warning">Próximo a vencer</Badge>;
		}
		return <Badge variant="success">Vigente</Badge>;
	};

	// Format date
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('es-PE', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
		});
	};

	// Calculate statistics
	const stats = {
		total: inventory.length,
		low: inventory.filter(item => getStockLevel(item.stock_actual) === 'low').length,
		medium: inventory.filter(item => getStockLevel(item.stock_actual) === 'medium').length,
		high: inventory.filter(item => getStockLevel(item.stock_actual) === 'high').length,
		expired: inventory.filter(item => isExpired(item.fecha_vencimiento)).length,
		nearExpiration: inventory.filter(item => isNearExpiration(item.fecha_vencimiento)).length,
	};

	// Table columns
	const columns = [
		{
			header: 'Lote',
			accessor: 'codigo_lote' as keyof Inventario,
		},
		{
			header: 'Stock Actual',
			accessor: (row: Inventario) => (
				<div className="flex items-center gap-2">
					<span className="font-semibold">{row.stock_actual}</span>
					{getStockBadge(row.stock_actual)}
				</div>
			),
		},
		{
			header: 'Precio Compra',
			accessor: (row: Inventario) => {
				const price =
					typeof row.precio_compra_unitario === 'number'
						? row.precio_compra_unitario
						: parseFloat(String(row.precio_compra_unitario));
				return `S/ ${price.toFixed(2)}`;
			},
		},
		{
			header: 'Ubicación',
			accessor: 'ubicacion_estante' as keyof Inventario,
		},
		{
			header: 'Fecha Vencimiento',
			accessor: (row: Inventario) => (
				<div className="flex flex-col gap-1">
					<span className="text-sm">{formatDate(row.fecha_vencimiento)}</span>
					{getExpirationBadge(row.fecha_vencimiento)}
				</div>
			),
		},
	];

	if (loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<Spinner size="lg" />
			</div>
		);
	}

	return (
		<div>
			<div className="mb-6">
				<h1 className="text-3xl font-bold text-gray-800">Inventario</h1>
				<p className="text-gray-600 mt-1">Control de stock y fechas de vencimiento</p>
			</div>

			{/* Statistics Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
				<Card padding={false}>
					<div className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">Total Items</p>
								<p className="text-2xl font-bold text-gray-800">{stats.total}</p>
							</div>
							<Package className="text-primary-600" size={32} />
						</div>
					</div>
				</Card>

				<Card padding={false}>
					<div className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">Stock Alto</p>
								<p className="text-2xl font-bold text-green-600">{stats.high}</p>
							</div>
							<CheckCircle className="text-green-600" size={32} />
						</div>
					</div>
				</Card>

				<Card padding={false}>
					<div className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">Stock Medio</p>
								<p className="text-2xl font-bold text-yellow-600">{stats.medium}</p>
							</div>
							<AlertTriangle className="text-yellow-600" size={32} />
						</div>
					</div>
				</Card>

				<Card padding={false}>
					<div className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">Stock Bajo</p>
								<p className="text-2xl font-bold text-red-600">{stats.low}</p>
							</div>
							<XCircle className="text-red-600" size={32} />
						</div>
					</div>
				</Card>

				<Card padding={false}>
					<div className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">Próx. a Vencer</p>
								<p className="text-2xl font-bold text-orange-600">{stats.nearExpiration}</p>
							</div>
							<AlertTriangle className="text-orange-600" size={32} />
						</div>
					</div>
				</Card>

				<Card padding={false}>
					<div className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">Vencidos</p>
								<p className="text-2xl font-bold text-red-600">{stats.expired}</p>
							</div>
							<XCircle className="text-red-600" size={32} />
						</div>
					</div>
				</Card>
			</div>

			<Card>
				{/* Filters */}
				<div className="mb-4 flex flex-col sm:flex-row gap-4">
					<SearchBar
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
						placeholder="Buscar por código de lote..."
						className="flex-1"
					/>

					<div className="flex gap-2">
						<button
							onClick={() => setFilterStatus('all')}
							className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
								filterStatus === 'all'
									? 'bg-primary-600 text-white'
									: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
							}`}
						>
							Todos
						</button>
						<button
							onClick={() => setFilterStatus('low')}
							className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
								filterStatus === 'low'
									? 'bg-red-600 text-white'
									: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
							}`}
						>
							Stock Bajo
						</button>
						<button
							onClick={() => setFilterStatus('medium')}
							className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
								filterStatus === 'medium'
									? 'bg-yellow-600 text-white'
									: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
							}`}
						>
							Stock Medio
						</button>
						<button
							onClick={() => setFilterStatus('high')}
							className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
								filterStatus === 'high'
									? 'bg-green-600 text-white'
									: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
							}`}
						>
							Stock Alto
						</button>
					</div>
				</div>

				{/* Results Info */}
				<div className="mb-4 flex items-center space-x-4 text-sm text-gray-600">
					<span>
						Mostrando: <strong>{filteredInventory.length}</strong> items
					</span>
					{searchQuery && (
						<span>
							Búsqueda: <strong>&ldquo;{searchQuery}&rdquo;</strong>
						</span>
					)}
					{filterStatus !== 'all' && (
						<span>
							Filtro: <strong className="capitalize">{filterStatus}</strong>
						</span>
					)}
				</div>

				{/* Table */}
				<Table
					data={filteredInventory}
					columns={columns}
					emptyMessage="No se encontraron items en el inventario"
				/>
			</Card>
		</div>
	);
};

export default InventoryList;
