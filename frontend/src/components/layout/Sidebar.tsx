import { NavLink } from 'react-router-dom';
import {
	LayoutDashboard,
	Package,
	Warehouse,
	Users,
	Truck,
	ShoppingCart,
} from 'lucide-react';

const Sidebar = () => {
	const menuItems = [
		{ path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
		{ path: '/products', icon: Package, label: 'Productos' },
		{ path: '/inventory', icon: Warehouse, label: 'Inventario' },
		{ path: '/customers', icon: Users, label: 'Clientes' },
		{ path: '/suppliers', icon: Truck, label: 'Proveedores' },
		{ path: '/sales', icon: ShoppingCart, label: 'Ventas' },
	];

	return (
		<aside className='w-64 bg-white shadow-lg'>
			{/* Logo */}
			<div className='h-16 flex items-center justify-center border-b border-gray-200'>
				<h1 className='text-2xl font-bold text-primary-600'>Yanifarma</h1>
			</div>

			{/* Navigation */}
			<nav className='p-4 space-y-2'>
				{menuItems.map(item => (
					<NavLink
						key={item.path}
						to={item.path}
						className={({ isActive }) =>
							`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
								isActive
									? 'bg-primary-50 text-primary-700 font-medium'
									: 'text-gray-700 hover:bg-gray-100'
							}`
						}
					>
						<item.icon size={20} />
						<span>{item.label}</span>
					</NavLink>
				))}
			</nav>
		</aside>
	);
};

export default Sidebar;
