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
  const [activeTab, setActiveTab] = useState<string>("pending");
  const [allKYC, setAllKYC] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<any>(null);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<{type: 'id' | 'selfie', data: string} | null>(null);

  useEffect(() => {
    fetchAllKYC();
  }, []);

  const fetchAllKYC = async () => {
    try {
      setLoading(true);
      // Fetch all users with their KYC status
      const response = await adminApi.getAllUsers({ limit: 1000 });
      if (response.success) {
        setAllKYC(response.data.users);
      }
    } catch (error) {
      console.error('Error fetching KYC data:', error);
      toast.error('Failed to load KYC data');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredKYC = () => {
    switch (activeTab) {
      case 'pending':
        return allKYC.filter(user => user.kycStatus === 'pending');
      case 'verified':
        return allKYC.filter(user => user.kycStatus === 'verified');
      case 'rejected':
        return allKYC.filter(user => user.kycStatus === 'rejected');
      case 'not_started':
        return allKYC.filter(user => !user.kycStatus || user.kycStatus === 'pending');
      case 'all':
      default:
        return allKYC;
    }
  };

  const filteredKYC = getFilteredKYC();

  const fetchDocuments = async (userId: string) => {
    try {
      setLoadingDocs(true);
      const response = await adminApi.getKYCDocuments(userId);
      if (response.success) {
        setDocuments(response.data);
      } else {
        setDocuments(null);
        toast.error('Documents not found for this user');
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      setDocuments(null);
    } finally {
      setLoadingDocs(false);
    }
  };

  const handleSelectKYC = (kyc: any) => {
    setSelectedKYC(kyc);
    setDocuments(null);
    // Fetch documents if user has pending or verified KYC
    if (kyc.kycStatus === 'pending' || kyc.kycStatus === 'verified' || kyc.kycStatus === 'rejected') {
      fetchDocuments(kyc.id);
    }
  };

  const handleDownload = (docType: 'id' | 'selfie') => {
    if (!documents) return;

    const doc = docType === 'id' ? documents.idCard : documents.selfie;
    const dataUrl = `data:${doc.type};base64,${doc.data}`;
    
    // Create download link
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = doc.name || `${docType}-document`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`${docType === 'id' ? 'ID Document' : 'Selfie'} downloaded`);
  };

  const handlePreview = (docType: 'id' | 'selfie') => {
    if (!documents) return;

    const doc = docType === 'id' ? documents.idCard : documents.selfie;
    const dataUrl = `data:${doc.type};base64,${doc.data}`;
    
    setPreviewDoc({ type: docType, data: dataUrl });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-600">Verified</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Not Started</Badge>;
    }
  };

  const handleApprove = async (kycId: string) => {
    try {
      const response = await adminApi.approveKYC(kycId);
      if (response.success) {
        toast.success("KYC verification approved!");
        setSelectedKYC(null);
        fetchAllKYC(); // Refresh list
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
        fetchAllKYC(); // Refresh list
      }
    } catch (error) {
      toast.error("Failed to reject KYC");
    }
  };

  const handleAllowResubmission = async (userId: string, userName: string) => {
    try {
      const response = await adminApi.allowKYCResubmission(userId);
      if (response.success) {
        toast.success(`${userName} can now resubmit KYC documents`);
        // Update the selected KYC status
        setSelectedKYC({
          ...selectedKYC,
          kycStatus: 'pending'
        });
        fetchAllKYC(); // Refresh list
      }
    } catch (error) {
      toast.error("Failed to allow resubmission");
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

          {/* Tabs for KYC Status Filter */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">
                All ({allKYC.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({allKYC.filter(u => u.kycStatus === 'pending').length})
              </TabsTrigger>
              <TabsTrigger value="verified">
                Verified ({allKYC.filter(u => u.kycStatus === 'verified').length})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected ({allKYC.filter(u => u.kycStatus === 'rejected').length})
              </TabsTrigger>
              <TabsTrigger value="not_started">
                Not Started ({allKYC.filter(u => !u.kycStatus || u.kycStatus === 'pending').length})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* KYC List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {activeTab === 'all' && `All KYC Submissions`}
                    {activeTab === 'pending' && `Pending Verifications`}
                    {activeTab === 'verified' && `Verified Users`}
                    {activeTab === 'rejected' && `Rejected Submissions`}
                    {activeTab === 'not_started' && `Not Started`}
                    <Badge variant="secondary">{filteredKYC.length}</Badge>
                  </CardTitle>
                  <CardDescription>
                    {activeTab === 'pending' && 'Click to review documents'}
                    {activeTab === 'verified' && 'Completed verifications'}
                    {activeTab === 'rejected' && 'Failed verifications'}
                    {activeTab === 'not_started' && 'Users who haven\'t started'}
                    {activeTab === 'all' && 'All users and their status'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
                    </div>
                  ) : filteredKYC.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-8">
                      No {activeTab} KYC submissions
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {filteredKYC.map((kyc) => (
                      <div
                        key={kyc.id}
                        onClick={() => handleSelectKYC(kyc)}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedKYC?.id === kyc.id
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-sm">{kyc.name}</p>
                            <p className="text-xs text-gray-500">{kyc.email}</p>
                          </div>
                          {getStatusBadge(kyc.kycStatus)}
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(kyc.createdAt)}
                          </div>
                          {kyc.phone && (
                            <span className="text-xs">{kyc.phone.substring(0, 10)}...</span>
                          )}
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
                    {/* User Info with Status */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">User Information</h3>
                        {getStatusBadge(selectedKYC.kycStatus)}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-gray-600">Name</p>
                            <p className="font-medium">{selectedKYC.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-gray-600">Email</p>
                            <p className="font-medium">{selectedKYC.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-gray-600">Phone</p>
                            <p className="font-medium">{selectedKYC.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-gray-600">Registered</p>
                            <p className="font-medium">{formatDate(selectedKYC.createdAt)}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Verification Details with Manual Approval */}
                    <div>
                      <h3 className="font-semibold mb-3">Verification Components</h3>
                      <div className="space-y-4">
                        {/* BVN/NIN Verification */}
                        <div className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="font-medium">
                                  {selectedKYC.verificationType} Verification
                                </h4>
                                <Badge variant="outline" className="text-xs">
                                  Step 1
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                  <p className="text-gray-600">Method</p>
                                  <p className="font-medium">{selectedKYC.verificationType}</p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Number</p>
                                  <p className="font-medium font-mono">{selectedKYC.verificationNumber}</p>
                                </div>
                              </div>
                            </div>
                            <div className="ml-4">
                              <Button variant="outline" size="sm" className="text-xs">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verify {selectedKYC.verificationType}
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500">
                            Click "Verify" to check against CBN database
                          </p>
                        </div>

                        {/* ID Document Verification */}
                        <div className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="font-medium">Government ID Document</h4>
                                <Badge variant="outline" className="text-xs">
                                  Step 2
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                  <p className="text-gray-600">ID Type</p>
                                  <p className="font-medium capitalize">
                                    {selectedKYC.idType?.replace("_", " ") || "Not specified"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-600">ID Number</p>
                                  <p className="font-medium">{selectedKYC.idNumber || "Not specified"}</p>
                                </div>
                              </div>
                            </div>
                            <div className="ml-4">
                              <Button variant="outline" size="sm" className="text-xs">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Approve ID
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500">
                            Review ID document photo below and approve if valid
                          </p>
                        </div>

                        {/* Selfie Photo Verification */}
                        <div className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="font-medium">Selfie Photo Verification</h4>
                                <Badge variant="outline" className="text-xs">
                                  Step 3
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">
                                Verify selfie matches ID photo and user information
                              </p>
                            </div>
                            <div className="ml-4">
                              <Button variant="outline" size="sm" className="text-xs">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Approve Selfie
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500">
                            Compare selfie photo with ID document
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Documents */}
                    <div>
                      <h3 className="font-semibold mb-3">Submitted Documents</h3>
                      {loadingDocs ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
                        </div>
                      ) : !documents ? (
                        <div className="text-center py-8">
                          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">No documents uploaded yet</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-4">
                          {/* ID Card */}
                          <div className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm font-medium">Government ID</p>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handlePreview('id')}
                              >
                                <ZoomIn className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="aspect-video bg-gray-100 rounded flex items-center justify-center overflow-hidden cursor-pointer"
                                 onClick={() => handlePreview('id')}>
                              {documents.idCard ? (
                                <img
                                  src={`data:${documents.idCard.type};base64,${documents.idCard.data}`}
                                  alt="Government ID"
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <>
                                  <FileText className="h-12 w-12 text-gray-400" />
                                  <p className="text-sm text-gray-500 ml-2">No Document</p>
                                </>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-2 mb-2">{documents.idCard?.name}</p>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full"
                              onClick={() => handleDownload('id')}
                              disabled={!documents.idCard}
                            >
                              <Download className="mr-2 h-3 w-3" />
                              Download
                            </Button>
                          </div>

                          {/* Selfie */}
                          <div className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm font-medium">Selfie Photo</p>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handlePreview('selfie')}
                              >
                                <ZoomIn className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="aspect-video bg-gray-100 rounded flex items-center justify-center overflow-hidden cursor-pointer"
                                 onClick={() => handlePreview('selfie')}>
                              {documents.selfie ? (
                                <img
                                  src={`data:${documents.selfie.type};base64,${documents.selfie.data}`}
                                  alt="Selfie"
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <>
                                  <User className="h-12 w-12 text-gray-400" />
                                  <p className="text-sm text-gray-500 ml-2">No Photo</p>
                                </>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-2 mb-2">{documents.selfie?.name}</p>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full"
                              onClick={() => handleDownload('selfie')}
                              disabled={!documents.selfie}
                            >
                              <Download className="mr-2 h-3 w-3" />
                              Download
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Image Preview Modal */}
                    {previewDoc && (
                      <div 
                        className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
                        onClick={() => setPreviewDoc(null)}
                      >
                        <div className="max-w-4xl max-h-full relative">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2 bg-white hover:bg-gray-100"
                            onClick={() => setPreviewDoc(null)}
                          >
                            ✕
                          </Button>
                          <img
                            src={previewDoc.data}
                            alt={previewDoc.type === 'id' ? 'Government ID' : 'Selfie'}
                            className="max-w-full max-h-[90vh] object-contain rounded-lg"
                          />
                          <p className="text-white text-center mt-2">
                            {previewDoc.type === 'id' ? 'Government ID Document' : 'Selfie Photo'}
                          </p>
                        </div>
                      </div>
                    )}

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

                    {/* Actions - Only show for pending KYC */}
                    {selectedKYC.kycStatus === 'pending' && (
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
                    )}

                    {/* Status Info for Non-Pending */}
                    {selectedKYC.kycStatus === 'verified' && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg mt-4">
                        <div className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                          <div>
                            <p className="font-medium text-green-900">KYC Verified</p>
                            <p className="text-sm text-green-700">
                              This user has been successfully verified
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedKYC.kycStatus === 'rejected' && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg mt-4">
                        <div className="flex items-center mb-3">
                          <XCircle className="h-5 w-5 text-red-600 mr-2" />
                          <div>
                            <p className="font-medium text-red-900">KYC Rejected</p>
                            <p className="text-sm text-red-700">
                              This verification was rejected. Click below to allow user to resubmit.
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => handleAllowResubmission(selectedKYC.id, selectedKYC.name)}
                        >
                          Allow Resubmission
                        </Button>
                        <p className="text-xs text-gray-600 mt-2 text-center">
                          This will change status to "Pending" so user can submit new documents
                        </p>
                      </div>
                    )}

                    {(!selectedKYC.kycStatus || selectedKYC.kycStatus === 'pending') && selectedKYC.kycStatus !== 'pending' && (
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg mt-4">
                        <div className="flex items-center">
                          <AlertCircle className="h-5 w-5 text-gray-600 mr-2" />
                          <div>
                            <p className="font-medium text-gray-900">No KYC Submission</p>
                            <p className="text-sm text-gray-700">
                              This user hasn't started KYC verification yet
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
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

