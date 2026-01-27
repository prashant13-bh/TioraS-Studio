# Data Table Components

Advanced data table system integrated from the ecommerce-admin repository.

## Components

### DataTable

**Location**: `src/components/admin/data-table/DataTable.tsx`

Main table component with built-in pagination.

```tsx
import DataTable from "@/components/admin/data-table/DataTable";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";

const MyTable = () => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const pagination = {
    limit: 10,
    current: 1,
    items: 100,
    pages: 10,
    next: 2,
    prev: null,
  };

  return <DataTable table={table} pagination={pagination} />;
};
```

### TableSkeleton

**Location**: `src/components/admin/data-table/TableSkeleton.tsx`

Loading skeleton for tables.

```tsx
import TableSkeleton from "@/components/admin/data-table/TableSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

const columns = [
  { header: "Name", cell: <Skeleton className="h-4 w-32" /> },
  { header: "Status", cell: <Skeleton className="h-4 w-20" /> },
];

<TableSkeleton columns={columns} perPage={5} />;
```

### TableError

**Location**: `src/components/admin/data-table/TableError.tsx`

Error state component with retry functionality.

```tsx
import TableError from "@/components/admin/data-table/TableError";

<TableError errorMessage="Failed to load products" refetch={refetch} />;
```

## Helper Functions

### getPaginationButtons

**Location**: `src/lib/get-pagination-buttons.ts`

Generates smart pagination button array.

### useUpdateQueryString

**Location**: `src/hooks/use-update-query-string.ts`

Hook for updating URL query parameters.

## Types

### Pagination

**Location**: `src/types/pagination.d.ts`

```typescript
interface Pagination {
  limit: number;
  current: number;
  items: number;
  pages: number;
  next: number | null;
  prev: number | null;
}
```

## UI Components Added

- **Pagination** (`src/components/ui/pagination.tsx`)
- **Typography** (`src/components/ui/typography.tsx`)

## Usage Example

See `src/app/admin/products/page.tsx` or `src/app/admin/orders/page.tsx` for integration examples.
