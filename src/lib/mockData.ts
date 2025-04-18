
import { CURRENCIES, TRANSACTION_TYPES, TRANSACTION_STATUS } from "./constants";

// Mock wallet balances
export const mockWallets = [
  {
    id: "wallet-ngn-001",
    currencyCode: CURRENCIES.NGN.code,
    ledgerBalance: 250000.00,
    availableBalance: 240000.00,
    holds: 10000.00,
    lastUpdated: "2025-04-17T10:30:00Z"
  },
  {
    id: "wallet-usd-001",
    currencyCode: CURRENCIES.USD.code,
    ledgerBalance: 1500.00,
    availableBalance: 1500.00,
    holds: 0.00,
    lastUpdated: "2025-04-17T10:30:00Z"
  },
  {
    id: "wallet-gbp-001",
    currencyCode: CURRENCIES.GBP.code,
    ledgerBalance: 750.00,
    availableBalance: 750.00,
    holds: 0.00,
    lastUpdated: "2025-04-17T10:30:00Z"
  },
  {
    id: "wallet-eur-001",
    currencyCode: CURRENCIES.EUR.code,
    ledgerBalance: 1000.00,
    availableBalance: 850.00,
    holds: 150.00,
    lastUpdated: "2025-04-17T10:30:00Z"
  }
];

// Mock transaction history
export const mockTransactions = [
  {
    id: "txn-001",
    type: TRANSACTION_TYPES.DEPOSIT,
    amount: 100000.00,
    currencyCode: CURRENCIES.NGN.code,
    status: TRANSACTION_STATUS.COMPLETED,
    description: "Salary payment",
    timestamp: "2025-04-17T08:30:00Z",
    reference: "DEP12345678"
  },
  {
    id: "txn-002",
    type: TRANSACTION_TYPES.CONVERSION,
    amount: 50000.00,
    currencyCode: CURRENCIES.NGN.code,
    targetCurrencyCode: CURRENCIES.USD.code,
    targetAmount: 33.35,
    status: TRANSACTION_STATUS.COMPLETED,
    description: "NGN to USD conversion",
    timestamp: "2025-04-16T14:20:00Z",
    reference: "FX98765432"
  },
  {
    id: "txn-003",
    type: TRANSACTION_TYPES.TRANSFER,
    amount: 500.00,
    currencyCode: CURRENCIES.USD.code,
    status: TRANSACTION_STATUS.COMPLETED,
    description: "Payment to John Doe",
    timestamp: "2025-04-15T11:45:00Z",
    reference: "TRF45678901"
  },
  {
    id: "txn-004",
    type: TRANSACTION_TYPES.WITHDRAWAL,
    amount: 10000.00,
    currencyCode: CURRENCIES.NGN.code,
    status: TRANSACTION_STATUS.PENDING,
    description: "ATM withdrawal",
    timestamp: "2025-04-14T16:30:00Z",
    reference: "WDR23456789"
  },
  {
    id: "txn-005",
    type: TRANSACTION_TYPES.DEPOSIT,
    amount: 750.00,
    currencyCode: CURRENCIES.GBP.code,
    status: TRANSACTION_STATUS.COMPLETED,
    description: "Client payment",
    timestamp: "2025-04-13T09:15:00Z",
    reference: "DEP34567890"
  },
  {
    id: "txn-006",
    type: TRANSACTION_TYPES.CONVERSION,
    amount: 1000.00,
    currencyCode: CURRENCIES.EUR.code,
    targetCurrencyCode: CURRENCIES.GBP.code,
    targetAmount: 840.00,
    status: TRANSACTION_STATUS.COMPLETED,
    description: "EUR to GBP conversion",
    timestamp: "2025-04-12T13:40:00Z",
    reference: "FX87654321"
  },
];

