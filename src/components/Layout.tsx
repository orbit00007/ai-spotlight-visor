import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { Star, Search, BarChart3, User, LogOut } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

export const Layout = ({ children, showNavigation = true }: LayoutProps) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-bg">
      {showNavigation && (
        <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-2">
                <span className="text-3xl font-bold gradient-text">GeoRankers</span>
              </Link>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                {user ? (
                  <>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span className="text-sm text-muted-foreground">
                        Welcome, {user.name}
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleLogout}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : location.pathname === '/login' ? (
                  <Link to="/register">
                    <Button variant="outline" size="sm">Register</Button>
                  </Link>
                ) : location.pathname === '/register' ? (
                  <Link to="/login">
                    <Button variant="outline" size="sm">Login</Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/login">
                      <Button variant="ghost" size="sm">Login</Button>
                    </Link>
                    <Link to="/register">
                      <Button variant="default" size="sm">Get Started</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
      )}
      
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};