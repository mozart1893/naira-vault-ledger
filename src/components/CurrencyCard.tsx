import { useState } from "react";
import { CURRENCIES, EXCHANGE_RATES } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PayoutModal } from "./PayoutModal";
import { Info, ArrowDown } from "lucide-react";

interface CurrencyCardProps {
  currencyCode: keyof typeof CURRENCIES;
  ledgerBalance: number;
  availableBalance: number;
  holds: number;
  lastUpdated: string;
  walletData?: any;
  onPayoutSuccess?: () => void;
}

export const CurrencyCard = ({
  currencyCode,
  ledgerBalance,
  availableBalance,
  holds,
  lastUpdated,
  walletData,
  onPayoutSuccess,
}: CurrencyCardProps) => {
  const [showPayoutModal, setShowPayoutModal] = useState(false);

  const handlePayoutClick = () => {
    setShowPayoutModal(true);
  };

  const handlePayoutSuccess = () => {
    if (onPayoutSuccess) {
      onPayoutSuccess();
    }
  };

  const currency = CURRENCIES[currencyCode];
  const formattedLedgerBalance = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 2,
  }).format(ledgerBalance);

  const formattedAvailableBalance = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 2,
  }).format(availableBalance);

  // Calculate NGN equivalent for non-NGN currencies
  let ngnEquivalent = ledgerBalance;
  if (currencyCode !== 'NGN') {
    ngnEquivalent = ledgerBalance * EXCHANGE_RATES[currencyCode].NGN;
  }

  const formattedNgnEquivalent = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 2,
  }).format(ngnEquivalent);

  const lastUpdatedDate = new Date(lastUpdated);
  const formattedLastUpdated = lastUpdatedDate.toLocaleString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <>
      <Card className={`currency-card ${currency.code.toLowerCase()} shadow-md hover:shadow-xl transition-shadow duration-300`}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xl">{currency.name}</span>
              <span className="text-2xl font-bold">{currency.symbol}</span>
            </div>
            <span className="text-sm text-muted-foreground">{currency.code}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Ledger Balance:</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center">
                        <Info className="h-4 w-4 ml-1 text-muted-foreground" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px] text-xs">
                        Ledger Balance is the total balance in your account, including funds that may be on hold.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <span className="text-2xl font-bold">{formattedLedgerBalance}</span>
              {currencyCode !== 'NGN' && (
                <span className="text-sm text-muted-foreground">≈ {formattedNgnEquivalent}</span>
              )}
            </div>
            <div className="flex flex-col space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Available Balance:</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center">
                        <Info className="h-4 w-4 ml-1 text-muted-foreground" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px] text-xs">
                        Available Balance is the amount that is currently available for spending or withdrawal.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <span className="text-xl font-semibold">{formattedAvailableBalance}</span>
            </div>
            {holds > 0 && (
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-muted-foreground">Funds on Hold:</span>
                <span className="text-md font-semibold text-amber-600">
                  {currency.symbol}{holds.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            )}
            <div className="pt-2 border-t border-border">
              <span className="text-xs text-muted-foreground">Last updated: {formattedLastUpdated}</span>
            </div>

            {/* Payout Button */}
            {walletData && (
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handlePayoutClick}
                >
                  <ArrowDown className="mr-2 h-4 w-4" />
                  Payout
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payout Modal */}
      {walletData && (
        <PayoutModal
          open={showPayoutModal}
          onClose={() => setShowPayoutModal(false)}
          wallet={walletData}
          onSuccess={handlePayoutSuccess}
        />
      )}
    </>
  );
};
