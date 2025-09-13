import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, TrendingDown, Minus, ArrowRight } from "lucide-react";

interface ExecutiveReportProps {
  data: {
    name: string;
    keywords_analyzed: number;
    data: {
      analytics: {
        insight_cards: Array<{
          title: string;
          value: string;
          trend: string;
          description: string;
          icon: string;
        }>;
        recommended_actions: Array<{
          category: string;
          priority: string;
          action: string;
          impact: string;
          effort: string;
        }>;
        drilldowns: {
          query_explorer: Array<{
            query: string;
            performance_score: number;
            search_volume: string;
            competition: string;
          }>;
          sources_list: Array<{
            source: string;
            frequency: number;
            relevance_score: number;
            url: string;
          }>;
          attributes_matrix: Array<{
            attribute: string;
            value: string;
            frequency: number;
            importance: string;
          }>;
        };
      };
    };
  };
}

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'up':
    case 'emerging':
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    case 'down':
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    default:
      return <Minus className="w-4 h-4 text-muted-foreground" />;
  }
};

const getPriorityBadge = (priority: string) => {
  const variant = priority === 'high' ? 'destructive' : priority === 'medium' ? 'default' : 'secondary';
  return <Badge variant={variant}>{priority.toUpperCase()}</Badge>;
};

export const ExecutiveReport = ({ data }: ExecutiveReportProps) => {
  const { analytics } = data.data;
  const companyName = data.name.replace('https://', '').replace('http://', '');

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <Card className="card-gradient border-0">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Executive Intelligence Report</CardTitle>
          <CardDescription className="text-lg">
            Strategic insights for <span className="font-semibold text-primary">{companyName}</span>
          </CardDescription>
          <div className="flex justify-center items-center space-x-4 mt-4">
            <Badge variant="outline" className="text-sm">
              {data.keywords_analyzed} Keywords Analyzed
            </Badge>
            <Badge variant="outline" className="text-sm">
              {analytics.insight_cards.length} Key Insights
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Company Overview */}
      <Card className="card-gradient border-0">
        <CardHeader>
          <CardTitle className="text-xl flex items-center space-x-2">
            <span>🏢</span>
            <span>Company / Website Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.insight_cards.map((insight, index) => (
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
        </CardContent>
      </Card>

      {/* Strategic Actions */}
      <Card className="card-gradient border-0">
        <CardHeader>
          <CardTitle className="text-xl flex items-center space-x-2">
            <span>🎯</span>
            <span>Recommended Strategic Actions</span>
          </CardTitle>
          <CardDescription>Prioritized initiatives for competitive advantage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {analytics.recommended_actions
            .sort((a, b) => (a.priority === 'high' ? -1 : b.priority === 'high' ? 1 : 0))
            .map((action, index) => (
              <div key={index} className="p-4 rounded-lg border border-border">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold">{action.category}</h4>
                    {getPriorityBadge(action.priority)}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {action.effort} effort
                  </Badge>
                </div>
                <p className="text-sm mb-2 font-medium">{action.action}</p>
                <div className="flex items-start space-x-2 text-sm text-muted-foreground">
                  <ArrowRight className="w-4 h-4 mt-0.5 text-green-500" />
                  <span>{action.impact}</span>
                </div>
              </div>
            ))}
        </CardContent>
      </Card>

      {/* Top User Questions */}
      <Card className="card-gradient border-0">
        <CardHeader>
          <CardTitle className="text-xl flex items-center space-x-2">
            <span>❓</span>
            <span>Top User Questions & Queries</span>
          </CardTitle>
          <CardDescription>High-impact search behaviors driving traffic</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.drilldowns.query_explorer
              .filter(q => q.performance_score >= 4)
              .slice(0, 8)
              .map((query, index) => (
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
        </CardContent>
      </Card>

      {/* Key Sources */}
      <Card className="card-gradient border-0">
        <CardHeader>
          <CardTitle className="text-xl flex items-center space-x-2">
            <span>📊</span>
            <span>Key Sources Driving Insights</span>
          </CardTitle>
          <CardDescription>Primary data sources ranked by relevance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analytics.drilldowns.sources_list
              .sort((a, b) => b.relevance_score - a.relevance_score)
              .slice(0, 6)
              .map((source, index) => (
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
        </CardContent>
      </Card>

      {/* Product Attributes */}
      <Card className="card-gradient border-0">
        <CardHeader>
          <CardTitle className="text-xl flex items-center space-x-2">
            <span>⚙️</span>
            <span>Product Attributes Analysis</span>
          </CardTitle>
          <CardDescription>Key characteristics and their market perception</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.drilldowns.attributes_matrix
              .sort((a, b) => (a.importance === 'high' ? -1 : b.importance === 'high' ? 1 : 0))
              .map((attr, index) => (
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
        </CardContent>
      </Card>

      {/* Executive Takeaway */}
      <Card className="card-gradient border-0 border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl flex items-center space-x-2 text-primary">
            <span>💡</span>
            <span>Executive Takeaway</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <h4 className="font-semibold mb-2">Market Position</h4>
              <p className="text-sm">
                {companyName} maintains a dominant market position with strong performance metrics, 
                but faces significant competitive pressure on privacy and specialized features from 
                multiple well-established alternatives.
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <h4 className="font-semibold mb-2">Strategic Priorities</h4>
              <ul className="text-sm space-y-1">
                <li>• <strong>Privacy Trust:</strong> Simplify privacy controls to address user concerns</li>
                <li>• <strong>AI Adoption:</strong> Accelerate Gemini/AI Mode rollout and documentation</li>
                <li>• <strong>Monetization:</strong> Improve advertiser onboarding and guidance</li>
                <li>• <strong>Content Strategy:</strong> Target high-volume informational queries</li>
              </ul>
            </div>

            <Separator />
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Based on analysis of {data.keywords_analyzed} keywords • Generated {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};