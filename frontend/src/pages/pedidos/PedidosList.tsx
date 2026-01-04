import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Plus, Eye, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

import { pedidosService } from '@/api/services';
import type { Pedido } from '@/types';
import { Card, Table, Button, Spinner, Badge, SearchBar } from '@/components/common';

const PedidosList = () => {
	const navigate = useNavigate();
	const [pedidos, setPedidos] = useState<Pedido[]>([]);
	const [filteredPedidos, setFilteredPedidos] = useState<Pedido[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const [filterStatus, setFilterStatus] = useState<'all' | number>('all');

	// Fetch pedidos
	const fetchPedidos = async () => {
		try {
			setLoading(true);
			const response = await pedidosService.getAll();
			setPedidos(response.data);
			setFilteredPedidos(response.data);
		} catch (error) {
			toast.error('Error al cargar pedidos');
			console.error('Error fetching pedidos:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		void fetchPedidos();
	}, []);

	// Handle search and filter
	useEffect(() => {
		let filtered = pedidos;

		// Apply search filter (by proveedor or pedido number)
		if (searchQuery.trim() !== '') {
			filtered = filtered.filter(
				pedido =>
					pedido.id_pedido.toString().includes(searchQuery) ||
					searchQuery.toLowerCase().includes('pedido'),
			);
		}

		// Apply status filter
		if (filterStatus !== 'all') {
			filtered = filtered.filter(pedido => pedido.id_estado_pedido === filterStatus);
		}

		setFilteredPedidos(filtered);
	}, [searchQuery, filterStatus, pedidos]);

	// Get status badge
	const getStatusBadge = (estadoId: number) => {
		switch (estadoId) {
			case 60001: // Entregado
				return <Badge variant="success">Entregado</Badge>;
			case 60002: // En proceso
				return <Badge variant="warning">En Proceso</Badge>;
			case 60003: // Cancelado
				return <Badge variant="danger">Cancelado</Badge>;
			default:
				return <Badge variant="info">Desconocido</Badge>;
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

	// Calculate statistics
	const stats = {
		total: pedidos.length,
		entregados: pedidos.filter(p => p.id_estado_pedido === 60001).length,
		enProceso: pedidos.filter(p => p.id_estado_pedido === 60002).length,
		cancelados: pedidos.filter(p => p.id_estado_pedido === 60003).length,
	};

	// Table columns
	const columns = [
		{
			header: 'N° Pedido',
			accessor: (row: Pedido) => `#${row.id_pedido}`,
		},
		{
			header: 'Proveedor',
			accessor: 'id_proveedor' as keyof Pedido,
		},
		{
			header: 'Fecha Solicitud',
			accessor: (row: Pedido) => formatDate(row.fecha_solicitud),
		},
		{
			header: 'Fecha Entrega Est.',
			accessor: (row: Pedido) =>
				row.fecha_entrega_estimada ? formatDate(row.fecha_entrega_estimada) : '-',
		},
		{
			header: 'Estado',
			accessor: (row: Pedido) => getStatusBadge(row.id_estado_pedido),
		},
		{
			header: 'Acciones',
			accessor: (row: Pedido) => (
				<div className="flex items-center gap-2">
					<button
						onClick={e => {
							e.stopPropagation();
							navigate(`/pedidos/${row.id_pedido}`);
						}}
						className="text-primary-600 hover:text-primary-800"
						title="Ver detalles"
					>
						<Eye size={18} />
					</button>
					<button
						onClick={e => {
							e.stopPropagation();
							navigate(`/pedidos/edit/${row.id_pedido}`);
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
						<h1 className="text-3xl font-bold text-gray-800">Pedidos a Proveedores</h1>
						<p className="text-gray-600 mt-1">Gestión de órdenes de compra</p>
					</div>
					<Button
						variant="primary"
						onClick={() => navigate('/pedidos/new')}
						className="flex items-center gap-2"
					>
						<Plus size={20} />
						Nuevo Pedido
					</Button>
				</div>
			</div>

			{/* Statistics Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
				<Card padding={false}>
					<div className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">Total Pedidos</p>
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
								<p className="text-sm text-gray-600">En Proceso</p>
								<p className="text-2xl font-bold text-yellow-600">{stats.enProceso}</p>
							</div>
							<Package className="text-yellow-600" size={32} />
						</div>
					</div>
				</Card>

				<Card padding={false}>
					<div className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">Entregados</p>
								<p className="text-2xl font-bold text-green-600">{stats.entregados}</p>
							</div>
							<Package className="text-green-600" size={32} />
						</div>
					</div>
				</Card>

				<Card padding={false}>
					<div className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">Cancelados</p>
								<p className="text-2xl font-bold text-red-600">{stats.cancelados}</p>
							</div>
							<Package className="text-red-600" size={32} />
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
						placeholder="Buscar por número de pedido..."
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
							onClick={() => setFilterStatus(60002)}
							className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
								filterStatus === 60002
									? 'bg-yellow-600 text-white'
									: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
							}`}
						>
							En Proceso
						</button>
						<button
							onClick={() => setFilterStatus(60001)}
							className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
								filterStatus === 60001
									? 'bg-green-600 text-white'
									: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
							}`}
						>
							Entregados
						</button>
					</div>
				</div>

				{/* Results Info */}
				<div className="mb-4 flex items-center space-x-4 text-sm text-gray-600">
					<span>
						Mostrando: <strong>{filteredPedidos.length}</strong> pedidos
					</span>
					{searchQuery && (
						<span>
							Búsqueda: <strong>&ldquo;{searchQuery}&rdquo;</strong>
						</span>
					)}
					{filterStatus !== 'all' && (
						<span>
							Filtro:{' '}
							<strong>
								{filterStatus === 60001
									? 'Entregados'
									: filterStatus === 60002
										? 'En Proceso'
										: 'Cancelados'}
							</strong>
						</span>
					)}
				</div>

				{/* Table */}
				<Table
					data={filteredPedidos}
					columns={columns}
					onRowClick={row => navigate(`/pedidos/${row.id_pedido}`)}
					emptyMessage="No se encontraron pedidos"
				/>
			</Card>
		</div>
	);
};

export default PedidosList;
