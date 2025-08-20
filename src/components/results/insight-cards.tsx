import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, X, ExternalLink, Users, Globe, Shield, TrendingUp } from "lucide-react";

interface InsightCardsProps {
  data: any;
  onQueryExplorer: (filter?: string) => void;
  onSourcesDetail: () => void;
  onAttributesMatrix: () => void;
}

export function InsightCards({ data, onQueryExplorer, onSourcesDetail, onAttributesMatrix }: InsightCardsProps) {
  const { summary, insights } = data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {/* Card 1 - AI Share of Answers */}
      <Card className="bg-gradient-card border-0 shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-lg">AI Share of Answers</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold">{summary.ai_share_of_answers.brand_hits}</span>
              <span className="text-muted-foreground">of {summary.total_queries}</span>
              <Badge className="bg-primary/10 text-primary border-0">
                {summary.ai_share_of_answers.percent}%
              </Badge>
            </div>
            <Progress value={summary.ai_share_of_answers.percent} className="h-2" />
          </div>
          <p className="text-sm text-muted-foreground">
            How often AI assistants include your brand
          </p>
          <Button 
            variant="link" 
            size="sm" 
            className="h-auto p-0 text-accent"
            onClick={() => onQueryExplorer()}
          >
            <ExternalLink className="mr-1 h-3 w-3" />
            View queries
          </Button>
        </CardContent>
      </Card>

      {/* Card 2 - Competitor Share of Voice */}
      <Card className="bg-gradient-card border-0 shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
              <Users className="h-4 w-4 text-accent" />
            </div>
            <CardTitle className="text-lg">Competitor Share of Voice</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {insights.competitor_share_of_voice.slice(0, 5).map((competitor: any, index: number) => (
              <div key={competitor.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2 flex-1">
                  <div className={`w-2 h-2 rounded-full ${
                    index === 0 ? 'bg-primary' : 
                    index === 1 ? 'bg-accent' : 
                    index === 2 ? 'bg-success' : 'bg-muted-foreground'
                  }`} />
                  <span className="text-sm font-medium truncate">{competitor.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold">{competitor.count}</span>
                  <span className="text-xs text-muted-foreground">{competitor.percent}%</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Who dominates answers in your category
          </p>
          <Button 
            variant="link" 
            size="sm" 
            className="h-auto p-0 text-accent"
            onClick={() => onQueryExplorer("competitors")}
          >
            <ExternalLink className="mr-1 h-3 w-3" />
            See full list
          </Button>
        </CardContent>
      </Card>

      {/* Card 3 - Source Influence Map */}
      <Card className="bg-gradient-card border-0 shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
              <Globe className="h-4 w-4 text-success" />
            </div>
            <CardTitle className="text-lg">Source Influence</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Citations: <span className="font-semibold text-foreground">{insights.source_influence.total_citations}</span>
            </p>
            <div className="flex flex-wrap gap-1">
              {insights.source_influence.domains.slice(0, 8).map((domain: any) => (
                <Badge 
                  key={domain.domain} 
                  variant="outline" 
                  className="text-xs px-2 py-1"
                >
                  {domain.domain}
                  <span className="ml-1 text-xs bg-muted rounded px-1">
                    {domain.count}
                  </span>
                </Badge>
              ))}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            These sites shape what AI says
          </p>
          <Button 
            variant="link" 
            size="sm" 
            className="h-auto p-0 text-accent"
            onClick={onSourcesDetail}
          >
            <ExternalLink className="mr-1 h-3 w-3" />
            View all sources
          </Button>
        </CardContent>
      </Card>

      {/* Card 4 - Narrative Gaps */}
      <Card className="bg-gradient-card border-0 shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center">
              <Shield className="h-4 w-4 text-warning" />
            </div>
            <CardTitle className="text-lg">Narrative Gaps</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {insights.narrative_gaps.slice(0, 6).map((gap: any) => (
              <div key={gap.key} className="flex items-center justify-between">
                <span className="text-sm flex-1 truncate">{gap.label}</span>
                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                  gap.brandHas ? 'bg-success text-success-foreground' : 'bg-destructive text-destructive-foreground'
                }`}>
                  {gap.brandHas ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <X className="h-3 w-3" />
                  )}
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            What AI credits rivals for but not you
          </p>
          <Button 
            variant="link" 
            size="sm" 
            className="h-auto p-0 text-accent"
            onClick={onAttributesMatrix}
          >
            <ExternalLink className="mr-1 h-3 w-3" />
            See details
          </Button>
        </CardContent>
      </Card>

      {/* Card 5 - Brand Defense Risk (Conditional) */}
      {insights.brand_defense?.enabled && (
        <Card className="bg-gradient-card border-0 shadow-md md:col-span-2 xl:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-destructive/10 rounded-lg flex items-center justify-center">
                <Shield className="h-4 w-4 text-destructive" />
              </div>
              <CardTitle className="text-lg">Brand Defense Risk</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Badge className={`${
                insights.brand_defense.risk === "High" ? "bg-destructive text-destructive-foreground" :
                insights.brand_defense.risk === "Medium" ? "bg-warning text-warning-foreground" :
                "bg-success text-success-foreground"
              } border-0`}>
                {insights.brand_defense.risk} Risk
              </Badge>
              <p className="text-sm">
                In 'alternatives' queries, you appear in{" "}
                <span className="font-semibold">{insights.brand_defense.brand_appears_in_alt}</span> of{" "}
                <span className="font-semibold">{insights.brand_defense.alt_queries_count}</span>.
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Are you present when people ask for alternatives to you
            </p>
            <Button 
              variant="link" 
              size="sm" 
              className="h-auto p-0 text-accent"
              onClick={() => onQueryExplorer("alternatives")}
            >
              <ExternalLink className="mr-1 h-3 w-3" />
              See queries
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}