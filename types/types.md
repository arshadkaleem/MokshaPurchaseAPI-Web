/moksha-web
│
├── /types
│   ├── index.ts                      # Re-export all types (barrel file)
│   │
│   ├── /api                          # API-related types
│   │   ├── common.types.ts           # ApiResponse, PaginatedResponse, ApiError
│   │   ├── auth.types.ts             # Login, Register, User types
│   │   ├── project.types.ts          # Project request/response types
│   │   ├── supplier.types.ts         # Supplier request/response types
│   │   ├── material.types.ts         # Material request/response types
│   │   ├── purchase-order.types.ts   # PO request/response types
│   │   ├── invoice.types.ts          # Invoice request/response types
│   │   ├── payment.types.ts          # Payment request/response types
│   │   ├── inventory.types.ts        # Inventory request/response types
│   │   └── report.types.ts           # Report response types
│   │
│   ├── /enums                        # Enums and constants
│   │   ├── user-role.enum.ts         # UserRole enum
│   │   ├── project-status.enum.ts    # ProjectStatus enum
│   │   ├── project-type.enum.ts      # ProjectType enum
│   │   ├── po-status.enum.ts         # PurchaseOrderStatus enum
│   │   ├── invoice-status.enum.ts    # InvoiceStatus enum
│   │   └── unit-of-measure.enum.ts   # UnitOfMeasure enum
│   │
│   └── /ui                           # UI-specific types
│       ├── form.types.ts             # FormState, validation types
│       ├── table.types.ts            # TableState, column definitions
│       └── query.types.ts            # Query params for API calls