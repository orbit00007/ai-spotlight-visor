import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Search, Calendar, BarChart3, History, Home, Filter } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { ModeToggle } from "@/components/mode-toggle";
import { InsightCards } from "@/components/results/insight-cards";
import { RecommendedActions } from "@/components/results/recommended-actions";
import { Drilldowns } from "@/components/results/drilldowns";
import { mockInsightsData } from "@/lib/mock-data";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("query-explorer");
  const [data] = useState(mockInsightsData);

  const { brand, keywords, isExample } = location.state || {};

  useEffect(() => {
    if (!brand || !keywords) {
      navigate("/");
    }
  }, [brand, keywords, navigate]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getBrandInitials = (brandName: string) => {
    return brandName
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleQueryExplorer = (filter?: string) => {
    setActiveTab("query-explorer");
    // Scroll to drilldowns section
    document.getElementById("drilldowns")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSourcesDetail = () => {
    setActiveTab("sources");
    document.getElementById("drilldowns")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAttributesMatrix = () => {
    setActiveTab("attributes");
    document.getElementById("drilldowns")?.scrollIntoView({ behavior: "smooth" });
  };

  if (!brand || !keywords) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Dashboard Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          {/* Main Navigation */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/")}
                  className="hover:bg-primary/10"
                >
                  <Home className="h-4 w-4" />
                </Button>
                <div className="h-6 w-px bg-border" />
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 hover:bg-accent/10"
                  onClick={() => navigate("/")}
                >
                  <History className="h-4 w-4" />
                  <span className="hidden sm:inline">Previous Searches</span>
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="hidden lg:flex items-center space-x-4 text-sm bg-muted/50 rounded-lg px-3 py-2">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  <span className="font-medium">{data.summary.total_queries}</span>
                  <span className="text-muted-foreground">queries</span>
                </div>
                <div className="h-4 w-px bg-border" />
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-accent" />
                  <span className="text-muted-foreground">{formatDate(data.created_at)}</span>
                </div>
              </div>
              
              <ModeToggle />
              {user && (
                <Button variant="outline" size="sm" onClick={logout}>
                  Logout
                </Button>
              )}
            </div>
          </div>

          {/* Brand Info Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                  <AvatarFallback className="bg-gradient-primary text-white font-bold text-lg">
                    {getBrandInitials(brand)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-background" />
              </div>
              
              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    {brand}
                  </h1>
                  {isExample && (
                    <Badge className="bg-accent/10 text-accent border-accent/20">
                      Example Data
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  AI visibility insights dashboard
                </p>
              </div>
            </div>

            {/* Mobile Stats */}
            <div className="lg:hidden flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2 bg-primary/5 rounded-lg px-3 py-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                <span className="font-medium">{data.summary.total_queries}</span>
              </div>
              <div className="flex items-center space-x-2 bg-accent/5 rounded-lg px-3 py-2">
                <Calendar className="h-4 w-4 text-accent" />
                <span className="text-xs">{new Date(data.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Keywords Section */}
          <div className="mt-4 p-4 bg-gradient-card rounded-xl border border-border/50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">Target Keywords</span>
              <Badge variant="outline" className="bg-primary/5 text-primary">
                {keywords.length} keywords
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword: string, index: number) => (
                <Badge 
                  key={index} 
                  className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors"
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Insight Cards Section */}
        <section>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-2xl font-bold">Performance Overview</h2>
          </div>
          <InsightCards
            data={data}
            onQueryExplorer={handleQueryExplorer}
            onSourcesDetail={handleSourcesDetail}
            onAttributesMatrix={handleAttributesMatrix}
          />
        </section>

        {/* Recommended Actions Section */}
        <section>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-secondary rounded-lg flex items-center justify-center">
              <Search className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-2xl font-bold">Recommended Actions</h2>
          </div>
          <RecommendedActions actions={data.actions} />
        </section>

        {/* Drilldowns Section */}
        <section id="drilldowns">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center">
              <Filter className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-2xl font-bold">Detailed Analysis</h2>
          </div>
          <Drilldowns drilldowns={data.drilldowns} activeFilter={activeTab} />
        </section>
      </main>
    </div>
  );
};

export default Results;