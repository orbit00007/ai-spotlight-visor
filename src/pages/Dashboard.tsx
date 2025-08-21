import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, X, Plus, Search, ExternalLink } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { ModeToggle } from "@/components/mode-toggle";

const Dashboard = () => {
  const [brand, setBrand] = useState("");
  const [currentKeyword, setCurrentKeyword] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const addKeyword = () => {
    if (currentKeyword.trim() && keywords.length < 3 && !keywords.includes(currentKeyword.trim())) {
      setKeywords([...keywords, currentKeyword.trim()]);
      setCurrentKeyword("");
    }
  };

  const removeKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addKeyword();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!brand.trim()) {
      toast({
        title: "Brand required",
        description: "Please enter your brand or website name.",
        variant: "destructive",
      });
      return;
    }

    if (keywords.length === 0) {
      toast({
        title: "Keywords required",
        description: "Please add at least one keyword.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate("/results", { 
        state: { 
          brand: brand.trim(), 
          keywords 
        } 
      });
    }, 2000);
  };

  const showExampleOutput = () => {
    navigate("/results", { 
      state: { 
        brand: "Kommunicate", 
        keywords: ["customer support", "live chat", "chatbot"],
        isExample: true
      } 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-soft">
              <Search className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl bg-gradient-primary bg-clip-text text-transparent">
                AI Visibility Checker
              </h1>
              <p className="text-xs text-muted-foreground">Monitor your AI search presence</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ModeToggle />
            {user && (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">Free Plan</p>
                </div>
                <Button variant="outline" size="sm" onClick={logout} className="border-border/50">
                  Sign Out
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Hero Section */}
          <div className="text-center space-y-6 mb-12">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold">
                We <span className="bg-gradient-primary bg-clip-text text-transparent">otter</span> know where
              </h1>
              <h2 className="text-5xl md:text-6xl font-bold">
                <span className="bg-gradient-primary bg-clip-text text-transparent">your brand</span> shows up on
              </h2>
              <h3 className="text-5xl md:text-6xl font-bold">AI Search</h3>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get your brand mentioned, and your website cited on ChatGPT, Perplexity, AI Overviews, 
              AI Mode, Gemini, and Copilot. It's otterly simple.
            </p>
          </div>

          {/* Form Card */}
          <Card className="bg-white dark:bg-card border border-border shadow-card rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary-pink/5 to-primary-purple/5 border-b border-border/50">
              <CardTitle className="text-2xl font-semibold">Start Your Free 14-Day Trial</CardTitle>
              <CardDescription className="text-base">
                Monitor your brand across AI search platforms instantly
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Brand Field */}
                <div className="space-y-3">
                  <Label htmlFor="brand" className="text-base font-medium">Brand or Website</Label>
                  <Input
                    id="brand"
                    type="text"
                    placeholder="e.g., Apple, kommunicate.io, or your-website.com"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    maxLength={100}
                    className="h-12 text-base border-border/50 focus:border-primary focus:ring-primary/20"
                  />
                </div>

                {/* Keywords Field */}
                <div className="space-y-3">
                  <Label htmlFor="keywords" className="text-base font-medium">Keywords (up to 3)</Label>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <Input
                        id="keywords"
                        type="text"
                        placeholder="e.g., customer support, live chat"
                        value={currentKeyword}
                        onChange={(e) => setCurrentKeyword(e.target.value)}
                        onKeyPress={handleKeyPress}
                        maxLength={60}
                        disabled={keywords.length >= 3}
                        className="h-12 text-base border-border/50 focus:border-primary focus:ring-primary/20"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={addKeyword}
                        disabled={!currentKeyword.trim() || keywords.length >= 3 || keywords.includes(currentKeyword.trim())}
                        className="h-12 w-12 border-border/50 hover:border-primary"
                      >
                        <Plus className="h-5 w-5" />
                      </Button>
                    </div>
                    
                    {/* Keywords Display */}
                    {keywords.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {keywords.map((keyword, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="pl-4 pr-2 py-2 text-sm bg-gradient-to-r from-primary-pink/10 to-primary-purple/10 border border-primary/20 rounded-full"
                          >
                            {keyword}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 ml-2 hover:bg-destructive hover:text-destructive-foreground rounded-full"
                              onClick={() => removeKeyword(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <p className="text-sm text-muted-foreground font-medium">
                      {keywords.length} of 3 keywords added
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="space-y-4 pt-4">
                  <Button
                    type="submit"
                    className="w-full h-14 bg-gradient-primary hover:opacity-90 transition-all duration-200 text-white font-semibold text-lg rounded-xl shadow-elevated hover:shadow-soft"
                    disabled={isLoading || !brand.trim() || keywords.length === 0}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                        Analyzing your AI visibility...
                      </>
                    ) : (
                      <>
                        <Search className="mr-3 h-5 w-5" />
                        Start Your Free 14-Day Trial
                      </>
                    )}
                  </Button>

                  {/* Trusted by text */}
                  <p className="text-center text-sm text-muted-foreground font-medium">
                    Trusted by 5,000+ Marketing and SEO Professionals
                  </p>

                  {/* Example Link */}
                  <div className="text-center">
                    <Button
                      type="button"
                      variant="link"
                      onClick={showExampleOutput}
                      className="text-primary hover:text-primary/80 font-medium"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      See example output
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto">
                <Search className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold">AI Search Monitoring</h3>
              <p className="text-sm text-muted-foreground">Track mentions across ChatGPT, Perplexity, and more</p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto">
                <ExternalLink className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold">Competitor Analysis</h3>
              <p className="text-sm text-muted-foreground">See who dominates in your category</p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold">Actionable Insights</h3>
              <p className="text-sm text-muted-foreground">Get recommendations to improve your visibility</p>
            </div>
          </div>

          {/* Footer Note */}
          <p className="text-center text-sm text-muted-foreground mt-12">
            Insights are based on what AI assistants say—not on scraping your site.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;