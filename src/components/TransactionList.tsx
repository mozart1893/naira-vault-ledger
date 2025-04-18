
import { CURRENCIES, TRANSACTION_TYPES, TRANSACTION_STATUS } from "@/lib/constants";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  ArrowDown, 
  ArrowUp, 
  RotateCcw, 
  CreditCard, 
  Clock, 
  CheckCircle, 
  XCircle 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  currencyCode: string;
  targetCurrencyCode?: string;
  targetAmount?: number;
  status: string;
  description: string;
  timestamp: string;
  reference: string;
}

interface TransactionListProps {
  transactions: Transaction[];
}

export const TransactionList = ({ transactions }: TransactionListProps) => {
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case TRANSACTION_TYPES.DEPOSIT:
        return <ArrowDown className="h-4 w-4 text-green-500" />;
      case TRANSACTION_TYPES.WITHDRAWAL:
        return <ArrowUp className="h-4 w-4 text-red-500" />;
      case TRANSACTION_TYPES.TRANSFER:
        return <CreditCard className="h-4 w-4 text-blue-500" />;
      case TRANSACTION_TYPES.CONVERSION:
        return <RotateCcw className="h-4 w-4 text-purple-500" />;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case TRANSACTION_STATUS.PENDING:
        return <Clock className="h-4 w-4 text-amber-500" />;
      case TRANSACTION_STATUS.COMPLETED:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case TRANSACTION_STATUS.FAILED:
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case TRANSACTION_STATUS.PENDING:
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            Pending
          </Badge>
        );
      case TRANSACTION_STATUS.COMPLETED:
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Completed
          </Badge>
        );
      case TRANSACTION_STATUS.FAILED:
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
            Failed
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatAmount = (amount: number, currencyCode: string) => {
    const currency = CURRENCIES[currencyCode as keyof typeof CURRENCIES];
    return `${currency.symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="rounded-md border animate-fade-in">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead className="hidden md:table-cell">Reference</TableHead>
            <TableHead className="hidden md:table-cell">Date & Time</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-2">
                  {getTransactionIcon(transaction.type)}
                  <span className="capitalize">{transaction.type}</span>
                </div>
              </TableCell>
              <TableCell>
                {transaction.description}
                {transaction.type === TRANSACTION_TYPES.CONVERSION && transaction.targetCurrencyCode && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {`${transaction.currencyCode} → ${transaction.targetCurrencyCode}`}
                  </div>
                )}
              </TableCell>
              <TableCell>
                <div className="font-semibold">
                  {formatAmount(transaction.amount, transaction.currencyCode)}
                </div>
                {transaction.type === TRANSACTION_TYPES.CONVERSION && transaction.targetAmount && transaction.targetCurrencyCode && (
                  <div className="text-xs text-muted-foreground">
                    {`→ ${formatAmount(transaction.targetAmount, transaction.targetCurrencyCode)}`}
                  </div>
                )}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <code className="text-xs">{transaction.reference}</code>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {formatTimestamp(transaction.timestamp)}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(transaction.status)}
                  {getStatusBadge(transaction.status)}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
