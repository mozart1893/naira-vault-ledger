import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/AdminHeader";
import { adminApi } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  User,
  Mail,
  Phone,
  Calendar,
  AlertCircle,
  Download,
  ZoomIn
} from "lucide-react";

export default function KYCManagement() {
  const [selectedKYC, setSelectedKYC] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [pendingKYC, setPendingKYC] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingKYC();
  }, []);

  const fetchPendingKYC = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getPendingKYC();
      if (response.success) {
        setPendingKYC(response.data);
      }
    } catch (error) {
      console.error('Error fetching pending KYC:', error);
      toast.error('Failed to load pending KYC verifications');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (kycId: string) => {
    try {
      const response = await adminApi.approveKYC(kycId);
      if (response.success) {
        toast.success("KYC verification approved!");
        setSelectedKYC(null);
        fetchPendingKYC(); // Refresh list
      }
    } catch (error) {
      toast.error("Failed to approve KYC");
    }
  };

  const handleReject = async (kycId: string) => {
    if (!rejectionReason) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    try {
      const response = await adminApi.rejectKYC(kycId, rejectionReason);
      if (response.success) {
        toast.success("KYC verification rejected. User has been notified.");
        setSelectedKYC(null);
        setRejectionReason("");
        fetchPendingKYC(); // Refresh list
      }
    } catch (error) {
      toast.error("Failed to reject KYC");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">KYC Management</h1>
            <p className="text-gray-600 mt-2">Review and verify user identity documents</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* KYC List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Pending Verifications
                    <Badge variant="secondary">{pendingKYC.length}</Badge>
                  </CardTitle>
                  <CardDescription>Click to review documents</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
                    </div>
                  ) : pendingKYC.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-8">
                      No pending KYC verifications
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {pendingKYC.map((kyc) => (
                      <div
                        key={kyc.id}
                        onClick={() => setSelectedKYC(kyc)}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedKYC?.id === kyc.id
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-sm">{kyc.user.name}</p>
                            <p className="text-xs text-gray-500">{kyc.user.email}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {kyc.verificationType}
                          </Badge>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(kyc.submittedAt)}
                        </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* KYC Details */}
            <div className="lg:col-span-2">
              {selectedKYC ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Verification Details</CardTitle>
                    <CardDescription>
                      Review and verify user submitted documents
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* User Info */}
                    <div>
                      <h3 className="font-semibold mb-3">User Information</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-gray-600">Name</p>
                            <p className="font-medium">{selectedKYC.user.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-gray-600">Email</p>
                            <p className="font-medium">{selectedKYC.user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-gray-600">Phone</p>
                            <p className="font-medium">{selectedKYC.user.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-gray-600">Submitted</p>
                            <p className="font-medium">{formatDate(selectedKYC.submittedAt)}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Verification Details */}
                    <div>
                      <h3 className="font-semibold mb-3">Verification Details</h3>
                      <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm text-gray-600">Verification Method</p>
                          <p className="font-medium">{selectedKYC.verificationType}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">
                            {selectedKYC.verificationType} Number
                          </p>
                          <p className="font-medium font-mono">{selectedKYC.verificationNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">ID Type</p>
                          <p className="font-medium capitalize">
                            {selectedKYC.idType.replace("_", " ")}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">ID Number</p>
                          <p className="font-medium">{selectedKYC.idNumber}</p>
                        </div>
                      </div>
                    </div>

                    {/* Documents */}
                    <div>
                      <h3 className="font-semibold mb-3">Submitted Documents</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {/* ID Card */}
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium">Government ID</p>
                            <Button variant="ghost" size="sm">
                              <ZoomIn className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="aspect-video bg-gray-100 rounded flex items-center justify-center">
                            <FileText className="h-12 w-12 text-gray-400" />
                            <p className="text-sm text-gray-500 ml-2">Document Preview</p>
                          </div>
                          <Button variant="outline" size="sm" className="w-full mt-2">
                            <Download className="mr-2 h-3 w-3" />
                            Download
                          </Button>
                        </div>

                        {/* Selfie */}
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium">Selfie Photo</p>
                            <Button variant="ghost" size="sm">
                              <ZoomIn className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="aspect-video bg-gray-100 rounded flex items-center justify-center">
                            <User className="h-12 w-12 text-gray-400" />
                            <p className="text-sm text-gray-500 ml-2">Photo Preview</p>
                          </div>
                          <Button variant="outline" size="sm" className="w-full mt-2">
                            <Download className="mr-2 h-3 w-3" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Rejection Reason */}
                    <div className="space-y-2">
                      <Label htmlFor="rejection-reason">Rejection Reason (Optional)</Label>
                      <Textarea
                        id="rejection-reason"
                        placeholder="Provide a reason if rejecting this verification..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        rows={3}
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-4 pt-4">
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => handleApprove(selectedKYC.id)}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve Verification
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() => handleReject(selectedKYC.id)}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject Verification
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="h-full flex items-center justify-center">
                  <CardContent className="text-center py-12">
                    <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      Select a KYC submission from the list to review
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