// Mock microservices architecture diagram
export const mockArchitectureDiagram = `
graph TD
    subgraph "Client Applications"
        A[Web App]
        B[Mobile App]
        C[Admin Portal]
    end

    subgraph "API Gateway"
        D[API Gateway / Load Balancer]
    end

    subgraph "Core Services"
        E[User Service]
        F[Wallet Service]
        G[Transaction Service]
        H[Ledger Service]
        I[FX Service]
        J[Notification Service]
    end

    subgraph "Auth & Security"
        K[Auth Service]
        L[KYC/AML Service]
        M[Fraud Detection]
    end

    subgraph "External Integrations"
        N[Payment Gateways]
        O[Banking APIs]
        P[FX Rate APIs]
        Q[Communication APIs]
    end

    subgraph "Data Storage"
        R[(User Database)]
        S[(Wallet Database)]
        T[(Transaction Database)]
        U[(Ledger Database)]
    end

    subgraph "Infrastructure"
        V[Message Queue]
        W[Cache]
        X[Monitoring & Logging]
    end

    A --> D
    B --> D
    C --> D
    D --> E
    D --> F
    D --> G
    D --> H
    D --> I
    D --> J
    D --> K
    E --> R
    F --> S
    G --> T
    H --> U
    E --> K
    F --> K
    G --> K
    H --> K
    I --> K
    K --> L
    K --> M
    F --> N
    G --> N
    H --> O
    I --> P
    J --> Q
    E --> V
    F --> V
    G --> V
    H --> V
    I --> V
    J --> V
    E --> W
    F --> W
    G --> W
    H --> W
    I --> W
    V --> X
    W --> X
`;

// Mock deposit flow diagram
export const mockDepositFlowDiagram = `
sequenceDiagram
    participant U as User
    participant WA as Wallet App
    participant WS as Wallet Service
    participant TS as Transaction Service
    participant LS as Ledger Service
    participant PS as Payment Service
    participant PG as Payment Gateway
    participant NS as Notification Service

    U->>WA: Initiates deposit
    WA->>WS: Request deposit details
    WS->>TS: Create pending transaction
    TS->>LS: Record pending entry
    LS-->>TS: Confirm ledger entry
    TS-->>WS: Pending transaction created
    WS-->>WA: Display payment options
    WA->>PS: Select payment method (e.g., card)
    PS->>PG: Initiate payment processing
    PG-->>PS: Confirm payment received
    PS->>TS: Update transaction status
    TS->>LS: Record confirmed entry
    LS->>WS: Update wallet balance
    LS-->>TS: Confirm balance update
    TS-->>NS: Trigger success notification
    NS-->>U: Send deposit confirmation
`;

// Mock cross-currency transfer flow diagram
export const mockTransferFlowDiagram = `
sequenceDiagram
    participant U as User
    participant WA as Wallet App
    participant WS as Wallet Service
    participant FXS as FX Service
    participant TS as Transaction Service
    participant LS as Ledger Service
    participant NS as Notification Service

    U->>WA: Initiates cross-currency transfer
    WA->>WS: Request transfer with currency conversion
    WS->>FXS: Get current exchange rate
    FXS-->>WS: Return exchange rate
    WA->>U: Display conversion details for confirmation
    U->>WA: Confirms transfer
    WA->>TS: Create transfer transaction
    TS->>LS: Debit source wallet (ledger entry)
    LS-->>TS: Confirm debit
    TS->>LS: FX conversion (ledger entry)
    LS-->>TS: Confirm conversion
    TS->>LS: Credit target wallet (ledger entry)
    LS-->>TS: Confirm credit
    TS-->>WS: Update wallet balances
    WS-->>TS: Confirm balance updates
    TS-->>NS: Trigger success notification
    NS-->>U: Send transfer confirmation
`;

