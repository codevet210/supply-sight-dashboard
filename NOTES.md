# SupplySight Dashboard - Implementation Notes

## Architecture Decisions

### Frontend Stack

- **React + TypeScript**: For type safety and better developer experience
- **Vite**: Fast development server and build tool
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Apollo Client**: GraphQL client with caching and state management

### Backend Stack

- **Node.js + Express**: Simple and fast server setup
- **Apollo Server**: GraphQL server with built-in playground
- **In-memory data**: For simplicity, data resets on server restart

## Key Features Implemented

### ✅ Dashboard Layout

- Top bar with SupplySight logo and date range chips (7d/14d/30d)
- Responsive design with mobile-friendly layout
- Clean, modern UI with consistent spacing and typography

### ✅ KPI Cards

- Total Stock: Sum of all product stock levels
- Total Demand: Sum of all product demand levels
- Fill Rate: Calculated as (sum(min(stock, demand)) / sum(demand)) \* 100%
- Real-time updates when data changes

### ✅ Interactive Chart

- SVG-based line chart showing stock vs demand trends
- Responsive design with proper scaling
- Color-coded lines (blue for stock, green for demand)
- Grid lines and axis labels for better readability

### ✅ Filters & Search

- Search box: Filters by product name, SKU, or ID
- Warehouse dropdown: Filters by specific warehouse
- Status dropdown: Filters by Healthy/Low/Critical status
- Real-time filtering with debounced search

### ✅ Products Table

- All required columns: Product, SKU, Warehouse, Stock, Demand, Status
- Status pills with color coding:
  - 🟢 Healthy: stock > demand
  - 🟡 Low: stock = demand
  - 🔴 Critical: stock < demand (with red-tinted rows)
- Pagination: 10 rows per page with Previous/Next navigation
- Clickable rows that open product details drawer

### ✅ Product Drawer

- Right-side slide-out drawer with product details
- Three tabs: Details, Update Demand, Transfer Stock
- Form validation and error handling
- Real-time updates after mutations

### ✅ GraphQL Mutations

- `updateDemand`: Updates product demand value
- `transferStock`: Adds/subtracts stock with delta value
- Automatic UI refresh after successful mutations
- Loading states and error handling

## Trade-offs

### Design Decisions

1. **Tailwind over custom CSS**: Faster development, consistent design system
2. **Apollo Client over other GraphQL clients**: Better caching and dev tools
3. **SVG chart over charting library**: Lighter bundle, more control
4. **Drawer over modal**: Better UX for detailed forms
5. **TypeScript**: Better developer experience and fewer runtime errors

## What I'd Improve With More Time

### High Priority

1. **Database integration**: Replace in-memory data with PostgreSQL/MongoDB
2. **Real-time updates**: Add WebSocket subscriptions for live data
3. **Advanced charting**: Implement Recharts or Chart.js for better visualizations
4. **Authentication**: Add user login and role-based access
5. **Error boundaries**: Better error handling and user feedback
6. **Advanced filtering**: Date ranges, multiple warehouse selection
7. **Export functionality**: CSV/PDF export of filtered data
8. **Bulk operations**: Update multiple products at once
9. **Search suggestions**: Autocomplete for product names/SKUs

## Performance Considerations

- Apollo Client caching reduces unnecessary network requests
- Tailwind CSS purges unused styles in production
- SVG chart is lightweight compared to charting libraries
- Pagination prevents loading large datasets at once
- Debounced search prevents excessive API calls

## Security Notes

- No input sanitization (would be needed in production)
- No rate limiting on API endpoints
- No CORS configuration for production domains
- No authentication/authorization system

The implementation focuses on delivering a functional, user-friendly dashboard that meets all the specified requirements while maintaining clean, maintainable code structure.
