import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Eye, Calendar, DollarSign, TrendingUp, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

import { salesService } from '@/api/services';
import type { Venta } from '@/types';
import { Card, Table, Button, Spinner, SearchBar } from '@/components/common';

const SalesHistory = () => {
	const navigate = useNavigate();
	const [ventas, setVentas] = useState<Venta[]>([]);
	const [filteredVentas, setFilteredVentas] = useState<Venta[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const [dateFilter, setDateFilter] = useState({
		from: '',
		to: '',
	});

	// Fetch ventas
	const fetchVentas = async () => {
		try {
			setLoading(true);
			const response = await salesService.getAll();
			setVentas(response.data);
			setFilteredVentas(response.data);
		} catch (error) {
			toast.error('Error al cargar ventas');
			console.error('Error fetching ventas:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		void fetchVentas();
	}, []);

	// Handle search and filter
	useEffect(() => {
		let filtered = ventas;

		// Apply search filter
		if (searchQuery.trim() !== '') {
			filtered = filtered.filter(
				venta =>
					venta.id_venta.toString().includes(searchQuery) ||
					venta.id_cliente.toString().includes(searchQuery),
			);
		}

		// Apply date filter
		if (dateFilter.from) {
			filtered = filtered.filter(venta => venta.fecha_venta >= dateFilter.from);
		}
		if (dateFilter.to) {
			filtered = filtered.filter(venta => venta.fecha_venta <= dateFilter.to);
		}

		setFilteredVentas(filtered);
	}, [searchQuery, dateFilter, ventas]);

	// Format date
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('es-PE', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
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

	// Calculate statistics
	const stats = {
		total: ventas.length,
		totalMonto: ventas.reduce((sum, v) => sum + parseFloat(v.monto_total.toString()), 0),
		avgTicket:
			ventas.length > 0
				? ventas.reduce((sum, v) => sum + parseFloat(v.monto_total.toString()), 0) /
					ventas.length
				: 0,
		today: ventas.filter(v => v.fecha_venta === new Date().toISOString().split('T')[0]).length,
	};

	// Table columns
	const columns = [
		{
			header: 'N° Venta',
			accessor: (row: Venta) => `#${row.id_venta}`,
		},
		{
			header: 'Fecha',
			accessor: (row: Venta) => formatDate(row.fecha_venta),
		},
		{
			header: 'Hora',
			accessor: (row: Venta) => formatTime(row.hora_venta),
		},
		{
			header: 'Cliente',
			accessor: (row: Venta) => `Cliente #${row.id_cliente}`,
		},
		{
			header: 'Usuario',
			accessor: (row: Venta) => `Usuario #${row.id_usuario}`,
		},
		{
			header: 'Monto Total',
			accessor: (row: Venta) => (
				<span className="font-semibold text-green-600">
					{formatCurrency(row.monto_total)}
				</span>
			),
		},
		{
			header: 'Acciones',
			accessor: (row: Venta) => (
				<div className="flex items-center gap-2">
					<button
						onClick={e => {
							e.stopPropagation();
							navigate(`/sales/${row.id_venta}`);
						}}
						className="text-primary-600 hover:text-primary-800"
						title="Ver detalles"
					>
						<Eye size={18} />
					</button>
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
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold text-gray-800">Historial de Ventas</h1>
						<p className="text-gray-600 mt-1">Consulta y seguimiento de ventas realizadas</p>
					</div>
					<Button
						variant="primary"
						onClick={() => navigate('/sales/new')}
						className="flex items-center gap-2"
					>
						<Plus size={20} />
						Nueva Venta
					</Button>
				</div>
			</div>

			{/* Statistics Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
				<Card padding={false}>
					<div className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">Total Ventas</p>
								<p className="text-2xl font-bold text-gray-800">{stats.total}</p>
							</div>
							<ShoppingCart className="text-primary-600" size={32} />
						</div>
					</div>
				</Card>

				<Card padding={false}>
					<div className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">Ventas Hoy</p>
								<p className="text-2xl font-bold text-blue-600">{stats.today}</p>
							</div>
							<Calendar className="text-blue-600" size={32} />
						</div>
					</div>
				</Card>

				<Card padding={false}>
					<div className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">Monto Total</p>
								<p className="text-xl font-bold text-green-600">
									{formatCurrency(stats.totalMonto)}
								</p>
							</div>
							<DollarSign className="text-green-600" size={32} />
						</div>
					</div>
				</Card>

				<Card padding={false}>
					<div className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">Ticket Promedio</p>
								<p className="text-xl font-bold text-purple-600">
									{formatCurrency(stats.avgTicket)}
								</p>
							</div>
							<TrendingUp className="text-purple-600" size={32} />
						</div>
					</div>
				</Card>
			</div>

			<Card>
				{/* Filters */}
				<div className="mb-4 space-y-4">
					<SearchBar
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
						placeholder="Buscar por N° venta o N° cliente..."
						className="w-full"
					/>

					<div className="flex flex-col sm:flex-row gap-4">
						<div className="flex-1">
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Fecha Desde
							</label>
							<input
								type="date"
								value={dateFilter.from}
								onChange={e =>
									setDateFilter(prev => ({ ...prev, from: e.target.value }))
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
							/>
						</div>
						<div className="flex-1">
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Fecha Hasta
							</label>
							<input
								type="date"
								value={dateFilter.to}
								onChange={e => setDateFilter(prev => ({ ...prev, to: e.target.value }))}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
							/>
						</div>
						<div className="flex items-end">
							<button
								onClick={() => setDateFilter({ from: '', to: '' })}
								className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
							>
								Limpiar Filtros
							</button>
						</div>
					</div>
				</div>

				{/* Results Info */}
				<div className="mb-4 flex items-center space-x-4 text-sm text-gray-600">
					<span>
						Mostrando: <strong>{filteredVentas.length}</strong> ventas
					</span>
					{searchQuery && (
						<span>
							Búsqueda: <strong>&ldquo;{searchQuery}&rdquo;</strong>
						</span>
					)}
					{(dateFilter.from || dateFilter.to) && (
						<span>
							Periodo:{' '}
							<strong>
								{dateFilter.from || '...'} - {dateFilter.to || '...'}
							</strong>
						</span>
					)}
				</div>

				{/* Table */}
				<Table
					data={filteredVentas}
					columns={columns}
					onRowClick={row => navigate(`/sales/${row.id_venta}`)}
					emptyMessage="No se encontraron ventas"
				/>
			</Card>
		</div>
	);
};

export default SalesHistory;