// Mock database schema diagram
export const mockLedgerSchemaDiagram = `
erDiagram
    USERS {
        uuid id PK
        string email
        string full_name
        string phone
        string bvn
        bool kyc_verified
        datetime created_at
        datetime updated_at
    }
    
    WALLETS {
        uuid id PK
        uuid user_id FK
        string currency_code
        decimal ledger_balance
        decimal available_balance
        decimal hold_balance
        datetime created_at
        datetime updated_at
    }
    
    TRANSACTIONS {
        uuid id PK
        uuid wallet_id FK
        string type
        string status
        decimal amount
        string currency_code
        string description
        string reference
        datetime created_at
        datetime updated_at
    }
    
    LEDGER_ENTRIES {
        uuid id PK
        uuid transaction_id FK
        uuid wallet_id FK
        string entry_type
        decimal amount
        string currency_code
        decimal balance_after
        datetime created_at
    }
    
    CURRENCY_CONVERSIONS {
        uuid id PK
        uuid transaction_id FK
        string source_currency
        string target_currency
        decimal source_amount
        decimal target_amount
        decimal exchange_rate
        datetime created_at
    }
    
    HOLDS {
        uuid id PK
        uuid wallet_id FK
        uuid transaction_id FK
        decimal amount
        string reason
        datetime expires_at
        datetime created_at
        datetime released_at
    }

    USERS ||--o{ WALLETS : "has"
    WALLETS ||--o{ TRANSACTIONS : "contains"
    TRANSACTIONS ||--o{ LEDGER_ENTRIES : "generates"
    TRANSACTIONS ||--o{ CURRENCY_CONVERSIONS : "may include"
    WALLETS ||--o{ HOLDS : "may have"
    TRANSACTIONS ||--o{ HOLDS : "may create"
`;

// Mock user stories
export const mockUserStories = [
  {
    id: "us-001",
    title: "User Registration",
    description: "As a new user, I want to register with my email and phone number so that I can create an account.",
    acceptanceCriteria: [
      "User can enter email, phone number, and password",
      "System verifies email and phone via OTP",
      "User can complete registration after verification"
    ]
  },
  {
    id: "us-002",
    title: "KYC Verification",
    description: "As a registered user, I want to verify my identity with BVN/NIN so that I can access all features of the platform.",
    acceptanceCriteria: [
      "User can submit BVN/NIN for verification",
      "System validates against CBN database",
      "User receives notification of verification status"
    ]
  },
  {
    id: "us-003",
    title: "Wallet Creation",
    description: "As a verified user, I want to create wallets in different currencies so that I can manage multiple currencies.",
    acceptanceCriteria: [
      "User can create wallets in NGN, USD, GBP, and EUR",
      "System shows available balance and ledger balance for each wallet",
      "User can see transaction history for each wallet"
    ]
  },
  {
    id: "us-004",
    title: "Deposit Funds",
    description: "As a user, I want to deposit funds into my wallet so that I can use the money for transactions.",
    acceptanceCriteria: [
      "User can select deposit method (bank transfer, card)",
      "System shows confirmation of deposit request",
      "User receives notification when deposit is processed",
      "Balance is updated in real-time"
    ]
  }
];

// Recommended tools and technologies
export const recommendedTools = [
  {
    category: "Backend Framework",
    name: "Spring Boot (Java)",
    description: "For building microservices with robust error handling and security features."
  },
  {
    category: "API Gateway",
    name: "Kong",
    description: "For routing, authentication, rate limiting, and monitoring of API requests."
  },
  {
    category: "Message Broker",
    name: "Apache Kafka",
    description: "For asynchronous communication between microservices with guaranteed delivery."
  },
  {
    category: "Database",
    name: "PostgreSQL",
    description: "For ACID-compliant transactional data storage with strong consistency."
  },
  {
    category: "Caching",
    name: "Redis",
    description: "For high-performance caching of frequently accessed data like exchange rates."
  },
  {
    category: "Container Orchestration",
    name: "Kubernetes",
    description: "For deployment, scaling, and management of containerized microservices."
  },
  {
    category: "Monitoring",
    name: "Prometheus + Grafana",
    description: "For real-time monitoring, alerting, and visualization of system metrics."
  },
  {
    category: "Security",
    name: "Vault by HashiCorp",
    description: "For secure storage and management of secrets, keys, and certificates."
  }
];
