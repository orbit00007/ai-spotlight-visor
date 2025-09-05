import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { productsApi } from "@/services/api";
import { Loader2, X, Plus, Search, Globe, Tags, ExternalLink, AlertCircle } from "lucide-react";
import validator from "validator";

export default function InputPage() {
  const [website, setWebsite] = useState("");
  const [currentKeyword, setCurrentKeyword] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [urlError, setUrlError] = useState("");
  const { user, application, accessToken } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const validateUrl = (url: string) => {
    setUrlError("");
    if (!url.trim()) return false;
    
    let processedUrl = url.trim();
    if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
      processedUrl = `https://${processedUrl}`;
    }
    
    if (!validator.isURL(processedUrl, { require_protocol: true })) {
      setUrlError("Please enter a valid website URL");
      return false;
    }
    return true;
  };

  const addKeyword = () => {
    if (
      currentKeyword.trim() &&
      keywords.length < 5 &&
      !keywords.includes(currentKeyword.trim())
    ) {
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

    if (!validateUrl(website)) {
      toast({
        title: "Invalid website URL",
        description: "Please enter a valid website URL to analyze.",
        variant: "destructive",
      });
      return;
    }

    if (keywords.length === 0) {
      toast({
        title: "Keywords required",
        description: "Please add at least one keyword for analysis.",
        variant: "destructive",
      });
      return;
    }

    if (!application || !accessToken) {
      toast({
        title: "Authentication required",
        description: "Please log in again to continue.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setIsLoading(true);

    try {
      // Extract company name from website URL for product name
      let processedUrl = website.trim();
      if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
        processedUrl = `https://${processedUrl}`;
      }
      
      const hostname = new URL(processedUrl).hostname.replace('www.', '');
      const companyName = hostname.split('.')[0];
      
      // Create product with keywords
      const response = await productsApi.createProductWithKeywords(
        `${companyName} Analysis`,
        `AI Search Visibility Analysis for ${hostname}`,
        processedUrl,
        "Technology", // Default business domain - could be made configurable
        application.id,
        keywords,
        accessToken
      );

      if (response.error) {
        throw new Error(response.error);
      }

      toast({
        title: "Analysis started",
        description: "Your AI search visibility analysis is being processed.",
      });

      navigate("/results", {
        state: {
          website: processedUrl,
          companyName: hostname,
          keywords,
          productId: response.data?.id,
          applicationId: application.id,
        },
      });
    } catch (error: any) {
      toast({
        title: "Analysis failed",
        description: error.message || "Failed to start analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const showExampleOutput = () => {
    navigate("/results", {
      state: {
        website: "kommunicate.io",
        keywords: ["customer support", "live chat", "chatbot"],
        isExample: true,
      },
    });
  };

  return (
    <Layout>
      {/* Background now matches your gray theme */}
      <div className="min-h-screen bg-gray-100">
        <main className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            {/* Hero Section */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-blue-600">
                Discover Your AI Search Visibility
              </h1>
              <p className="text-xl text-gray-600">
                Enter your website and keywords to see how AI assistants respond to searches in your space.
              </p>
            </div>

            {/* Form Card */}
            <Card className="text-left bg-white border shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900 text-center">AI Search Visibility Check</CardTitle>
                <CardDescription className="text-gray-600 text-center">
                  Analyze how AI assistants respond to searches related to your website
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Website Field */}
                  <div className="space-y-2">
                    <Label htmlFor="website">Website URL</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="website"
                        type="text"
                        placeholder="e.g., yourwebsite.com or https://yourwebsite.com"
                        value={website}
                        onChange={(e) => {
                          setWebsite(e.target.value);
                          setUrlError("");
                        }}
                        maxLength={100}
                        className={`pl-11 bg-white ${urlError ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {urlError && (
                      <p className="text-sm text-red-500 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {urlError}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">{website.length}/100 characters</p>
                  </div>

                  {/* Keywords Field */}
                  <div className="space-y-2">
                    <Label htmlFor="keywords">Search Keywords (up to 5)</Label>
                    <div className="space-y-3">
                      <div className="flex gap-2 relative">
                        <Tags className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="keywords"
                          type="text"
                          placeholder="e.g., customer support software"
                          value={currentKeyword}
                          onChange={(e) => setCurrentKeyword(e.target.value)}
                          onKeyPress={handleKeyPress}
                          maxLength={60}
                          disabled={keywords.length >= 5}
                          className="pl-11 bg-white"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={addKeyword}
                          disabled={
                            !currentKeyword.trim() ||
                            keywords.length >= 5 ||
                            keywords.includes(currentKeyword.trim())
                          }
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
                                className="h-4 w-4 ml-2 hover:bg-red-500 hover:text-white"
                                onClick={() => removeKeyword(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      )}

                      <p className="text-sm text-gray-500">
                        {keywords.length} of 5 keywords added
                      </p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="hero"
                    className="w-full"
                    disabled={isLoading || !website.trim() || keywords.length === 0 || !!urlError}
                    size="lg"
                  >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Checking DNS & analyzing...
                        </>
                      ) : (
                        <>
                          <Search className="mr-2 h-4 w-4" />
                          Start AI Visibility Analysis
                        </>
                      )}
                  </Button>

                  {/* Example Link */}
                  <div className="text-center">
                    <Button
                      type="button"
                      variant="link"
                      onClick={showExampleOutput}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      See example output
                    </Button>
                  </div>
                </form>
                <div className="mt-6 p-6 rounded-lg bg-muted/50 border">
                  <h4 className="font-semibold mb-3">What You'll Get</h4>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>• <strong>AI Platform Breakdown:</strong> See your visibility on ChatGPT, Perplexity, and other AI platforms</p>
                    <p>• <strong>Keyword-by-Keyword Analysis:</strong> Click through each keyword to see detailed insights</p>
                    <p>• <strong>Competitor Comparison:</strong> See who dominates AI responses in your space</p>
                    <p>• <strong>Action Steps:</strong> Clear recommendations to improve your AI search presence</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Footer Note */}
            <p className="text-sm text-gray-500">
              Insights are based on what AI assistants say—not on scraping your site.
            </p>
          </div>
        </main>
      </div>
    </Layout>
  );
}
