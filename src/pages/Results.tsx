import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Search, Calendar, BarChart3 } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-hero">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left Side - Brand Info */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
                className="shrink-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-primary text-white font-semibold">
                    {getBrandInitials(brand)}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <div className="flex items-center space-x-2">
                    <h1 className="font-semibold text-lg">{brand}</h1>
                    {isExample && (
                      <Badge variant="secondary" className="bg-accent/10 text-accent">
                        Example Data
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    These insights come directly from AI answers.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Stats and Controls */}
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  <span>
                    <span className="font-medium">Queries analyzed:</span>{" "}
                    <span className="text-foreground">{data.summary.total_queries}</span>
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    <span className="font-medium">Generated:</span>{" "}
                    <span className="text-foreground">{formatDate(data.created_at)}</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <ModeToggle />
                {user && (
                  <Button variant="outline" size="sm" onClick={logout}>
                    Logout
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Keywords Display */}
          <div className="flex items-center space-x-2 mt-3">
            <span className="text-sm text-muted-foreground">Keywords:</span>
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword: string, index: number) => (
                <Badge key={index} variant="outline" className="bg-primary/5">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Insight Cards Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">AI Visibility Insights</h2>
          <InsightCards
            data={data}
            onQueryExplorer={handleQueryExplorer}
            onSourcesDetail={handleSourcesDetail}
            onAttributesMatrix={handleAttributesMatrix}
          />
        </section>

        {/* Recommended Actions Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Recommended Actions</h2>
          <RecommendedActions actions={data.actions} />
        </section>

        {/* Drilldowns Section */}
        <section id="drilldowns">
          <h2 className="text-2xl font-bold mb-6">Evidence & Transparency</h2>
          <Drilldowns drilldowns={data.drilldowns} activeFilter={activeTab} />
        </section>
      </main>
    </div>
  );
};

export default Results;