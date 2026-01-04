import { SelectHTMLAttributes, forwardRef, ReactNode } from 'react';

interface SelectOption {
	value: string | number;
	label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
	label?: string;
	error?: string;
	options?: SelectOption[]; // Make optional
	placeholder?: string;
	children?: ReactNode; // Allow children
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
	(
		{ label, error, options, placeholder, className = '', children, ...props },
		ref,
	) => {
		return (
			<div className='w-full'>
				{label && (
					<label className='block text-sm font-medium text-gray-700 mb-1'>
						{label}
						{props.required && <span className='text-danger-500 ml-1'>*</span>}
					</label>
				)}

				<select
					ref={ref}
					className={`
						w-full px-3 py-2 border rounded-lg 
						focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
						disabled:bg-gray-100 disabled:cursor-not-allowed
						${error ? 'border-danger-500' : 'border-gray-300'}
						${className}
					`}
					{...props}
				>
					{/* Support both patterns: options prop OR children */}
					{options ? (
						<>
							{placeholder && (
								<option value='' disabled>
									{placeholder}
								</option>
							)}
							{options.map(option => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</>
					) : (
						children
					)}
				</select>

				{error && <p className='mt-1 text-sm text-danger-600'>{error}</p>}
			</div>
		);
	},
);

Select.displayName = 'Select';

export default Select;
