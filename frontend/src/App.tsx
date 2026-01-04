import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import ProductsList from './pages/products/ProductsList';
import ProductForm from './pages/products/ProductForm';
import InventoryList from './pages/inventory/InventoryList';
import CustomersList from './pages/customers/CustomersList';
import CustomerForm from './pages/customers/CustomerForm';
import SuppliersList from './pages/suppliers/SuppliersList';
import SupplierForm from './pages/suppliers/SupplierForm';
import SalesHistory from './pages/sales/SalesHistory';
import PedidosList from './pages/pedidos/PedidosList';
import PedidoForm from './pages/pedidos/PedidoForm';
import PedidoDetails from './pages/pedidos/PedidoDetails';
import PedidoEdit from './pages/pedidos/PedidoEdit';
import ComprasList from './pages/compras/ComprasList';

function App() {
	return (
		<Routes>
			<Route path='/' element={<Layout />}>
				<Route index element={<Navigate to='/dashboard' replace />} />
				<Route path='dashboard' element={<Dashboard />} />

				{/* Products */}
				<Route path='products' element={<ProductsList />} />
				<Route path='products/new' element={<ProductForm />} />
				<Route path='products/edit/:id' element={<ProductForm />} />

				{/* Inventory */}
				<Route path='inventory' element={<InventoryList />} />

				{/* Pedidos (Orders to Suppliers) */}
				<Route path='pedidos' element={<PedidosList />} />
				<Route path='pedidos/new' element={<PedidoForm />} />
				<Route path='pedidos/:id' element={<PedidoDetails />} />
				<Route path='pedidos/edit/:id' element={<PedidoEdit />} />

				{/* Compras (Purchase Receipts) */}
				<Route path='compras' element={<ComprasList />} />
				<Route path='compras/new' element={<div>Nueva Compra - Coming Soon</div>} />
				<Route path='compras/:id' element={<div>Ver Compra - Coming Soon</div>} />
				<Route path='compras/edit/:id' element={<div>Editar Compra - Coming Soon</div>} />

				{/* Customers */}
				<Route path='customers' element={<CustomersList />} />
				<Route path='customers/new' element={<CustomerForm />} />
				<Route path='customers/edit/:id' element={<CustomerForm />} />

				{/* Suppliers */}
				<Route path='suppliers' element={<SuppliersList />} />
				<Route path='suppliers/new' element={<SupplierForm />} />
				<Route path='suppliers/edit/:id' element={<SupplierForm />} />

				{/* Sales */}
				<Route path='sales' element={<SalesHistory />} />

				{/* 404 */}
				<Route path='*' element={<Navigate to='/dashboard' replace />} />
			</Route>
		</Routes>
	);
}

export default App;
