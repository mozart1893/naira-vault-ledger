
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DollarSign, BookOpen, LayoutDashboard } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <DollarSign className="h-8 w-8 text-vault-primary" />
              <span className="ml-2 text-xl font-bold text-vault-primary">NairaVault</span>
            </div>
          </div>
          <nav className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" className="flex items-center">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link to="/documentation">
              <Button variant="ghost" className="flex items-center">
                <BookOpen className="mr-2 h-4 w-4" />
                Documentation
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
