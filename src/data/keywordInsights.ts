// Mock data for keyword-based insights
export const createKeywordInsights = (website: string, keywords: string[]) => {
  const aiPlatforms = [
    { name: "ChatGPT", percentage: 45, color: "bg-green-500" },
    { name: "Perplexity", percentage: 28, color: "bg-blue-500" },
    { name: "Claude", percentage: 15, color: "bg-purple-500" },
    { name: "Gemini", percentage: 12, color: "bg-yellow-500" }
  ];

  const baseCompetitors = [
    "Zendesk", "Intercom", "Freshdesk", "Help Scout", "LiveChat", 
    "Drift", "Crisp", "Tawk.to", "Tidio", "HubSpot"
  ];

  const keywordData = keywords.map((keyword, index) => ({
    keyword,
    metrics: {
      ai_share: Math.floor(Math.random() * 50) + 10, // 10-60%
      total_queries: Math.floor(Math.random() * 100) + 50, // 50-150
      brand_mentions: Math.floor(Math.random() * 30) + 5, // 5-35
      ai_platforms: aiPlatforms.map(platform => ({
        ...platform,
        visibility: Math.floor(Math.random() * 60) + 20 // 20-80%
      }))
    },
    competitors: baseCompetitors
      .slice(0, 5 + Math.floor(Math.random() * 3))
      .map(name => ({
        name,
        mentions: Math.floor(Math.random() * 80) + 10,
        percentage: Math.floor(Math.random() * 40) + 5
      }))
      .sort((a, b) => b.mentions - a.mentions),
    sources: [
      { domain: "g2.com", count: Math.floor(Math.random() * 50) + 20 },
      { domain: "capterra.com", count: Math.floor(Math.random() * 40) + 15 },
      { domain: "trustpilot.com", count: Math.floor(Math.random() * 30) + 10 },
      { domain: "reddit.com", count: Math.floor(Math.random() * 35) + 8 },
      { domain: "techcrunch.com", count: Math.floor(Math.random() * 20) + 5 }
    ].sort((a, b) => b.count - a.count),
    narrative_gaps: [
      { label: "Pricing information", brandHas: Math.random() > 0.5 },
      { label: "Feature comparisons", brandHas: Math.random() > 0.5 },
      { label: "Customer reviews", brandHas: Math.random() > 0.5 },
      { label: "Integration capabilities", brandHas: Math.random() > 0.5 },
      { label: "Free trial mentioned", brandHas: Math.random() > 0.5 }
    ],
    recommendations: [
      "Optimize listing presence on review sites",
      "Create detailed feature comparison content",
      "Improve pricing transparency in public content",
      "Increase review generation campaigns"
    ]
  }));

  // Overall summary across all keywords
  const overallMetrics = {
    total_queries: keywordData.reduce((sum, kw) => sum + kw.metrics.total_queries, 0),
    total_mentions: keywordData.reduce((sum, kw) => sum + kw.metrics.brand_mentions, 0),
    average_visibility: Math.round(
      keywordData.reduce((sum, kw) => sum + kw.metrics.ai_share, 0) / keywords.length
    ),
    ai_platforms: aiPlatforms.map(platform => ({
      ...platform,
      overall_visibility: Math.round(
        keywordData.reduce((sum, kw) => 
          sum + kw.metrics.ai_platforms.find(p => p.name === platform.name)?.visibility || 0
        , 0) / keywords.length
      )
    }))
  };

  return {
    website,
    keywords: keywordData,
    overall: overallMetrics
  };
};