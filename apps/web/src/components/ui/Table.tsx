import React from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
}

export default function Table<T>({
  columns,
  data,
  keyExtractor,
}: TableProps<T>) {
  return (
    <div className="w-full overflow-hidden border border-outline-variant/30 rounded-xl bg-surface-container-lowest shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse text-left">
          <thead>
            <tr className="border-b border-outline-variant/30 bg-surface-container-low/50 text-xs font-mono uppercase tracking-wider text-outline">
              {columns.map((col, idx) => (
                <th key={idx} className={`p-4 font-semibold ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {data.length > 0 ? (
              data.map((row) => (
                <tr key={keyExtractor(row)} className="hover:bg-surface-container-low/30 transition-colors">
                  {columns.map((col, idx) => (
                    <td key={idx} className={`p-4 text-on-surface-variant ${col.className || ''}`}>
                      {typeof col.accessor === 'function'
                        ? col.accessor(row)
                        : (row[col.accessor] as unknown as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-outline font-medium">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
