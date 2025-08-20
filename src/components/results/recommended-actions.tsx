import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Target, DollarSign, FileText, Link2, Shield } from "lucide-react";
import { useState } from "react";

interface RecommendedActionsProps {
  actions: any[];
}

const categoryIcons = {
  "Reviews and listings": Target,
  "Pricing and positioning": DollarSign,
  "Content and feature coverage": FileText,
  "Entity and integrations consistency": Link2,
  "Brand defense and comparisons": Shield,
};

export function RecommendedActions({ actions }: RecommendedActionsProps) {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (category: string) => {
    setOpenItems(prev => 
      prev.includes(category) 
        ? prev.filter(item => item !== category)
        : [...prev, category]
    );
  };

  if (actions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No high‑impact actions detected from this run.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {actions.map((action) => {
        const IconComponent = categoryIcons[action.category as keyof typeof categoryIcons] || Target;
        const isOpen = openItems.includes(action.category);
        
        return (
          <Card key={action.category} className="bg-gradient-card border-0 shadow-md">
            <Collapsible open={isOpen} onOpenChange={() => toggleItem(action.category)}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <IconComponent className="h-4 w-4 text-primary" />
                      </div>
                      <div className="text-left">
                        <CardTitle className="text-lg">{action.category}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {action.trigger_note}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="bg-primary/5">
                        {action.items.length} actions
                      </Badge>
                      <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <ul className="space-y-3">
                    {action.items.map((item: string, index: number) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        );
      })}
    </div>
  );
}