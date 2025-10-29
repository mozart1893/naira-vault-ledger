import { CURRENCIES } from "@/lib/constants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpCircle, ArrowDownCircle, ArrowRightLeft, RefreshCw } from "lucide-react";

interface Transaction {
  id: string;
  reference: string;
  type: string;
  status: string;
  amount: number;
  currency: string | any;
  currencyCode?: string;
  description: string;
  createdAt: string;
  fee?: number;
}

interface TransactionListProps {
  transactions: Transaction[];
}

export const TransactionList = ({ transactions }: TransactionListProps) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="rounded-md border">
        <div className="py-12 text-center text-gray-500">
          <p>No transactions found</p>
          <p className="text-sm mt-2">Your transaction history will appear here</p>
        </div>
      </div>
    );
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownCircle className="h-4 w-4 text-green-600" />;
      case 'withdrawal':
        return <ArrowUpCircle className="h-4 w-4 text-red-600" />;
      case 'transfer':
        return <ArrowRightLeft className="h-4 w-4 text-blue-600" />;
      case 'conversion':
        return <RefreshCw className="h-4 w-4 text-purple-600" />;
      default:
        return <ArrowRightLeft className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: any = {
      deposit: 'Deposit',
      withdrawal: 'Withdrawal',
      transfer: 'Transfer',
      conversion: 'Conversion'
    };
    return labels[type] || type;
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <Badge className="bg-green-600">Completed</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status || 'Unknown'}</Badge>;
    }
  };

  const formatAmount = (amount: number, currencyCode: string) => {
    const symbols: any = {
      NGN: '₦',
      USD: '$',
      GBP: '£',
      EUR: '€'
    };
    
    const symbol = symbols[currencyCode] || currencyCode;
    return `${symbol}${amount.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  const getCurrencyCode = (transaction: Transaction): string => {
    // Handle both string currency and object currency
    if (typeof transaction.currency === 'string') {
      return transaction.currency;
    }
    if (transaction.currencyCode) {
      return transaction.currencyCode;
    }
    if (transaction.currency?.code) {
      return transaction.currency.code;
    }
    return 'NGN'; // Default fallback
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return timestamp;
    }
  };

  const getAmountColor = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'text-green-600';
      case 'withdrawal':
        return 'text-red-600';
      case 'conversion':
        return 'text-purple-600';
      default:
        return 'text-gray-900';
    }
  };

  const getAmountPrefix = (type: string) => {
    switch (type) {
      case 'deposit':
        return '+';
      case 'withdrawal':
        return '-';
      default:
        return '';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => {
            const currencyCode = getCurrencyCode(transaction);
            
            return (
              <TableRow key={transaction.id}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(transaction.type)}
                    <span className="font-medium">{getTypeLabel(transaction.type)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{transaction.description || 'Transaction'}</p>
                    <p className="text-xs text-gray-500">{transaction.reference}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`font-semibold ${getAmountColor(transaction.type)}`}>
                    {getAmountPrefix(transaction.type)}{formatAmount(transaction.amount, currencyCode)}
                  </span>
                  {transaction.fee && transaction.fee > 0 && (
                    <p className="text-xs text-gray-500">Fee: {formatAmount(transaction.fee, currencyCode)}</p>
                  )}
                </TableCell>
                <TableCell>
                  {getStatusBadge(transaction.status)}
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-sm text-gray-600">
                    {formatTimestamp(transaction.createdAt)}
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
