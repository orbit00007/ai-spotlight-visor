import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, Search, Globe, TrendingUp, Users, ExternalLink } from "lucide-react";
import { createKeywordInsights } from "@/data/keywordInsights";

interface ResultsData {
  website: string;
  keywords: string[];
  isExample?: boolean;
}

export default function Results() {
  const [resultsData, setResultsData] = useState<ResultsData | null>(null);
  const [selectedKeyword, setSelectedKeyword] = useState<string>("");
  const [insights, setInsights] = useState<any>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Get data from navigation state
    if (location.state) {
      const data = location.state as ResultsData;
      setResultsData(data);
      
      // Generate insights for keywords
      const keywordInsights = createKeywordInsights(data.website, data.keywords);
      setInsights(keywordInsights);
      
      // Set first keyword as selected by default
      setSelectedKeyword(data.keywords[0] || "");
    } else {
      navigate("/input");
    }
  }, [user, navigate, location.state]);

  const getCurrentKeywordData = () => {
    if (!insights || !selectedKeyword) return null;
    return insights.keywords.find((kw: any) => kw.keyword === selectedKeyword);
  };

  if (!resultsData || !insights) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20">
          <div className="flex items-center justify-center min-h-64">
            <div className="text-center">
              <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">Analyzing Your AI Visibility...</h2>
              <p className="text-muted-foreground">Processing your website and keywords across AI platforms.</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const currentKeywordData = getCurrentKeywordData();

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="sticky top-16 z-40 bg-white border-b shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col space-y-4">
              {/* Website Info */}
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="font-bold text-xl text-gray-900">{resultsData.website}</h1>
                  <p className="text-sm text-gray-600">
                    AI Search Visibility Analysis across {insights.overall.total_queries} queries
                  </p>
                </div>
              </div>
              
              {/* Keywords Navigation */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 mr-2">Keywords:</span>
                  {resultsData.keywords.map((keyword) => (
                    <Badge
                      key={keyword}
                      variant={selectedKeyword === keyword ? "default" : "outline"}
                      className={`cursor-pointer transition-all ${
                        selectedKeyword === keyword 
                          ? "bg-blue-600 text-white" 
                          : "hover:bg-blue-50 border-blue-200"
                      }`}
                      onClick={() => setSelectedKeyword(keyword)}
                    >
                      {keyword}
                    </Badge>
                  ))}
                  <Badge
                    variant={selectedKeyword === "overall" ? "default" : "outline"}
                    className={`cursor-pointer transition-all ${
                      selectedKeyword === "overall" 
                        ? "bg-green-600 text-white" 
                        : "hover:bg-green-50 border-green-200"
                    }`}
                    onClick={() => setSelectedKeyword("overall")}
                  >
                    Overall View
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Back Navigation */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/input")}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              New Analysis
            </Button>
          </div>

          {/* Content based on selected keyword */}
          {selectedKeyword === "overall" ? (
            <div className="space-y-8">
              {/* Overall AI Platform Breakdown */}
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Overall AI Platform Visibility</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {insights.overall.ai_platforms.map((platform: any) => (
                      <div key={platform.name} className="text-center">
                        <div className={`w-16 h-16 ${platform.color} rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3`}>
                          {platform.overall_visibility}%
                        </div>
                        <h3 className="font-semibold text-gray-900">{platform.name}</h3>
                        <p className="text-sm text-gray-600">Average visibility</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Overall Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white shadow-sm">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {insights.overall.total_mentions}
                      </div>
                      <p className="text-sm text-gray-600">Total Brand Mentions</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white shadow-sm">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {insights.overall.average_visibility}%
                      </div>
                      <p className="text-sm text-gray-600">Average Visibility</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white shadow-sm">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        {insights.overall.total_queries}
                      </div>
                      <p className="text-sm text-gray-600">Queries Analyzed</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : currentKeywordData ? (
            <div className="space-y-8">
              {/* AI Platform Breakdown for Keyword */}
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">AI Platform Visibility for "{selectedKeyword}"</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {currentKeywordData.metrics.ai_platforms.map((platform: any) => (
                      <div key={platform.name} className="text-center">
                        <div className={`w-16 h-16 ${platform.color} rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3`}>
                          {platform.visibility}%
                        </div>
                        <h3 className="font-semibold text-gray-900">{platform.name}</h3>
                        <p className="text-sm text-gray-600">Visibility rate</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Keyword Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Competitors */}
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Top Competitors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {currentKeywordData.competitors.slice(0, 5).map((competitor: any, index: number) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="font-medium">{competitor.name}</span>
                          <div className="flex items-center gap-3">
                            <Progress value={competitor.percentage} className="w-20" />
                            <span className="text-sm text-gray-600 w-12">{competitor.mentions}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Top Sources */}
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      Influential Sources
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {currentKeywordData.sources.map((source: any, index: number) => (
                        <div key={index} className="flex items-center justify-between py-2">
                          <span className="text-sm font-medium">{source.domain}</span>
                          <Badge variant="outline">{source.count} citations</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Actions */}
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>Recommended Actions for "{selectedKeyword}"</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentKeywordData.recommendations.map((action: string, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-sm text-gray-700">{action}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : null}
        </div>
      </div>
    </Layout>
  );
}