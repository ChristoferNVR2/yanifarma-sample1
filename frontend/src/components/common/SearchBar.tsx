import { Search } from 'lucide-react';
import { InputHTMLAttributes } from 'react';

interface SearchBarProps extends Omit<
	InputHTMLAttributes<HTMLInputElement>,
	'type'
> {
	onSearch?: (value: string) => void;
}

const SearchBar = ({ onSearch, className = '', ...props }: SearchBarProps) => {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onSearch?.(e.target.value);
		props.onChange?.(e);
	};

	return (
		<div className={`relative ${className}`}>
			<Search
				className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
				size={20}
			/>
			<input
				type='text'
				className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
				placeholder='Buscar...'
				onChange={handleChange}
				{...props}
			/>
		</div>
	);
};

export default SearchBar;
