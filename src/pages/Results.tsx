import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Calendar, Search, Globe, TrendingUp, Users, ExternalLink, Building2 } from "lucide-react";
import { createKeywordInsights } from "@/data/keywordInsights";
import { searchApi, analyticsApi } from "@/services/api";

interface ResultsData {
  website: string;
  companyName?: string;
  keywords: string[];
  productId?: string;
  applicationId?: string;
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
              {/* Company Info */}
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  <Building2 className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="font-bold text-2xl text-gray-900">
                      {resultsData.companyName || resultsData.website.replace(/^https?:\/\//, '').replace(/^www\./, '').split('.')[0]}
                    </h1>
                    <Badge variant="outline" className="text-xs">
                      <Globe className="w-3 h-3 mr-1" />
                      {resultsData.website.replace(/^https?:\/\//, '')}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    AI Search Visibility Analysis • {insights.overall.total_queries} total queries • {resultsData.keywords.length} keywords analyzed
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
              <Card className="bg-white shadow-sm border-l-4 border-l-blue-500">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    {resultsData.companyName || resultsData.website.split('.')[0]}'s AI Platform Visibility
                  </CardTitle>
                  <p className="text-sm text-gray-600">How often AI assistants mention your brand across all keywords</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {insights.overall.ai_platforms.map((platform: any) => (
                      <div key={platform.name} className="text-center group hover:scale-105 transition-transform cursor-pointer">
                        <div className="relative mb-4">
                          <div className={`w-20 h-20 ${platform.color} rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto shadow-lg group-hover:shadow-xl transition-shadow`}>
                            {platform.overall_visibility}%
                          </div>
                          <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center">
                            <div className={`w-3 h-3 ${platform.color} rounded-full`}></div>
                          </div>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1">{platform.name}</h3>
                        <p className="text-xs text-gray-500 mb-2">Average visibility</p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 ${platform.color} rounded-full transition-all duration-500`}
                            style={{ width: `${platform.overall_visibility}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Quick Insights */}
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-700">
                          {Math.max(...insights.overall.ai_platforms.map((p: any) => p.overall_visibility))}%
                        </div>
                        <p className="text-xs text-green-600">Highest Platform</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-700">
                          {Math.round(insights.overall.ai_platforms.reduce((sum: number, p: any) => sum + p.overall_visibility, 0) / insights.overall.ai_platforms.length)}%
                        </div>
                        <p className="text-xs text-blue-600">Average Across All</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-lg font-bold text-purple-700">
                          {insights.overall.ai_platforms.filter((p: any) => p.overall_visibility > 30).length}/4
                        </div>
                        <p className="text-xs text-purple-600">Strong Presence</p>
                      </div>
                    </div>
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