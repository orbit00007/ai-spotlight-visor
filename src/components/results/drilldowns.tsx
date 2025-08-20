import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Check, X, ChevronDown, Filter, Search, Globe, Grid } from "lucide-react";
import { MobileFilterDropdown } from "./mobile-filter-dropdown";

interface DrilldownsProps {
  drilldowns: any;
  activeFilter?: string;
}

export function Drilldowns({ drilldowns, activeFilter }: DrilldownsProps) {
  const [selectedQuery, setSelectedQuery] = useState<string | null>(null);
  const [brandFilter, setBrandFilter] = useState<"all" | "yes" | "no">("all");
  const [expandedSources, setExpandedSources] = useState<string[]>([]);

  const toggleSource = (domain: string) => {
    setExpandedSources(prev => 
      prev.includes(domain)
        ? prev.filter(d => d !== domain)
        : [...prev, domain]
    );
  };

  const filteredQueries = drilldowns.query_explorer.filter((query: any) => {
    if (brandFilter === "yes") return query.brand_present;
    if (brandFilter === "no") return !query.brand_present;
    return true;
  });

  return (
    <Tabs defaultValue="query-explorer" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="query-explorer" className="flex items-center space-x-2">
          <Search className="h-4 w-4" />
          <span>Query Explorer</span>
        </TabsTrigger>
        <TabsTrigger value="sources" className="flex items-center space-x-2">
          <Globe className="h-4 w-4" />
          <span>Sources</span>
        </TabsTrigger>
        <TabsTrigger value="attributes" className="flex items-center space-x-2">
          <Grid className="h-4 w-4" />
          <span>Attributes Matrix</span>
        </TabsTrigger>
      </TabsList>

      {/* Query Explorer */}
      <TabsContent value="query-explorer" className="space-y-4">
        <Card className="bg-gradient-card border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Search className="h-4 w-4 text-white" />
                </div>
                <span>Query Explorer</span>
              </CardTitle>
              
              {/* Desktop Filters */}
              <div className="hidden md:flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Filter className="h-4 w-4" />
                  <span>Filter:</span>
                </div>
                <div className="flex space-x-1">
                  {["all", "yes", "no"].map((filter) => (
                    <Button
                      key={filter}
                      variant={brandFilter === filter ? "default" : "outline"}
                      size="sm"
                      onClick={() => setBrandFilter(filter as any)}
                      className="transition-all"
                    >
                      {filter === "all" ? "All" : filter === "yes" ? "Brand Present" : "Brand Absent"}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Mobile Filter Dropdown */}
              <div className="md:hidden">
                <MobileFilterDropdown 
                  currentFilter={brandFilter}
                  onFilterChange={setBrandFilter}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredQueries.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Select a query to see details.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Query</TableHead>
                    <TableHead>Providers</TableHead>
                    <TableHead>Brand Present</TableHead>
                    <TableHead>Top Answers</TableHead>
                    <TableHead>Sources</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQueries.map((query: any) => (
                    <TableRow key={query.query_id}>
                      <TableCell>
                        <Button
                          variant="link"
                          className="h-auto p-0 text-left whitespace-normal"
                          onClick={() => setSelectedQuery(
                            selectedQuery === query.query_id ? null : query.query_id
                          )}
                        >
                          {query.query}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {query.providers.map((provider: string) => (
                            <Badge key={provider} variant="outline" className="text-xs">
                              {provider}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={query.brand_present ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}>
                          {query.brand_present ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {query.top_answers.slice(0, 3).map((answer: any, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              #{answer.best_rank} {answer.name}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{query.sources_count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {/* Query Details */}
            {selectedQuery && (
              <div className="mt-6 border-t pt-6">
                {filteredQueries
                  .filter((q: any) => q.query_id === selectedQuery)
                  .map((query: any) => (
                    <div key={query.query_id} className="space-y-4">
                      <h4 className="font-semibold">Query: {query.query}</h4>
                      <div className="space-y-3">
                        {query.top_answers.map((answer: any, index: number) => (
                          <Card key={index} className="border">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <h5 className="font-medium">#{answer.best_rank} {answer.name}</h5>
                                {answer.price && (
                                  <Badge variant="outline">{answer.price}</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">
                                {answer.description}
                              </p>
                              {answer.features && (
                                <div className="space-y-2">
                                  <p className="text-xs font-medium">Features:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {answer.features.map((feature: string, i: number) => (
                                      <Badge key={i} variant="secondary" className="text-xs">
                                        {feature}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {answer.sources && (
                                <div className="mt-3">
                                  <p className="text-xs font-medium mb-1">Sources:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {answer.sources.map((source: string, i: number) => (
                                      <Badge key={i} variant="outline" className="text-xs">
                                        {source}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Sources Detail */}
      <TabsContent value="sources" className="space-y-4">
        <Card className="bg-gradient-card border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-secondary rounded-lg flex items-center justify-center">
                <Globe className="h-4 w-4 text-white" />
              </div>
              <span>Sources Detail</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {drilldowns.sources_detail.map((source: any) => (
                <Collapsible key={source.domain}>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="font-medium">{source.domain}</div>
                      <Badge variant="outline">{source.count} citations</Badge>
                      <span className="text-sm text-muted-foreground">{source.percent}%</span>
                    </div>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSource(source.domain)}
                      >
                        Show queries
                        <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${
                          expandedSources.includes(source.domain) ? 'rotate-180' : ''
                        }`} />
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent>
                    <div className="mt-2 ml-4 space-y-1">
                      {source.queries?.map((query: string, index: number) => (
                        <div key={index} className="text-sm text-muted-foreground">
                          • {query}
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Attributes Matrix */}
      <TabsContent value="attributes" className="space-y-4">
        <Card className="bg-gradient-card border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center">
                <Grid className="h-4 w-4 text-white" />
              </div>
              <span>Attributes Matrix</span>
            </CardTitle>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-success" />
                <span>Attribute cited for this brand in AI answers</span>
              </div>
              <div className="flex items-center space-x-2">
                <X className="h-4 w-4 text-destructive" />
                <span>Not cited</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="sticky left-0 bg-background">Attribute</TableHead>
                    {drilldowns.attributes_matrix.columns.map((column: string) => (
                      <TableHead key={column} className="text-center min-w-[120px]">
                        {column}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {drilldowns.attributes_matrix.rows.map((row: any) => (
                    <TableRow key={row.attribute}>
                      <TableCell className="sticky left-0 bg-background font-medium">
                        {row.attribute}
                      </TableCell>
                      {row.values.map((value: boolean, index: number) => (
                        <TableCell key={index} className="text-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center mx-auto ${
                            value ? 'bg-success text-success-foreground' : 'bg-destructive text-destructive-foreground'
                          }`}>
                            {value ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <X className="h-4 w-4" />
                            )}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}