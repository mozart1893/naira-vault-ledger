import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import {
  Shield,
  LayoutDashboard,
  Users,
  FileCheck,
  TrendingUp,
  Wallet,
  Globe,
  Settings,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";

export const AdminHeader = () => {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <header className="bg-slate-900 shadow-lg border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-purple-400" />
              <div>
                <span className="text-xl font-bold text-white">NairaVault</span>
                <span className="text-xs text-purple-300 block">Admin Portal</span>
              </div>
            </Link>
          </div>

          <nav className="flex items-center space-x-4">
            <Link to="/dashboard">
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-slate-800">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link to="/users">
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-slate-800">
                <Users className="mr-2 h-4 w-4" />
                Users
              </Button>
            </Link>
            <Link to="/kyc">
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-slate-800">
                <FileCheck className="mr-2 h-4 w-4" />
                KYC
              </Button>
            </Link>
            <Link to="/analytics">
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-slate-800">
                <TrendingUp className="mr-2 h-4 w-4" />
                Analytics
              </Button>
            </Link>
            <Link to="/wallets">
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-slate-800">
                <Wallet className="mr-2 h-4 w-4" />
                Wallets
              </Button>
            </Link>
            <Link to="/currencies">
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-slate-800">
                <Globe className="mr-2 h-4 w-4" />
                Currencies
              </Button>
            </Link>

            {/* Admin Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarFallback className="bg-purple-600 text-white">
                      {admin?.email.charAt(0).toUpperCase() || "A"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {admin?.name || "Admin User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {admin?.email}
                    </p>
                    <p className="text-xs text-purple-600 font-medium mt-1">
                      {admin?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  );
};

