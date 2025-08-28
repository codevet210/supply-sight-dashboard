import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { gql } from "graphql-tag";

const typeDefs = gql`
  type Product {
    id: ID!
    name: String!
    sku: String!
    warehouse: String!
    stock: Int!
    demand: Int!
    status: Status!
  }

  enum Status {
    HEALTHY
    LOW
    CRITICAL
  }

  type KPIPoint {
    date: String!
    stock: Int!
    demand: Int!
  }

  type KPIs {
    totalStock: Int!
    totalDemand: Int!
    fillRate: Float!
    trend: [KPIPoint!]!
  }

  type Query {
    products(search: String, warehouse: String, status: Status, offset: Int = 0, limit: Int = 10): [Product!]!
    product(id: ID!): Product
    warehouses: [String!]!
    kpis(range: Int!): KPIs!
  }

  type Mutation {
    updateDemand(id: ID!, demand: Int!): Product!
    transferStock(id: ID!, delta: Int!): Product!
  }
`;

const seedProducts = [
  { id: "P-1001", name: "12mm Hex Bolt", sku: "HEX-12-100", warehouse: "BLR-A", stock: 180, demand: 120 },
  { id: "P-1002", name: "Steel Washer", sku: "WSR-08-500", warehouse: "BLR-A", stock: 50, demand: 80 },
  { id: "P-1003", name: "M8 Nut", sku: "NUT-08-200", warehouse: "PNQ-C", stock: 80, demand: 80 },
  { id: "P-1004", name: "Bearing 608ZZ", sku: "BRG-608-50", warehouse: "DEL-B", stock: 24, demand: 120 },
];

let products = [...seedProducts];

function computeStatus(stock, demand) {
  if (stock > demand) return "HEALTHY";
  if (stock === demand) return "LOW";
  return "CRITICAL";
}

const resolvers = {
  Product: {
    status: (p) => computeStatus(p.stock, p.demand),
  },
  Query: {
    products: (_, args) => {
      const { search, warehouse, status, offset = 0, limit = 10 } = args;
      let filtered = products;
      if (search && search.trim()) {
        const q = search.trim().toLowerCase();
        filtered = filtered.filter(
          (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)
        );
      }
      if (warehouse) {
        filtered = filtered.filter((p) => p.warehouse === warehouse);
      }
      if (status) {
        filtered = filtered.filter((p) => computeStatus(p.stock, p.demand) === status);
      }
      return filtered.slice(offset, offset + limit);
    },
    product: (_, { id }) => products.find((p) => p.id === id) || null,
    warehouses: () => Array.from(new Set(products.map((p) => p.warehouse))).sort(),
    kpis: (_, { range }) => {
      const totalStock = products.reduce((a, p) => a + p.stock, 0);
      const totalDemand = products.reduce((a, p) => a + p.demand, 0);
      const satisfied = products.reduce((a, p) => a + Math.min(p.stock, p.demand), 0);
      const fillRate = totalDemand === 0 ? 0 : (satisfied / totalDemand) * 100;
      // Simple mock trend: generate `range` days back with small variation
      const today = new Date();
      const trend = Array.from({ length: range }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (range - 1 - i));
        const variance = ((i % 5) - 2) * 3; // deterministic wiggle
        return {
          date: d.toISOString().slice(0, 10),
          stock: Math.max(0, totalStock + variance),
          demand: Math.max(0, totalDemand - variance),
        };
      });
      return { totalStock, totalDemand, fillRate, trend };
    },
  },
  Mutation: {
    updateDemand: (_, { id, demand }) => {
      const idx = products.findIndex((p) => p.id === id);
      if (idx === -1) throw new Error("Product not found");
      products[idx] = { ...products[idx], demand };
      return products[idx];
    },
    transferStock: (_, { id, delta }) => {
      const idx = products.findIndex((p) => p.id === id);
      if (idx === -1) throw new Error("Product not found");
      const newStock = Math.max(0, products[idx].stock + delta);
      products[idx] = { ...products[idx], stock: newStock };
      return products[idx];
    },
  },
};

async function start() {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  app.use("/graphql", expressMiddleware(server));

  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`GraphQL server running at http://localhost:${port}/graphql`);
  });
}

start();


