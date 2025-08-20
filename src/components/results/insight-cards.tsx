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
      <Card className="group bg-gradient-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-base font-semibold">AI Share of Answers</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                {summary.ai_share_of_answers.brand_hits}
              </span>
              <span className="text-muted-foreground">of {summary.total_queries}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Progress value={summary.ai_share_of_answers.percent} className="h-3 flex-1" />
              <Badge className="bg-primary/10 text-primary border-0 font-semibold">
                {summary.ai_share_of_answers.percent}%
              </Badge>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            How often AI assistants include your brand
          </p>
          <Button 
            variant="link" 
            size="sm" 
            className="h-auto p-0 text-accent hover:text-accent/80 font-medium"
            onClick={() => onQueryExplorer()}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View queries
          </Button>
        </CardContent>
      </Card>

      {/* Card 2 - Competitor Share of Voice */}
      <Card className="group bg-gradient-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-secondary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-base font-semibold">Competitor Share of Voice</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {insights.competitor_share_of_voice.slice(0, 4).map((competitor: any, index: number) => (
              <div key={competitor.name} className="flex items-center justify-between p-2 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                <div className="flex items-center space-x-3 flex-1">
                  <div className={`w-3 h-3 rounded-full ${
                    index === 0 ? 'bg-gradient-primary' : 
                    index === 1 ? 'bg-gradient-secondary' : 
                    index === 2 ? 'bg-gradient-accent' : 'bg-muted-foreground'
                  }`} />
                  <span className="text-sm font-medium truncate">{competitor.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-bold">{competitor.count}</span>
                  <Badge variant="outline" className="text-xs">
                    {competitor.percent}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Who dominates answers in your category
          </p>
          <Button 
            variant="link" 
            size="sm" 
            className="h-auto p-0 text-accent hover:text-accent/80 font-medium"
            onClick={() => onQueryExplorer("competitors")}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            See full list
          </Button>
        </CardContent>
      </Card>

      {/* Card 3 - Source Influence Map */}
      <Card className="group bg-gradient-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-accent rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Globe className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-base font-semibold">Source Influence</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
              <span className="text-sm text-muted-foreground">Total Citations</span>
              <span className="text-lg font-bold text-foreground">{insights.source_influence.total_citations}</span>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Top Sources</p>
              <div className="flex flex-wrap gap-2">
                {insights.source_influence.domains.slice(0, 6).map((domain: any) => (
                  <Badge 
                    key={domain.domain} 
                    variant="outline" 
                    className="text-xs px-3 py-1 bg-primary/5 border-primary/20 hover:bg-primary/10 transition-colors"
                  >
                    {domain.domain}
                    <span className="ml-2 text-xs bg-primary/20 rounded-full px-2 py-0.5">
                      {domain.count}
                    </span>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            These sites shape what AI says
          </p>
          <Button 
            variant="link" 
            size="sm" 
            className="h-auto p-0 text-accent hover:text-accent/80 font-medium"
            onClick={onSourcesDetail}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View all sources
          </Button>
        </CardContent>
      </Card>

      {/* Card 4 - Narrative Gaps */}
      <Card className="group bg-gradient-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-warning rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-base font-semibold">Narrative Gaps</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {insights.narrative_gaps.slice(0, 5).map((gap: any) => (
              <div key={gap.key} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/20 transition-colors">
                <span className="text-sm flex-1 truncate font-medium">{gap.label}</span>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  gap.brandHas 
                    ? 'bg-success text-success-foreground shadow-success/20 shadow-md' 
                    : 'bg-destructive text-destructive-foreground shadow-destructive/20 shadow-md'
                }`}>
                  {gap.brandHas ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            What AI credits rivals for but not you
          </p>
          <Button 
            variant="link" 
            size="sm" 
            className="h-auto p-0 text-accent hover:text-accent/80 font-medium"
            onClick={onAttributesMatrix}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            See details
          </Button>
        </CardContent>
      </Card>

      {/* Card 5 - Brand Defense Risk (Conditional) */}
      {insights.brand_defense?.enabled && (
        <Card className="group bg-gradient-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 md:col-span-2 xl:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-destructive rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-base font-semibold">Brand Defense Risk</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Risk Level</span>
                <Badge className={`font-semibold ${
                  insights.brand_defense.risk === "High" ? "bg-destructive text-destructive-foreground shadow-destructive/20 shadow-md" :
                  insights.brand_defense.risk === "Medium" ? "bg-warning text-warning-foreground shadow-warning/20 shadow-md" :
                  "bg-success text-success-foreground shadow-success/20 shadow-md"
                } border-0`}>
                  {insights.brand_defense.risk} Risk
                </Badge>
              </div>
              <div className="p-3 bg-muted/20 rounded-lg">
                <p className="text-sm leading-relaxed">
                  In 'alternatives' queries, you appear in{" "}
                  <span className="font-bold text-foreground">{insights.brand_defense.brand_appears_in_alt}</span> of{" "}
                  <span className="font-bold text-foreground">{insights.brand_defense.alt_queries_count}</span> cases.
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Are you present when people ask for alternatives to you
            </p>
            <Button 
              variant="link" 
              size="sm" 
              className="h-auto p-0 text-accent hover:text-accent/80 font-medium"
              onClick={() => onQueryExplorer("alternatives")}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              See queries
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}