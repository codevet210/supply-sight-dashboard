import { useState } from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import TopBar from "./TopBar";
import Filters from "./Filters";
import KPICards from "./KPICards";
import Chart from "./Chart";
import ProductsTable from "./ProductsTable";
import ProductDrawer from "./ProductDrawer";

interface Product {
  id: string;
  name: string;
  sku: string;
  warehouse: string;
  stock: number;
  demand: number;
  status: "HEALTHY" | "LOW" | "CRITICAL";
}

const GET_PRODUCTS = gql`
  query GetProducts(
    $search: String
    $warehouse: String
    $status: Status
    $offset: Int
    $limit: Int
  ) {
    products(
      search: $search
      warehouse: $warehouse
      status: $status
      offset: $offset
      limit: $limit
    ) {
      id
      name
      sku
      warehouse
      stock
      demand
      status
    }
  }
`;

const GET_KPIS = gql`
  query GetKPIs($range: Int!) {
    kpis(range: $range) {
      totalStock
      totalDemand
      fillRate
      trend {
        date
        stock
        demand
      }
    }
  }
`;

const GET_WAREHOUSES = gql`
  query GetWarehouses {
    warehouses
  }
`;

export default function Dashboard() {
  const [dateRange, setDateRange] = useState(7);
  const [filters, setFilters] = useState({
    search: "",
    warehouse: "",
    status: "",
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  const {
    data: productsData,
    loading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useQuery(GET_PRODUCTS, {
    variables: {
      search: filters.search || undefined,
      warehouse: filters.warehouse || undefined,
      status: filters.status || undefined,
      offset: currentPage * pageSize,
      limit: pageSize,
    },
  });

  const {
    data: kpisData,
    loading: kpisLoading,
    refetch: refetchKPIs,
  } = useQuery(GET_KPIS, {
    variables: { range: dateRange },
  });

  const { data: warehousesData } = useQuery(GET_WAREHOUSES);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleDrawerClose = () => {
    setSelectedProduct(null);
  };

  const handleMutationComplete = () => {
    refetchProducts();
    refetchKPIs();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar dateRange={dateRange} onDateRangeChange={setDateRange} />

      <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        <Filters
          filters={filters}
          onFiltersChange={setFilters}
          warehouses={warehousesData?.warehouses || []}
        />

        <KPICards kpis={kpisData?.kpis} loading={kpisLoading} />

        <Chart trend={kpisData?.kpis?.trend} loading={kpisLoading} />

        <ProductsTable
          products={productsData?.products || []}
          loading={productsLoading}
          error={productsError}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onProductClick={handleProductClick}
        />
      </main>

      {selectedProduct && (
        <ProductDrawer
          product={selectedProduct}
          onClose={handleDrawerClose}
          onMutationComplete={handleMutationComplete}
        />
      )}
    </div>
  );
}
