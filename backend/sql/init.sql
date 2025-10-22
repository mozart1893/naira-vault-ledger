-- Naira Vault Ledger System Database Schema
-- This script initializes the database with all required tables and functions

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE account_type AS ENUM ('individual', 'business');
CREATE TYPE currency_code AS ENUM ('NGN', 'USD', 'GBP', 'EUR');
CREATE TYPE kyc_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE transaction_type AS ENUM ('deposit', 'withdrawal', 'transfer', 'conversion');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'reversed');
CREATE TYPE ledger_entry_type AS ENUM ('debit', 'credit');
CREATE TYPE hold_status AS ENUM ('active', 'released', 'expired');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    bvn VARCHAR(11),
    nin VARCHAR(11),
    kyc_status kyc_status DEFAULT 'pending',
    kyc_verified_at TIMESTAMP,
    account_type account_type DEFAULT 'individual',
    auth_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Wallets table
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    currency currency_code NOT NULL,
    ledger_balance DECIMAL(15,2) DEFAULT 0.00,
    available_balance DECIMAL(15,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, currency)
);

-- Transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    transaction_type transaction_type NOT NULL,
    status transaction_status DEFAULT 'pending',
    amount DECIMAL(15,2) NOT NULL,
    fee DECIMAL(15,2) DEFAULT 0.00,
    currency currency_code NOT NULL,
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ledger entries table
CREATE TABLE ledger_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
    entry_type ledger_entry_type NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    balance_after DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Currency conversions table
CREATE TABLE currency_conversions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    from_currency currency_code NOT NULL,
    to_currency currency_code NOT NULL,
    from_amount DECIMAL(15,2) NOT NULL,
    to_amount DECIMAL(15,2) NOT NULL,
    rate DECIMAL(10,6) NOT NULL,
    fee DECIMAL(15,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exchange rates table
CREATE TABLE exchange_rates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_currency currency_code NOT NULL,
    to_currency currency_code NOT NULL,
    rate DECIMAL(10,6) NOT NULL,
    source VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Holds table
CREATE TABLE holds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    reason VARCHAR(255) NOT NULL,
    status hold_status DEFAULT 'active',
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payment methods table
CREATE TABLE payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    provider VARCHAR(100) NOT NULL,
    details JSONB NOT NULL,
    is_default BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit logs table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    action VARCHAR(50) NOT NULL,
    metadata JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- System settings table
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_wallets_user_id ON wallets(user_id);
CREATE INDEX idx_wallets_currency ON wallets(currency);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_reference ON transactions(reference);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_ledger_entries_transaction_id ON ledger_entries(transaction_id);
CREATE INDEX idx_ledger_entries_wallet_id ON ledger_entries(wallet_id);
CREATE INDEX idx_currency_conversions_transaction_id ON currency_conversions(transaction_id);
CREATE INDEX idx_exchange_rates_currencies ON exchange_rates(from_currency, to_currency);
CREATE INDEX idx_holds_wallet_id ON holds(wallet_id);
CREATE INDEX idx_holds_status ON holds(status);
CREATE INDEX idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Create functions for wallet balance updates
CREATE OR REPLACE FUNCTION update_wallet_ledger_balance(
    wallet_id_param UUID,
    amount_param DECIMAL,
    is_credit BOOLEAN
) RETURNS VOID AS $$
BEGIN
    IF is_credit THEN
        UPDATE wallets 
        SET ledger_balance = ledger_balance + amount_param,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = wallet_id_param;
    ELSE
        UPDATE wallets 
        SET ledger_balance = ledger_balance - amount_param,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = wallet_id_param;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_wallet_available_balance(
    wallet_id_param UUID,
    amount_param DECIMAL,
    is_credit BOOLEAN
) RETURNS VOID AS $$
BEGIN
    IF is_credit THEN
        UPDATE wallets 
        SET available_balance = available_balance + amount_param,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = wallet_id_param;
    ELSE
        UPDATE wallets 
        SET available_balance = available_balance - amount_param,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = wallet_id_param;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables with updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON wallets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_holds_updated_at BEFORE UPDATE ON holds
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON payment_methods
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial system settings
INSERT INTO system_settings (key, value, description) VALUES
('app_name', '"Naira Vault Ledger System"', 'Application name'),
('app_version', '"1.0.0"', 'Application version'),
('supported_currencies', '["NGN", "USD", "GBP", "EUR"]', 'List of supported currencies'),
('default_currency', '"NGN"', 'Default currency for the system'),
('transaction_fee_rate', '0.025', 'Default transaction fee rate (2.5%)'),
('min_transaction_amount', '100', 'Minimum transaction amount in NGN'),
('max_transaction_amount', '10000000', 'Maximum transaction amount in NGN'),
('kyc_required_for_transactions', 'true', 'Whether KYC is required for transactions'),
('audit_log_retention_days', '2555', 'Number of days to retain audit logs (7 years)');

-- Insert sample exchange rates
INSERT INTO exchange_rates (from_currency, to_currency, rate, source) VALUES
('NGN', 'USD', 0.00067, 'CBN'),
('USD', 'NGN', 1500.00, 'CBN'),
('NGN', 'GBP', 0.00053, 'CBN'),
('GBP', 'NGN', 1900.00, 'CBN'),
('NGN', 'EUR', 0.00061, 'CBN'),
('EUR', 'NGN', 1650.00, 'CBN'),
('USD', 'GBP', 0.79, 'CBN'),
('GBP', 'USD', 1.27, 'CBN'),
('USD', 'EUR', 0.91, 'CBN'),
('EUR', 'USD', 1.10, 'CBN'),
('GBP', 'EUR', 1.15, 'CBN'),
('EUR', 'GBP', 0.87, 'CBN');

-- Create a sample user for testing
INSERT INTO users (email, phone, first_name, last_name, kyc_status, account_type) VALUES
('test@nairavault.com', '+2348012345678', 'Test', 'User', 'verified', 'individual');

-- Create sample wallets for the test user
INSERT INTO wallets (user_id, currency, ledger_balance, available_balance) VALUES
((SELECT id FROM users WHERE email = 'test@nairavault.com'), 'NGN', 250000.00, 240000.00),
((SELECT id FROM users WHERE email = 'test@nairavault.com'), 'USD', 1500.00, 1500.00),
((SELECT id FROM users WHERE email = 'test@nairavault.com'), 'GBP', 750.00, 750.00),
((SELECT id FROM users WHERE email = 'test@nairavault.com'), 'EUR', 1000.00, 850.00);

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO naira_vault;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO naira_vault;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO naira_vault;
