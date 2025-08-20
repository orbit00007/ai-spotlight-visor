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
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Search className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg">AI Visibility Checker</span>
          </div>
          <div className="flex items-center space-x-4">
            <ModeToggle />
            {user && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Welcome, {user.name}</span>
                <Button variant="outline" size="sm" onClick={logout}>
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Hero Section */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Check your AI search visibility
            </h1>
            <p className="text-xl text-muted-foreground">
              Enter your brand and up to 3 keywords to see how AI assistants mention you.
            </p>
          </div>

          {/* Form Card */}
          <Card className="text-left bg-gradient-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Brand Visibility Analysis</CardTitle>
              <CardDescription>
                Get insights into how AI assistants present your brand in search results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Brand Field */}
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand or Website</Label>
                  <Input
                    id="brand"
                    type="text"
                    placeholder="e.g., Kommunicate or kommunicate.io"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    maxLength={100}
                    className="bg-background"
                  />
                </div>

                {/* Keywords Field */}
                <div className="space-y-2">
                  <Label htmlFor="keywords">Keywords (up to 3)</Label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        id="keywords"
                        type="text"
                        placeholder="Press Enter to add"
                        value={currentKeyword}
                        onChange={(e) => setCurrentKeyword(e.target.value)}
                        onKeyPress={handleKeyPress}
                        maxLength={60}
                        disabled={keywords.length >= 3}
                        className="bg-background"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={addKeyword}
                        disabled={!currentKeyword.trim() || keywords.length >= 3 || keywords.includes(currentKeyword.trim())}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Keywords Display */}
                    {keywords.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {keywords.map((keyword, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="pl-3 pr-1 py-1 text-sm"
                          >
                            {keyword}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 ml-2 hover:bg-destructive hover:text-destructive-foreground"
                              onClick={() => removeKeyword(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <p className="text-sm text-muted-foreground">
                      {keywords.length} of 3 keywords added
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                  disabled={isLoading || !brand.trim() || keywords.length === 0}
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing visibility...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Run visibility check
                    </>
                  )}
                </Button>

                {/* Example Link */}
                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={showExampleOutput}
                    className="text-accent hover:text-accent/80"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    See example output
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Footer Note */}
          <p className="text-sm text-muted-foreground">
            Insights are based on what AI assistants say—not on scraping your site.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;