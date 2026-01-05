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
import SaleDetails from './pages/sales/SaleDetails';
import SaleForm from './pages/sales/SaleForm';
import SaleEdit from './pages/sales/SaleEdit';
import PedidosList from './pages/pedidos/PedidosList';
import PedidoForm from './pages/pedidos/PedidoForm';
import PedidoDetails from './pages/pedidos/PedidoDetails';
import PedidoEdit from './pages/pedidos/PedidoEdit';
import ComprasList from './pages/compras/ComprasList';
import CompraForm from './pages/compras/CompraForm';
import CompraDetails from './pages/compras/CompraDetails';
import CompraEdit from './pages/compras/CompraEdit';
import InventoryDetails from './pages/inventory/InventoryDetails';

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
				<Route path='inventory/:id' element={<InventoryDetails />} />{' '}
				{/* Pedidos (Orders to Suppliers) */}
				<Route path='pedidos' element={<PedidosList />} />
				<Route path='pedidos/new' element={<PedidoForm />} />
				<Route path='pedidos/:id' element={<PedidoDetails />} />
				<Route path='pedidos/edit/:id' element={<PedidoEdit />} />
				{/* Compras (Purchase Receipts) */}
				<Route path='compras' element={<ComprasList />} />
				<Route path='compras/new' element={<CompraForm />} />
				<Route path='compras/:id' element={<CompraDetails />} />
				<Route path='compras/edit/:id' element={<CompraEdit />} />
				{/* Sales */}
				<Route path='sales' element={<SalesHistory />} />
				<Route path='sales/new' element={<SaleForm />} />
				<Route path='sales/:id' element={<SaleDetails />} />
				<Route path='sales/edit/:id' element={<SaleEdit />} />
				{/* Customers */}
				<Route path='customers' element={<CustomersList />} />
				<Route path='customers/new' element={<CustomerForm />} />
				<Route path='customers/edit/:id' element={<CustomerForm />} />
				{/* Suppliers */}
				<Route path='suppliers' element={<SuppliersList />} />
				<Route path='suppliers/new' element={<SupplierForm />} />
				<Route path='suppliers/edit/:id' element={<SupplierForm />} />
				{/* 404 */}
				<Route path='*' element={<Navigate to='/dashboard' replace />} />
			</Route>
		</Routes>
	);
}

export default App;
