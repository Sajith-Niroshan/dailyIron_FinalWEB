import React from 'react';

interface Column {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface TableProps {
  columns: Column[];
  data: any[];
  onSort?: (key: string) => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  className?: string;
}

const Table: React.FC<TableProps> = ({ 
  columns, 
  data, 
  onSort, 
  sortKey, 
  sortDirection, 
  className = '' 
}) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead style={{ backgroundColor: '#FFF8F0' }}>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-6 py-4 text-left text-sm font-semibold border-b border-gray-200 ${
                  column.sortable ? 'cursor-pointer hover:bg-gray-50' : ''
                }`}
                style={{ color: '#2C3E50' }}
                onClick={() => column.sortable && onSort?.(column.key)}
              >
                <div className="flex items-center space-x-2">
                  <span>{column.header}</span>
                  {column.sortable && sortKey === column.key && (
                    <span className="text-xs">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td 
                colSpan={columns.length} 
                className="px-6 py-8 text-center text-gray-500"
              >
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                {columns.map((column) => (
                  <td 
                    key={column.key} 
                    className="px-6 py-4 text-sm border-b border-gray-100"
                    style={{ color: '#2C3E50' }}
                  >
                    {column.render 
                      ? column.render(row[column.key], row)
                      : row[column.key]
                    }
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