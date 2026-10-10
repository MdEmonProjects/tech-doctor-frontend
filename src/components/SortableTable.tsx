import { isValidElement, type ReactNode, useState } from 'react';

type HorizontalAlign = 'start' | 'center' | 'end';
type FilterType = 'text' | 'select' | 'date' | 'range';
type FilterValue = string | number | null | [string, string];
type Field<T> = Extract<keyof T, string>;

export interface SelectOption {
  value: string | number;
  label: ReactNode;
}

export interface SortableTableColumn<T extends object> {
  field: Field<T>;
  title: ReactNode;
  hozAlign?: HorizontalAlign;
  filterable?: boolean;
  type?: FilterType;
  options?: readonly SelectOption[];
  hasCheckbox?: boolean;
  render?: (row: T, rowIndex: number) => ReactNode;
}

export interface SortableTableProps<T extends object> {
  columns: readonly SortableTableColumn<T>[];
  data?: readonly T[];
  isFilterColumn?: boolean;
  onRowClick?: (row: T) => void;
  checkboxes?: Partial<Record<Field<T>, boolean>>;
  onCheckboxChange?: (field: Field<T>) => void;
  rowWrap?: boolean;
  tdclass?: string;
}

const alignClass: Record<HorizontalAlign, string> = {
  start: 'text-left',
  center: 'text-center',
  end: 'text-right',
};

function toDayTimestamp(value: unknown) {
  const date = new Date(value as string | number | Date);
  if (Number.isNaN(date.getTime())) return null;
  return date.setHours(0, 0, 0, 0);
}

function displayValue(value: unknown): ReactNode {
  if (value === null || value === undefined || value === '') return 'N/A';
  if (isValidElement(value)) return value;
  if (value instanceof Date) return value.toLocaleDateString();
  return String(value);
}

export default function SortableTable<T extends object>({
  columns,
  data = [],
  isFilterColumn = true,
  onRowClick,
  checkboxes = {},
  onCheckboxChange,
  rowWrap = true,
  tdclass = '',
}: SortableTableProps<T>) {
  const [filters, setFilters] = useState<Partial<Record<Field<T>, FilterValue>>>({});

  const handleFilterChange = (field: Field<T>, value: FilterValue) => {
    setFilters((current) => ({ ...current, [field]: value === 'All' ? null : value }));
  };

  const filteredData = data.filter((row) => columns.every((column) => {
    const filter = filters[column.field];
    if (filter === undefined || filter === null || filter === '') return true;

    const cellValue = row[column.field];
    if (column.type === 'text') {
      return String(cellValue ?? '').toLowerCase().includes(String(filter).toLowerCase());
    }
    if (column.type === 'select') {
      return String(cellValue ?? '') === String(filter);
    }
    if (column.type === 'date') {
      const rowDate = toDayTimestamp(cellValue);
      const filterDate = toDayTimestamp(filter);
      return rowDate !== null && filterDate !== null && rowDate === filterDate;
    }
    if (column.type === 'range') {
      if (!Array.isArray(filter)) return true;
      const [startDate, endDate] = filter;
      const rowDate = toDayTimestamp(cellValue);
      const start = toDayTimestamp(startDate);
      const end = toDayTimestamp(endDate);
      return rowDate !== null && start !== null && end !== null ? rowDate >= start && rowDate <= end : true;
    }
    return true;
  }));

  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <table className="table__content min-w-full w-full text-sm" role="grid" tabIndex={-1}>
        <thead className="table__header border-b border-border bg-surface-secondary/60" role="rowgroup">
          <tr role="row">
            {columns.map((column) => (
              <th
                key={column.field}
                className={`table__column px-3 py-3 text-left text-[16px] font-semibold text-muted whitespace-nowrap sm:px-4 ${alignClass[column.hozAlign ?? 'start']}`}
                scope="col"
              >
                <div className="inline-flex w-full items-center gap-1 justify-start">
                  <span>{column.title}</span>
                  {column.hasCheckbox && onCheckboxChange && (
                    <input
                      type="checkbox"
                      checked={checkboxes[column.field] ?? false}
                      onChange={() => onCheckboxChange(column.field)}
                      className="ml-2"
                    />
                  )}
                </div>
              </th>
            ))}
          </tr>

          {isFilterColumn && (
            <tr role="row">
              {columns.map((column) => {
                const filter = filters[column.field];
                const range = Array.isArray(filter) ? filter : ['', ''];
                return (
                  <th key={column.field} className={`h-[40px] px-3 ${alignClass[column.hozAlign ?? 'start']}`} scope="col">
                    {column.filterable && column.type === 'text' && (
                      <input
                        type="text"
                        placeholder={`Filter ${String(column.title)}`}
                        className="h-[80%] w-full rounded-[5px] border border-gray-300 px-2 py-1 text-xs font-normal outline-1 outline-theme-color"
                        value={typeof filter === 'string' ? filter : ''}
                        onChange={(event) => handleFilterChange(column.field, event.target.value)}
                      />
                    )}
                    {column.filterable && column.type === 'select' && (
                      <select
                        className="h-[80%] w-full rounded-[5px] border border-gray-300 px-2 py-1 text-xs font-normal outline-1 outline-theme-color"
                        value={filter ?? 'All'}
                        onChange={(event) => handleFilterChange(column.field, event.target.value === 'All' ? null : event.target.value)}
                      >
                        <option value="All">All</option>
                        {column.options?.map((option) => (
                          <option key={String(option.value)} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    )}
                    {column.filterable && column.type === 'date' && (
                      <input
                        type="date"
                        className="h-[80%] w-full rounded-[5px] border border-gray-300 px-2 py-1 text-xs font-normal outline-1 outline-theme-color"
                        value={typeof filter === 'string' ? filter : ''}
                        onChange={(event) => handleFilterChange(column.field, event.target.value)}
                      />
                    )}
                    {column.filterable && column.type === 'range' && (
                      <div className="flex gap-1">
                        <input type="date" aria-label={`Start ${String(column.title)}`} className="h-[80%] w-1/2 rounded-[5px] border border-gray-300 px-1 py-1 text-xs font-normal outline-1 outline-theme-color" value={range[0]} onChange={(event) => handleFilterChange(column.field, [event.target.value, range[1]])} />
                        <input type="date" aria-label={`End ${String(column.title)}`} className="h-[80%] w-1/2 rounded-[5px] border border-gray-300 px-1 py-1 text-xs font-normal outline-1 outline-theme-color" value={range[1]} onChange={(event) => handleFilterChange(column.field, [range[0], event.target.value])} />
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          )}
        </thead>
        <tbody className="table__body divide-y divide-border">
          {filteredData.map((row, rowIndex) => (
            <tr key={rowIndex} className="table__row transition-colors hover:bg-brand-50/20" onClick={() => onRowClick?.(row)}>
              {columns.map((column) => (
                <td key={column.field} className={`ptable__cell px-3 py-3 text-left text-[17px] text-foreground align-middle sm:px-4 ${rowWrap ? 'whitespace-nowrap' : 'whitespace-normal'} ${alignClass[column.hozAlign ?? 'start']} ${tdclass}`}>
                  {column.render ? column.render(row, rowIndex) : displayValue(row[column.field])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
