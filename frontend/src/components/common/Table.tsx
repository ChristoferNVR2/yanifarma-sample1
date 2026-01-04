import { ReactNode } from 'react';

interface Column<T> {
	header: string;
	accessor: keyof T | ((row: T) => ReactNode);
	className?: string;
}

interface TableProps<T> {
	data: T[];
	columns: Column<T>[];
	onRowClick?: (row: T) => void;
	emptyMessage?: string;
}

const Table = <T,>({
	data,
	columns,
	onRowClick,
	emptyMessage = 'No hay datos disponibles',
}: TableProps<T>) => {
	const getCellValue = (row: T, column: Column<T>) => {
		if (typeof column.accessor === 'function') {
			return column.accessor(row);
		}
		return row[column.accessor] as ReactNode;
	};

	return (
		<div className='overflow-x-auto'>
			<table className='min-w-full divide-y divide-gray-200'>
				<thead className='bg-gray-50'>
					<tr>
						{columns.map((column, index) => (
							<th
								key={index}
								className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.className || ''}`}
							>
								{column.header}
							</th>
						))}
					</tr>
				</thead>
				<tbody className='bg-white divide-y divide-gray-200'>
					{data.length === 0 ? (
						<tr>
							<td
								colSpan={columns.length}
								className='px-6 py-8 text-center text-gray-500'
							>
								{emptyMessage}
							</td>
						</tr>
					) : (
						data.map((row, rowIndex) => (
							<tr
								key={rowIndex}
								onClick={() => onRowClick?.(row)}
								className={onRowClick ? 'hover:bg-gray-50 cursor-pointer' : ''}
							>
								{columns.map((column, colIndex) => (
									<td
										key={colIndex}
										className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${column.className || ''}`}
									>
										{getCellValue(row, column)}
									</td>
								))}
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
};

export default Table;
