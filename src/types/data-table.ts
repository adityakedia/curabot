/**
 * Type definitions for data table components and functionality
 * Extends @tanstack/react-table with custom column metadata and filtering
 */

import type { DataTableConfig } from '@/config/data-table';
import type { FilterItemSchema } from '@/lib/parsers';
import type { ColumnSort, Row, RowData } from '@tanstack/react-table';

// ============================================================================
// TANSTACK TABLE EXTENSIONS
// ============================================================================

/**
 * Module declaration to extend @tanstack/react-table with custom column metadata
 */
declare module '@tanstack/react-table' {
  // biome-ignore lint/correctness/noUnusedVariables: Interface type parameters required by @tanstack/react-table
  interface ColumnMeta<TData extends RowData, TValue> {
    label?: string;
    placeholder?: string;
    variant?: FilterVariant;
    options?: Option[];
    range?: [number, number];
    unit?: string;
    icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  }
}

// ============================================================================
// OPTION AND FILTER INTERFACES
// ============================================================================

/**
 * Option interface for dropdown and filter selections
 */
export interface Option {
  label: string;
  value: string;
  count?: number;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
}

// ============================================================================
// TYPE ALIASES FROM CONFIGURATION
// ============================================================================

/**
 * Filter operator types from data table configuration
 */
export type FilterOperator = DataTableConfig['operators'][number];

/**
 * Filter variant types from data table configuration
 */
export type FilterVariant = DataTableConfig['filterVariants'][number];

/**
 * Join operator types from data table configuration
 */
export type JoinOperator = DataTableConfig['joinOperators'][number];

// ============================================================================
// EXTENDED TABLE INTERFACES
// ============================================================================

/**
 * Extended column sort interface with typed column ID
 */
export interface ExtendedColumnSort<TData> extends Omit<ColumnSort, 'id'> {
  id: Extract<keyof TData, string>;
}

/**
 * Extended column filter interface with typed column ID
 */
export interface ExtendedColumnFilter<TData> extends FilterItemSchema {
  id: Extract<keyof TData, string>;
}

/**
 * Interface for data table row actions
 */
export interface DataTableRowAction<TData> {
  row: Row<TData>;
  variant: 'update' | 'delete';
}
