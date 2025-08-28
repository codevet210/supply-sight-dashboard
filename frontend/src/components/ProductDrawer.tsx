import { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

const UPDATE_DEMAND = gql`
  mutation UpdateDemand($id: ID!, $demand: Int!) {
    updateDemand(id: $id, demand: $demand) {
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

const TRANSFER_STOCK = gql`
  mutation TransferStock($id: ID!, $delta: Int!) {
    transferStock(id: $id, delta: $delta) {
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

interface Product {
  id: string;
  name: string;
  sku: string;
  warehouse: string;
  stock: number;
  demand: number;
  status: "HEALTHY" | "LOW" | "CRITICAL";
}

interface ProductDrawerProps {
  product: Product;
  onClose: () => void;
  onMutationComplete: () => void;
}

export default function ProductDrawer({
  product,
  onClose,
  onMutationComplete,
}: ProductDrawerProps) {
  const [demandValue, setDemandValue] = useState(product.demand.toString());
  const [stockDelta, setStockDelta] = useState("");
  const [activeTab, setActiveTab] = useState<"details" | "demand" | "stock">(
    "details"
  );

  const [updateDemand, { loading: updatingDemand }] = useMutation(
    UPDATE_DEMAND,
    {
      onCompleted: () => {
        setActiveTab("details");
        onMutationComplete();
      },
    }
  );

  const [transferStock, { loading: transferringStock }] = useMutation(
    TRANSFER_STOCK,
    {
      onCompleted: () => {
        setStockDelta("");
        setActiveTab("details");
        onMutationComplete();
      },
    }
  );

  const handleUpdateDemand = () => {
    const demand = parseInt(demandValue);
    if (!isNaN(demand) && demand >= 0) {
      updateDemand({ variables: { id: product.id, demand } });
    }
  };

  const handleTransferStock = () => {
    const delta = parseInt(stockDelta);
    if (!isNaN(delta)) {
      transferStock({ variables: { id: product.id, delta } });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "HEALTHY":
        return "bg-green-100 text-green-800";
      case "LOW":
        return "bg-yellow-100 text-yellow-800";
      case "CRITICAL":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex justify-end z-50">
      <div className="w-full max-w-md bg-white shadow-xl">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Product Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Tabs */}
          <div className="flex border-b mb-6">
            {[
              { id: "details", label: "Details" },
              { id: "demand", label: "Update Demand" },
              { id: "stock", label: "Transfer Stock" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Details Tab */}
          {activeTab === "details" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500">{product.id}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    SKU
                  </label>
                  <p className="text-sm text-gray-900">{product.sku}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Warehouse
                  </label>
                  <p className="text-sm text-gray-900">{product.warehouse}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Stock
                  </label>
                  <p className="text-sm text-gray-900">
                    {product.stock.toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Demand
                  </label>
                  <p className="text-sm text-gray-900">
                    {product.demand.toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                    product.status
                  )}`}
                >
                  {product.status}
                </span>
              </div>
            </div>
          )}

          {/* Update Demand Tab */}
          {activeTab === "demand" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Demand Value
                </label>
                <input
                  type="number"
                  min="0"
                  value={demandValue}
                  onChange={(e) => setDemandValue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={handleUpdateDemand}
                disabled={updatingDemand}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updatingDemand ? "Updating..." : "Update Demand"}
              </button>
            </div>
          )}

          {/* Transfer Stock Tab */}
          {activeTab === "stock" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Change (positive for increase, negative for decrease)
                </label>
                <input
                  type="number"
                  value={stockDelta}
                  onChange={(e) => setStockDelta(e.target.value)}
                  placeholder="e.g., 10 or -5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={handleTransferStock}
                disabled={transferringStock || !stockDelta}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {transferringStock ? "Transferring..." : "Transfer Stock"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
