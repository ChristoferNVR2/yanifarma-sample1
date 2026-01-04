import { User } from 'lucide-react';

const Header = () => {
	return (
		<header className='h-16 bg-white shadow-sm flex items-center justify-between px-6'>
			<div>
				<h2 className='text-xl font-semibold text-gray-800'>
					Sistema de Gestión de Farmacia
				</h2>
			</div>

			{/* User Info */}
			<div className='flex items-center space-x-3'>
				<div className='text-right'>
					<p className='text-sm font-medium text-gray-700'>Yanina Castro</p>
					<p className='text-xs text-gray-500'>Administrador</p>
				</div>
				<div className='w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center'>
					<User size={20} className='text-primary-600' />
				</div>
			</div>
		</header>
	);
};

export default Header;
