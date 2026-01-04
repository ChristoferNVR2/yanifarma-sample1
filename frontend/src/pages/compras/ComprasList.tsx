import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Plus, Eye, Edit, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

import { comprasService } from '@/api/services';
import type { Compra } from '@/types';
import { Card, Table, Button, Spinner, Badge, SearchBar } from '@/components/common';

const ComprasList = () => {
	const navigate = useNavigate();
	const [compras, setCompras] = useState<Compra[]>([]);
	const [filteredCompras, setFilteredCompras] = useState<Compra[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const [filterStatus, setFilterStatus] = useState<'all' | string>('all');

	// Fetch compras
	const fetchCompras = async () => {
		try {
			setLoading(true);
			const response = await comprasService.getAll();
			setCompras(response.data);
			setFilteredCompras(response.data);
		} catch (error) {
			toast.error('Error al cargar compras');
			console.error('Error fetching compras:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		void fetchCompras();
	}, []);

	// Handle search and filter
	useEffect(() => {
		let filtered = compras;

		// Apply search filter
		if (searchQuery.trim() !== '') {
			filtered = filtered.filter(
				compra =>
					compra.id_compra.toString().includes(searchQuery) ||
					compra.nro_guia?.toLowerCase().includes(searchQuery.toLowerCase()) ||
					compra.nro_comprobante?.toLowerCase().includes(searchQuery.toLowerCase()),
			);
		}

		// Apply status filter
		if (filterStatus !== 'all') {
			filtered = filtered.filter(compra => compra.estado === filterStatus);
		}

		setFilteredCompras(filtered);
	}, [searchQuery, filterStatus, compras]);

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
			month: '2-digit',
			day: '2-digit',
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

	// Calculate statistics
	const stats = {
		total: compras.length,
		pagadas: compras.filter(c => c.estado.toLowerCase() === 'pagado').length,
		pendientes: compras.filter(c => c.estado.toLowerCase() === 'pendiente').length,
		totalMonto: compras.reduce((sum, c) => sum + parseFloat(c.monto_total.toString()), 0),
	};

	// Table columns
	const columns = [
		{
			header: 'N° Compra',
			accessor: (row: Compra) => `#${row.id_compra}`,
		},
		{
			header: 'N° Pedido',
			accessor: (row: Compra) => `#${row.id_pedido}`,
		},
		{
			header: 'Fecha Recepción',
			accessor: (row: Compra) => formatDate(row.fecha_recepcion),
		},
		{
			header: 'N° Guía',
			accessor: (row: Compra) => row.nro_guia || '-',
		},
		{
			header: 'Comprobante',
			accessor: (row: Compra) =>
				row.nro_comprobante ? `${row.tipo_comprobante} ${row.nro_comprobante}` : '-',
		},
		{
			header: 'Monto Total',
			accessor: (row: Compra) => formatCurrency(row.monto_total),
		},
		{
			header: 'Estado',
			accessor: (row: Compra) => getStatusBadge(row.estado),
		},
		{
			header: 'Acciones',
			accessor: (row: Compra) => (
				<div className="flex items-center gap-2">
					<button
						onClick={e => {
							e.stopPropagation();
							navigate(`/compras/${row.id_compra}`);
						}}
						className="text-primary-600 hover:text-primary-800"
						title="Ver detalles"
					>
						<Eye size={18} />
					</button>
					<button
						onClick={e => {
							e.stopPropagation();
							navigate(`/compras/edit/${row.id_compra}`);
						}}
						className="text-blue-600 hover:text-blue-800"
						title="Editar"
					>
						<Edit size={18} />
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
						<h1 className="text-3xl font-bold text-gray-800">Compras</h1>
						<p className="text-gray-600 mt-1">Gestión de recepciones y pagos a proveedores</p>
					</div>
					<Button
						variant="primary"
						onClick={() => navigate('/compras/new')}
						className="flex items-center gap-2"
					>
						<Plus size={20} />
						Nueva Compra
					</Button>
				</div>
			</div>

			{/* Statistics Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
				<Card padding={false}>
					<div className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">Total Compras</p>
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
								<p className="text-sm text-gray-600">Pendientes</p>
								<p className="text-2xl font-bold text-yellow-600">{stats.pendientes}</p>
							</div>
							<FileText className="text-yellow-600" size={32} />
						</div>
					</div>
				</Card>

				<Card padding={false}>
					<div className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">Pagadas</p>
								<p className="text-2xl font-bold text-green-600">{stats.pagadas}</p>
							</div>
							<FileText className="text-green-600" size={32} />
						</div>
					</div>
				</Card>

				<Card padding={false}>
					<div className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">Monto Total</p>
								<p className="text-xl font-bold text-primary-600">
									{formatCurrency(stats.totalMonto)}
								</p>
							</div>
							<Package className="text-primary-600" size={32} />
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
						placeholder="Buscar por N° compra, guía o comprobante..."
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
							onClick={() => setFilterStatus('Pendiente')}
							className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
								filterStatus === 'Pendiente'
									? 'bg-yellow-600 text-white'
									: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
							}`}
						>
							Pendientes
						</button>
						<button
							onClick={() => setFilterStatus('Pagado')}
							className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
								filterStatus === 'Pagado'
									? 'bg-green-600 text-white'
									: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
							}`}
						>
							Pagadas
						</button>
					</div>
				</div>

				{/* Results Info */}
				<div className="mb-4 flex items-center space-x-4 text-sm text-gray-600">
					<span>
						Mostrando: <strong>{filteredCompras.length}</strong> compras
					</span>
					{searchQuery && (
						<span>
							Búsqueda: <strong>&ldquo;{searchQuery}&rdquo;</strong>
						</span>
					)}
					{filterStatus !== 'all' && (
						<span>
							Filtro: <strong>{filterStatus}</strong>
						</span>
					)}
				</div>

				{/* Table */}
				<Table
					data={filteredCompras}
					columns={columns}
					onRowClick={row => navigate(`/compras/${row.id_compra}`)}
					emptyMessage="No se encontraron compras"
				/>
			</Card>
		</div>
	);
};

export default ComprasList;
