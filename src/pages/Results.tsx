// src/pages/Results.tsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getProductAnalytics } from "@/apiHelpers";

interface InputStateAny {
  product?: { id: string; name?: string; website?: string };
  id?: string;
  productId?: string;
  website?: string;
  search_keywords?: Array<{ id?: string; keyword: string }>;
  keywords?: string[];
  isExample?: boolean;
  analytics?: any;
}

interface InsightCard {
  title: string;
  value: string;
  trend?: "up" | "down" | "stable" | "unknown";
  description?: string;
}

interface RecommendedAction {
  category: string;
  priority?: string;
  action?: string;
  impact?: string;
  effort?: string;
}

interface AnalyticsData {
  id?: string;
  type?: string;
  status?: string;
  analytics?: {
    insight_cards?: InsightCard[];
    recommended_actions?: RecommendedAction[];
    drilldowns?: {
      query_explorer?: any[];
      sources_list?: any[];
      attributes_matrix?: any[];
    };
    reason_missing?: string;
  };
  created_at?: string;
  updated_at?: string;
}

interface ResultsData {
  website: string;
  product: { id: string; name?: string };
  search_keywords: Array<{ id?: string; keyword: string }>;
  isExample?: boolean;
}

export default function Results() {
  const [resultsData, setResultsData] = useState<ResultsData | null>(null);
  const [currentTab, setCurrentTab] = useState<string>("overall");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { user } = useAuth();
  const accessToken = localStorage.getItem("access_token") || "";
  const navigate = useNavigate();
  const location = useLocation();
  const pollingRef = useRef<{ productTimer?: number }>({});
  const mountedRef = useRef(true);

  // Parse and normalize location.state
  useEffect(() => {
    mountedRef.current = true;
    const state = (location.state || {}) as InputStateAny;

    if (state && state.product?.id) {
      const normalized: ResultsData = {
        website:
          (state.website ||
            state.product.website ||
            state.product.name ||
            "") + "",
        product: {
          id: state.product.id,
          name: state.product.name || state.product.website || state.product.id,
        },
        search_keywords: (state.search_keywords || []).map((k) => ({
          id: k.id,
          keyword: k.keyword,
        })),
        isExample: !!state.isExample,
      };
      setResultsData(normalized);
    } else if ((state as any).productId || (state as any).id) {
      const pid = (state as any).productId || (state as any).id;
      const normalized: ResultsData = {
        website: state.website || "",
        product: { id: pid.toString(), name: state.website || pid.toString() },
        search_keywords: Array.isArray(state.search_keywords)
          ? state.search_keywords.map((k) => ({ id: k.id, keyword: k.keyword }))
          : (state.keywords || []).map((k: string) => ({ keyword: k })),
        isExample: !!state.isExample,
      };
      setResultsData(normalized);
    } else {
      navigate("/input");
    }

    return () => {
      mountedRef.current = false;
    };
  }, [location.state, navigate]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (pollingRef.current.productTimer) {
        clearTimeout(pollingRef.current.productTimer);
      }
    };
  }, []);

  // Poll product analytics
  const pollProductAnalytics = useCallback(
    async (productId: string) => {
      if (!productId || !accessToken || !mountedRef.current) return;
      try {
        setIsLoading(true);
        const today = new Date().toISOString().split("T")[0];
        const res = await getProductAnalytics(productId, today, accessToken);
        if (!mountedRef.current) return;

        if (res) setAnalyticsData(res);

        const status = res?.status?.toLowerCase() || "";
        if (status !== "completed") {
          if (pollingRef.current.productTimer) {
            clearTimeout(pollingRef.current.productTimer);
          }
          pollingRef.current.productTimer = window.setTimeout(() => {
            pollProductAnalytics(productId);
          }, 5000);
        } else {
          setIsLoading(false);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch overall analytics");
        setIsLoading(false);
      }
    },
    [accessToken]
  );

  useEffect(() => {
    if (resultsData?.product?.id && currentTab === "overall") {
      if (pollingRef.current.productTimer) {
        clearTimeout(pollingRef.current.productTimer);
      }
      pollProductAnalytics(resultsData.product.id);
    }
  }, [resultsData, currentTab, pollProductAnalytics]);

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    if (tab === "overall" && resultsData?.product?.id) {
      pollProductAnalytics(resultsData.product.id);
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch ((trend || "").toLowerCase()) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch ((priority || "").toLowerCase()) {
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      default:
        return "outline";
    }
  };

  const formatDate = (iso?: string) => {
    const d = iso ? new Date(iso) : new Date();
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ----------------- RENDER -----------------
  if (!resultsData) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20">
          <div className="flex items-center justify-center min-h-64">
            <div className="text-center">
              <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4 animate-spin" />
              <h2 className="text-2xl font-bold mb-2">Analyzing...</h2>
              <p className="text-muted-foreground">
                Please wait while we prepare your results.
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const overallStatus = analyticsData?.status || "pending";
  const overallInProgress = overallStatus !== "completed";

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Header */}
        <div className="sticky top-16 z-40 bg-background/95 backdrop-blur border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-4">
              {/* Brand Info */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-hero flex items-center justify-center text-white font-bold">
                  {resultsData.website?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <div>
                  <h1 className="font-semibold text-lg">
                    {resultsData.website || resultsData.product.name}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {overallInProgress
                      ? `Analysis ${overallStatus}`
                      : `Analysis completed on ${formatDate(
                          analyticsData?.updated_at
                        )}`}
                  </p>
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm">
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Keywords analyzed:
                  </span>
                  <span className="font-semibold">
                    {resultsData.search_keywords?.length ?? 0}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-semibold">{overallStatus}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/input")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              New Analysis
            </Button>
          </div>

          {/* Keyword navigation */}
          {/* <div className="mb-6">
            <div className="bg-card border rounded-lg p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                Navigate by Keyword
              </h3>
              <div className="flex flex-wrap gap-2">
                {resultsData.search_keywords?.map((k, idx) => (
                  <Button
                    key={`${k.keyword}-${idx}`}
                    variant={
                      currentTab === `keyword-${idx}` ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => handleTabChange(`keyword-${idx}`)}
                    className="text-sm"
                  >
                    {k.keyword}
                  </Button>
                ))}
                <Button
                  variant={currentTab === "overall" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTabChange("overall")}
                  className="text-sm"
                >
                  Overall View
                </Button>
              </div>
            </div>
          </div> */}

          {/* show banner when overall analyzing */}
          {overallInProgress && (
            <div className="mb-6 p-4 rounded-md bg-yellow-50 border border-yellow-200 text-sm">
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 animate-spin text-muted-foreground" />
                <div>
                  <div className="font-semibold">Analysis in progress</div>
                  <div className="text-xs text-muted-foreground">
                    We are gathering and analyzing AI answers — this usually
                    takes a few seconds to a couple of minutes depending on
                    keywords and sources.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          {currentTab === "overall" ? (
            <>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4 animate-spin" />
                    <p className="text-muted-foreground">
                      Loading analytics...
                    </p>
                  </div>
                </div>
              ) : analyticsData ? (
                <div className="space-y-6 max-w-5xl mx-auto">
                  {/* Header */}
                  <Card className="card-gradient border-0">
                    <div className="text-center p-6">
                      <h2 className="text-3xl font-bold mb-2">Executive Intelligence Report</h2>
                      <p className="text-lg text-muted-foreground mb-4">
                        Strategic insights for <span className="font-semibold text-primary">{resultsData.website?.replace('https://', '').replace('http://', '') || resultsData.product.name}</span>
                      </p>
                      <div className="flex justify-center items-center space-x-4">
                        <Badge variant="outline" className="text-sm">
                          {resultsData.search_keywords?.length || 0} Keywords Analyzed
                        </Badge>
                        <Badge variant="outline" className="text-sm">
                          {analyticsData.analytics?.insight_cards?.length || 0} Key Insights
                        </Badge>
                      </div>
                    </div>
                  </Card>

                  {/* Company Overview */}
                  <Card className="card-gradient border-0">
                    <div className="p-6">
                      <h3 className="text-xl flex items-center space-x-2 mb-4">
                        <span>🏢</span>
                        <span>Company / Website Overview</span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {(analyticsData.analytics?.insight_cards || []).map((insight, index) => (
                          <div key={index} className="p-4 rounded-lg border border-border bg-card/50">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-sm">{insight.title}</h4>
                              {getTrendIcon(insight.trend)}
                            </div>
                            <p className="text-lg font-bold text-primary mb-2">{insight.value}</p>
                            <p className="text-xs text-muted-foreground">{insight.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>

                  {/* Strategic Actions */}
                  <Card className="card-gradient border-0">
                    <div className="p-6">
                      <h3 className="text-xl flex items-center space-x-2 mb-2">
                        <span>🎯</span>
                        <span>Recommended Strategic Actions</span>
                      </h3>
                      <p className="text-muted-foreground mb-4">Prioritized initiatives for competitive advantage</p>
                      <div className="space-y-4">
                        {(analyticsData.analytics?.recommended_actions || [])
                          .sort((a, b) => (a.priority === 'high' ? -1 : b.priority === 'high' ? 1 : 0))
                          .map((action, index) => (
                            <div key={index} className="p-4 rounded-lg border border-border">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center space-x-2">
                                  <h4 className="font-semibold">{action.category}</h4>
                                  <Badge variant={getPriorityColor(action.priority) as any}>
                                    {(action.priority || '').toUpperCase()}
                                  </Badge>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {action.effort} effort
                                </Badge>
                              </div>
                              <p className="text-sm mb-2 font-medium">{action.action}</p>
                              <div className="flex items-start space-x-2 text-sm text-muted-foreground">
                                <TrendingUp className="w-4 h-4 mt-0.5 text-green-500" />
                                <span>{action.impact}</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </Card>

                  {/* Top User Questions */}
                  <Card className="card-gradient border-0">
                    <div className="p-6">
                      <h3 className="text-xl flex items-center space-x-2 mb-2">
                        <span>❓</span>
                        <span>Top User Questions & Queries</span>
                      </h3>
                      <p className="text-muted-foreground mb-4">High-impact search behaviors driving traffic</p>
                      <div className="space-y-3">
                        {(analyticsData.analytics?.drilldowns?.query_explorer || [])
                          .filter((q: any) => q.performance_score >= 4)
                          .slice(0, 8)
                          .map((query: any, index: number) => (
                            <div key={index} className="p-3 rounded-lg border border-border bg-card/30">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium">"{query.query}"</span>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline" className="text-xs">
                                    Score: {query.performance_score}/5
                                  </Badge>
                                  <Badge variant={query.search_volume === 'high' ? 'default' : 'secondary'} className="text-xs">
                                    {query.search_volume} volume
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </Card>

                  {/* Key Sources */}
                  <Card className="card-gradient border-0">
                    <div className="p-6">
                      <h3 className="text-xl flex items-center space-x-2 mb-2">
                        <span>📊</span>
                        <span>Key Sources Driving Insights</span>
                      </h3>
                      <p className="text-muted-foreground mb-4">Primary data sources ranked by relevance</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(analyticsData.analytics?.drilldowns?.sources_list || [])
                          .sort((a: any, b: any) => b.relevance_score - a.relevance_score)
                          .slice(0, 6)
                          .map((source: any, index: number) => (
                            <div key={index} className="p-3 rounded-lg border border-border">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium truncate">{source.source}</span>
                                <Badge variant="outline" className="text-xs">
                                  {source.frequency} refs
                                </Badge>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div 
                                  className="bg-primary rounded-full h-2 transition-all duration-300"
                                  style={{ width: `${(source.relevance_score / 10) * 100}%` }}
                                />
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                Relevance: {source.relevance_score.toFixed(1)}/10
                              </p>
                            </div>
                          ))}
                      </div>
                    </div>
                  </Card>

                  {/* Product Attributes */}
                  <Card className="card-gradient border-0">
                    <div className="p-6">
                      <h3 className="text-xl flex items-center space-x-2 mb-2">
                        <span>⚙️</span>
                        <span>Product Attributes Analysis</span>
                      </h3>
                      <p className="text-muted-foreground mb-4">Key characteristics and their market perception</p>
                      <div className="space-y-4">
                        {(analyticsData.analytics?.drilldowns?.attributes_matrix || [])
                          .sort((a: any, b: any) => (a.importance === 'high' ? -1 : b.importance === 'high' ? 1 : 0))
                          .map((attr: any, index: number) => (
                            <div key={index} className="p-4 rounded-lg border border-border">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold">{attr.attribute}</h4>
                                <div className="flex items-center space-x-2">
                                  <Badge variant={attr.importance === 'high' ? 'default' : 'secondary'} className="text-xs">
                                    {attr.importance}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {attr.frequency} mentions
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">{attr.value}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  </Card>

                  {/* Executive Takeaway */}
                  <Card className="card-gradient border-0 border-primary/20">
                    <div className="p-6">
                      <h3 className="text-xl flex items-center space-x-2 text-primary mb-4">
                        <span>💡</span>
                        <span>Executive Takeaway</span>
                      </h3>
                      <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                          <h4 className="font-semibold mb-2">Market Position</h4>
                          <p className="text-sm">
                            {resultsData.website?.replace('https://', '').replace('http://', '') || resultsData.product.name} maintains a strong market position with solid performance metrics across key areas.
                          </p>
                        </div>
                        
                        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                          <h4 className="font-semibold mb-2">Strategic Priorities</h4>
                          <ul className="text-sm space-y-1">
                            {(analyticsData.analytics?.recommended_actions || [])
                              .filter((action: any) => action.priority === 'high')
                              .slice(0, 4)
                              .map((action: any, index: number) => (
                                <li key={index}>• <strong>{action.category}:</strong> {action.action?.substring(0, 50)}...</li>
                              ))}
                          </ul>
                        </div>

                        <div className="border-t pt-4">
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">
                              Based on analysis of {resultsData.search_keywords?.length || 0} keywords • Generated {new Date().toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No analytics data available
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Select a keyword to view its analytics</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

/* KeywordTab component (extract) */
// function KeywordTab({
//   currentTab,
//   resultsData,
//   keywordAnalytics,
//   getTrendIcon,
//   getPriorityColor,
// }: any) {
//   const idx = parseInt(currentTab.split("-")[1], 10);
//   const keyword = resultsData.search_keywords?.[idx];
//   const data = keyword?.id ? keywordAnalytics[keyword.id] : null;

//   if (!keyword) return null;

//   return (
//     <div className="space-y-8">
//       <div className="text-center mb-6">
//         <h3 className="text-2xl font-semibold mb-2">
//           Insights for "{keyword.keyword}"
//         </h3>
//         <p className="text-muted-foreground">
//           Deep dive analysis for this keyword
//         </p>
//       </div>

//       {keyword?.id ? (
//         data ? (
//           <>
//             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
//               {(data.analytics?.insight_cards || []).length > 0 ? (
//                 data.analytics!.insight_cards!.map((card: any, i: number) => (
//                   <Card key={i} className="card-gradient border-0">
//                     <CardContent className="p-6">
//                       <div className="flex items-center justify-between mb-3">
//                         <div className="flex items-center space-x-2">
//                           <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full" />
//                           <span className="text-sm font-medium">
//                             {card.title}
//                           </span>
//                         </div>
//                         {getTrendIcon(card.trend)}
//                       </div>
//                       <div className="text-lg font-semibold mb-2">
//                         {card.value || "—"}
//                       </div>
//                       <p className="text-xs text-muted-foreground">
//                         {card.description}
//                       </p>
//                     </CardContent>
//                   </Card>
//                 ))
//               ) : (
//                 <p className="text-muted-foreground text-sm">
//                   No insight cards found
//                 </p>
//               )}
//             </div>

//             <Card className="card-gradient border-0 mb-8">
//               <CardContent className="p-6">
//                 <h3 className="text-xl font-semibold mb-4">
//                   Recommended Actions
//                 </h3>
//                 <div className="space-y-4">
//                   {(data.analytics?.recommended_actions || []).length > 0 ? (
//                     data.analytics!.recommended_actions!.map(
//                       (action: any, i: number) => (
//                         <div key={i} className="p-4 rounded-lg bg-accent/50">
//                           <div className="flex items-center space-x-2 mb-2">
//                             <Badge
//                               variant={getPriorityColor(action.priority) as any}
//                             >
//                               {(action.priority || "").toUpperCase()}
//                             </Badge>
//                             <span className="font-semibold">
//                               {action.category}
//                             </span>
//                             <Badge variant="outline">
//                               {action.effort} effort
//                             </Badge>
//                           </div>
//                           <p className="text-sm mb-2">{action.action}</p>
//                           <p className="text-xs text-muted-foreground">
//                             {action.impact}
//                           </p>
//                         </div>
//                       )
//                     )
//                   ) : (
//                     <p className="text-muted-foreground text-sm">
//                       No recommended actions
//                     </p>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           </>
//         ) : (
//           <div className="text-center py-12">
//             <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4 animate-spin" />
//             <p className="text-muted-foreground">
//               Loading keyword analytics...
//             </p>
//           </div>
//         )
//       ) : (
//         <div className="p-6 rounded-lg bg-muted/20 border text-center">
//           <p className="font-medium">
//             Keyword "{keyword.keyword}" registered but ID not yet available
//           </p>
//           <p className="text-sm text-muted-foreground">
//             We can't fetch keyword-specific analytics until the backend returns
//             the keyword ID. Please wait a moment and retry the keyword.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }
