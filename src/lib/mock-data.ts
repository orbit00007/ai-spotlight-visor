export const mockInsightsData = {
  created_at: "2024-08-20T14:30:00Z",
  brand: "Kommunicate",
  keywords: ["customer support", "live chat", "chatbot"],
  summary: {
    total_queries: 150,
    ai_share_of_answers: {
      brand_hits: 43,
      percent: 29
    }
  },
  insights: {
    competitor_share_of_voice: [
      { name: "Intercom", count: 89, percent: 59 },
      { name: "Zendesk", count: 67, percent: 45 },
      { name: "Freshchat", count: 45, percent: 30 },
      { name: "Kommunicate", count: 43, percent: 29 },
      { name: "Crisp", count: 34, percent: 23 }
    ],
    source_influence: {
      total_citations: 342,
      domains: [
        { domain: "g2.com", count: 89, percent: 26 },
        { domain: "capterra.com", count: 67, percent: 20 },
        { domain: "trustpilot.com", count: 45, percent: 13 },
        { domain: "getapp.com", count: 34, percent: 10 },
        { domain: "softwareadvice.com", count: 28, percent: 8 },
        { domain: "producthunt.com", count: 23, percent: 7 },
        { domain: "techcrunch.com", count: 18, percent: 5 },
        { domain: "reddit.com", count: 15, percent: 4 }
      ]
    },
    narrative_gaps: [
      { key: "pricing", label: "Pricing anchor quoted", brandHas: false, topRivalsWith: ["Intercom", "Zendesk"] },
      { key: "affordable", label: "Affordable positioning", brandHas: true, topRivalsWith: ["Freshchat", "Crisp"] },
      { key: "ai_chatbot", label: "AI chatbot", brandHas: true, topRivalsWith: ["Intercom", "Zendesk"] },
      { key: "ticketing", label: "Ticketing", brandHas: false, topRivalsWith: ["Zendesk", "Freshchat"] },
      { key: "omnichannel", label: "Omnichannel / Multi channel", brandHas: true, topRivalsWith: ["Intercom", "Zendesk"] },
      { key: "crm_integrations", label: "CRM integrations", brandHas: false, topRivalsWith: ["Intercom", "Zendesk"] },
      { key: "knowledge_base", label: "Knowledge base", brandHas: true, topRivalsWith: ["Zendesk", "Freshchat"] },
      { key: "analytics", label: "Analytics / Reporting", brandHas: false, topRivalsWith: ["Intercom", "Zendesk"] }
    ],
    brand_defense: {
      enabled: true,
      risk: "Medium",
      brand_appears_in_alt: 12,
      alt_queries_count: 28
    }
  },
  actions: [
    {
      category: "Reviews and listings",
      trigger_note: "Low presence on key review sites",
      items: [
        "Increase G2 review volume to compete with Intercom's 89 citations",
        "Claim and optimize Capterra profile with detailed feature descriptions",
        "Encourage customers to leave Trustpilot reviews highlighting affordability"
      ]
    },
    {
      category: "Pricing and positioning",
      trigger_note: "Pricing transparency issues detected",
      items: [
        "Add clear pricing information to website homepage",
        "Create pricing comparison pages vs major competitors",
        "Highlight cost savings compared to enterprise solutions"
      ]
    },
    {
      category: "Content and feature coverage",
      trigger_note: "Missing key feature mentions",
      items: [
        "Create content showcasing ticketing system capabilities",
        "Develop case studies highlighting CRM integration success",
        "Publish analytics and reporting feature guides"
      ]
    },
    {
      category: "Brand defense and comparisons",
      trigger_note: "Moderate risk in alternatives queries",
      items: [
        "Create 'Kommunicate vs [competitor]' comparison pages",
        "Optimize for 'Kommunicate alternatives' searches",
        "Develop thought leadership content in customer support space"
      ]
    }
  ],
  drilldowns: {
    query_explorer: [
      {
        query_id: "q1",
        query: "best customer support software for small business",
        providers: ["ChatGPT", "Claude", "Perplexity"],
        brand_present: true,
        top_answers: [
          {
            name: "Zendesk",
            best_rank: 1,
            description: "Enterprise-grade customer support platform with comprehensive ticketing, knowledge base, and reporting features.",
            price: "$49/month per agent",
            features: ["Ticketing system", "Knowledge base", "Analytics", "Multi-channel support"],
            sources: ["zendesk.com", "g2.com", "capterra.com"]
          },
          {
            name: "Intercom",
            best_rank: 2,
            description: "Modern messaging platform that combines live chat, chatbots, and customer support tools.",
            price: "$74/month per seat",
            features: ["Live chat", "Chatbots", "Customer data platform", "Automation"],
            sources: ["intercom.com", "g2.com", "trustpilot.com"]
          },
          {
            name: "Kommunicate",
            best_rank: 4,
            description: "Affordable customer support solution with AI chatbots and live chat for growing businesses.",
            price: "$30/month per agent",
            features: ["AI chatbots", "Live chat", "Multi-channel", "Affordable pricing"],
            sources: ["kommunicate.io", "getapp.com"]
          }
        ],
        sources_count: 8
      },
      {
        query_id: "q2",
        query: "Intercom alternatives affordable pricing",
        providers: ["ChatGPT", "Perplexity"],
        brand_present: true,
        top_answers: [
          {
            name: "Freshchat",
            best_rank: 1,
            description: "Cost-effective customer messaging software with modern interface and automation.",
            price: "$15/month per agent",
            features: ["Live chat", "Chatbots", "Team collaboration", "Mobile apps"],
            sources: ["freshworks.com", "g2.com", "capterra.com"]
          },
          {
            name: "Kommunicate",
            best_rank: 2,
            description: "Budget-friendly alternative with powerful AI chatbots and seamless live chat handover.",
            price: "$30/month per agent",
            features: ["AI chatbots", "Live chat", "Integrations", "Affordable"],
            sources: ["kommunicate.io", "producthunt.com"]
          }
        ],
        sources_count: 6
      }
    ],
    sources_detail: [
      {
        domain: "g2.com",
        count: 89,
        percent: 26,
        queries: [
          "best customer support software for small business",
          "top rated live chat tools 2024",
          "customer service platform comparison"
        ]
      },
      {
        domain: "capterra.com",
        count: 67,
        percent: 20,
        queries: [
          "affordable customer support software",
          "best help desk solutions",
          "customer service tools for startups"
        ]
      }
    ],
    attributes_matrix: {
      columns: ["Kommunicate", "Intercom", "Zendesk", "Freshchat", "Crisp", "LiveChat"],
      rows: [
        { attribute: "Pricing transparency", values: [false, true, true, true, true, true] },
        { attribute: "Affordable positioning", values: [true, false, false, true, true, false] },
        { attribute: "AI chatbot", values: [true, true, false, true, false, false] },
        { attribute: "Ticketing system", values: [false, true, true, true, false, false] },
        { attribute: "Omnichannel support", values: [true, true, true, true, true, true] },
        { attribute: "CRM integrations", values: [false, true, true, true, false, true] },
        { attribute: "Knowledge base", values: [true, true, true, true, false, false] },
        { attribute: "Analytics reporting", values: [false, true, true, true, false, true] }
      ]
    }
  }
};