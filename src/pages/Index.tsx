import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/Layout";
import {
  Search,
  TrendingUp,
  Users,
  Globe,
  Shield,
  ArrowRight,
  CheckCircle,
  Zap,
} from "lucide-react";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckVisibility = () => {
    if (user) {
      navigate("/input");
    } else {
      navigate("/login");
    }
  };
  const features = [
    {
      icon: <Search className="w-8 h-8 text-primary" />,
      title: "AI Search Monitoring",
      description:
        "Real-time tracking of how AI assistants like ChatGPT and Gemini mention your brand",
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-primary" />,
      title: "Competitor Analysis",
      description:
        "See who dominates AI responses in your category and identify opportunities",
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Source Influence",
      description:
        "Discover which websites shape what AI says about your industry",
    },
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "Brand Defense",
      description:
        "Monitor your presence in alternative and competitive queries",
    },
  ];

  const stats = [
    { number: "60%", label: "Google searches end with no website visit" },
    { number: "35%", label: "Drop in B2B SaaS organic traffic" },
    { number: "45%", label: "Monthly increase in AI search sessions" },
    { number: "5x", label: "Higher value per AI visitor" },
  ];

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="secondary" className="mb-6 px-4 py-2">
                AI Search Intelligence
              </Badge>
              <h1 className="text-5xl lg:text-7xl font-bold mb-6">
                Are You <span className="gradient-text">Invisible</span> in AI
                Search?
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                GeoRankers is the definitive AI search optimization platform
                that helps B2B SaaS companies track, optimize, and build the
                brand authority needed to get visible in AI search across
                leading AI models like ChatGPT and Gemini.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {user ? (
                  <Link to="/input">
                    <Button variant="hero" size="lg" className="text-lg px-8">
                      <Search className="w-5 h-5 mr-2" />
                      Check Your Visibility
                    </Button>
                  </Link>
                ) : (
                  <Link to="/register">
                    <Button variant="hero" size="lg" className="text-lg px-8">
                      <Zap className="w-5 h-5 mr-2" />
                      Get Started Free
                    </Button>
                  </Link>
                )}
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8"
                  onClick={handleCheckVisibility}
                >
                  <Search className="w-5 h-5 mr-2" />
                  {user ? "New Analysis" : "Check Your Visibility"}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 border-y bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                The AI Search Revolution: By the Numbers
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Traditional search is rapidly being displaced by AI-powered
                discovery
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <Card
                  key={index}
                  className="card-gradient border-0 text-center"
                >
                  <CardContent className="p-6">
                    <div className="text-4xl font-bold gradient-text mb-2">
                      {stat.number}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">
                Comprehensive AI Search Intelligence
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Monitor, analyze, and optimize your brand's presence across all
                major AI platforms
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="card-gradient border-0 hover:shadow-elevated transition-smooth"
                >
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        {feature.icon}
                      </div>
                      <div>
                        <CardTitle className="text-xl">
                          {feature.title}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-hero text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold mb-6">
                Ready to Optimize for AI Search?
              </h2>
              <p className="text-xl mb-8 text-white/90">
                Join thousands of brands already tracking and improving their AI
                search visibility. Get your free analysis in minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="secondary"
                  size="lg"
                  className="text-lg px-8 bg-white text-primary hover:bg-white/90"
                  onClick={handleCheckVisibility}
                >
                  <Search className="w-5 h-5 mr-2" />
                  {user ? "New Analysis" : "Check Your Visibility"}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                {!user && (
                  <Link to="/register">
                    <Button
                      variant="outline"
                      size="lg"
                      className="text-lg px-8 border-white text-muted-foreground hover:bg-white hover:text-primary"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Get Full Access
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
