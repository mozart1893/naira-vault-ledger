import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, DollarSign } from "lucide-react";

interface PayoutModalProps {
  open: boolean;
  onClose: () => void;
  wallet: any;
  onSuccess: () => void;
}

export function PayoutModal({ open, onClose, wallet, onSuccess }: PayoutModalProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payoutAmount = parseFloat(amount);

    if (!payoutAmount || payoutAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (payoutAmount > wallet.availableBalance) {
      toast.error("Insufficient balance");
      return;
    }

    setLoading(true);

    try {
      const response = await api.simulatePayout(
        wallet.id,
        payoutAmount,
        description || "Wallet payout"
      );

      if (response.success) {
        toast.success(`Successfully withdrew ${payoutAmount} ${wallet.currency}`);
        setAmount("");
        setDescription("");
        onSuccess();
        onClose();
      } else {
        toast.error(response.error?.message || "Payout failed");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to process payout");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setAmount("");
      setDescription("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Simulate Payout</DialogTitle>
          <DialogDescription>
            Withdraw funds from your {wallet?.currency} wallet
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Available Balance</Label>
            <div className="text-2xl font-bold text-purple-600">
              {wallet?.currency} {wallet?.availableBalance?.toLocaleString() || 0}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount *</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10"
                disabled={loading}
                required
              />
            </div>
            <p className="text-xs text-gray-500">
              Maximum: {wallet?.availableBalance?.toLocaleString()} {wallet?.currency}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="e.g., ATM Withdrawal, Bill Payment"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              disabled={loading}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Payout"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

