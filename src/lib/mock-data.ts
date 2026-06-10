export const kpis = {
  totalOffers: 24,
  totalLandingPages: 18,
  leadsCaptured: 4_281,
  salesCount: 612,
  conversionRate: 14.3,
  totalRevenue: 184_320,
  monthRevenue: 42_180,
  roi: 4.7,
};

export const salesByDay = [
  { day: "Seg", sales: 28, leads: 142 },
  { day: "Ter", sales: 41, leads: 198 },
  { day: "Qua", sales: 35, leads: 176 },
  { day: "Qui", sales: 58, leads: 254 },
  { day: "Sex", sales: 72, leads: 312 },
  { day: "Sáb", sales: 64, leads: 281 },
  { day: "Dom", sales: 48, leads: 205 },
];

export const conversionByOffer = [
  { name: "Detox 7D", value: 18.2 },
  { name: "Renda Extra IA", value: 22.8 },
  { name: "Match Perfeito", value: 11.4 },
  { name: "Bumbum 30D", value: 16.7 },
  { name: "Pets Fit", value: 9.8 },
];

export const leadSources = [
  { name: "Instagram", value: 38 },
  { name: "TikTok", value: 24 },
  { name: "Google Ads", value: 18 },
  { name: "Facebook", value: 14 },
  { name: "Orgânico", value: 6 },
];

export const topOffers = [
  { name: "Renda Extra IA", revenue: 38_420, sales: 184 },
  { name: "Detox 7D", revenue: 28_910, sales: 142 },
  { name: "Bumbum 30D", revenue: 21_180, sales: 98 },
];

export const niches = [
  "Emagrecimento", "Renda Extra", "Relacionamento", "Marketing Digital",
  "Futebol", "Saúde", "Finanças", "Pets", "Musculação", "Beleza",
  "Gastronomia", "Maternidade", "Desenvolvimento Pessoal",
];

export const painsByNiche: Record<string, string[]> = {
  Emagrecimento: ["Perder barriga", "Emagrecer rápido", "Acabar com compulsão", "Emagrecer após gravidez"],
  "Renda Extra": ["Sair das dívidas", "Trabalhar de casa", "Primeira venda online", "Renda em horas vagas"],
  Relacionamento: ["Reconquistar ex", "Atrair mulheres", "Encontrar amor", "Resolver crise no casamento"],
  "Marketing Digital": ["Primeiros R$10k", "Lançar produto", "Tráfego pago do zero", "Funil que converte"],
  Futebol: ["Aposta esportiva lucro", "Análise tática", "Modelagem de odds"],
  Saúde: ["Dor crônica", "Insônia", "Imunidade baixa", "Energia diária"],
  Finanças: ["Sair do vermelho", "Investir do zero", "Renda passiva", "Independência financeira"],
  Pets: ["Adestrar cão", "Pet ansioso", "Alimentação natural"],
  Musculação: ["Hipertrofia rápida", "Bumbum dos sonhos", "Definição abdominal"],
  Beleza: ["Pele perfeita", "Cabelo crescer", "Maquiagem profissional"],
  Gastronomia: ["Confeitaria lucrativa", "Marmita fit", "Doces gourmet"],
  Maternidade: ["Sono do bebê", "Introdução alimentar", "Pós-parto"],
  "Desenvolvimento Pessoal": ["Produtividade", "Ansiedade", "Foco e disciplina"],
};

export const offerTemplates = [
  {
    name: "Método Detox 7D",
    bigIdea: "O protocolo japonês de 7 dias que elimina 4kg sem academia",
    mechanism: "Termogênese Circadiana™",
    promise: "Perca até 4kg em 7 dias com 12 min/dia",
    headline: "Descubra o protocolo japonês que está fazendo mulheres perderem 4kg em 7 dias",
    subheadline: "Sem dieta restritiva, sem academia, apenas 12 minutos por dia.",
    benefits: ["Barriga seca em 7 dias", "Mais energia já no 2º dia", "Sem efeito sanfona", "Cardápios prontos"],
    bonuses: ["Receituário express", "Audiobook motivacional", "Grupo VIP no Telegram"],
    guarantee: "Garantia incondicional de 30 dias",
  },
  {
    name: "Renda Extra IA",
    bigIdea: "Use 3 IAs gratuitas para faturar R$200/dia trabalhando 1h",
    mechanism: "Stack Triplo de IA™",
    promise: "Faça suas primeiras vendas em 7 dias usando IA",
    headline: "O método para fazer R$200/dia trabalhando 1 hora com IA",
    subheadline: "Mesmo começando do zero, sem aparecer e sem investimento.",
    benefits: ["Primeira venda em 7 dias", "Templates prontos", "Sem precisar gravar vídeos", "Suporte humano"],
    bonuses: ["Banco de nichos lucrativos", "Mentoria semanal ao vivo", "Pack de prompts secretos"],
    guarantee: "7 dias de teste 100% sem risco",
  },
];

export const checkoutPlatforms = ["Hotmart", "Kiwify", "Perfect Pay", "Eduzz", "Braip", "Monetizze"];

export const landingTemplates = [
  { id: "min", name: "Minimalista", desc: "Foco no texto, alta legibilidade" },
  { id: "premium", name: "Premium", desc: "Gradientes, glassmorphism, alto padrão" },
  { id: "black", name: "Black", desc: "Fundo escuro, dourado, autoridade" },
  { id: "conv", name: "Conversão Máxima", desc: "Padrão validado de 18% conv." },
  { id: "vsl", name: "VSL", desc: "Player + checkout abaixo da dobra" },
];

export const creativeFormats = [
  { id: "feed", label: "Feed Instagram", size: "1080x1080" },
  { id: "story", label: "Story", size: "1080x1920" },
  { id: "fb", label: "Facebook", size: "1200x628" },
  { id: "banner", label: "Banner", size: "1200x300" },
  { id: "pinterest", label: "Pinterest", size: "1000x1500" },
  { id: "display", label: "Google Display", size: "300x250" },
];

export const videoFormats = [
  { id: "vsl", label: "VSL", duration: "3-15 min" },
  { id: "reels", label: "Reels", duration: "15-60 s" },
  { id: "shorts", label: "Shorts", duration: "15-60 s" },
  { id: "tiktok", label: "TikTok", duration: "15-60 s" },
  { id: "story", label: "Story", duration: "15 s" },
];

export const copyChannels = [
  "Facebook Ads", "Instagram Ads", "WhatsApp", "Google Ads", "TikTok Ads",
  "YouTube Ads", "Email Marketing", "Mensagens para grupos", "X1 (1:1)",
  "Script de fechamento", "Quebra de objeções", "Follow-up automático",
];

export const leads = [
  { id: 1, name: "Mariana Costa", whatsapp: "+55 11 98765-4321", email: "mari@ex.com", origin: "Instagram", offer: "Detox 7D", status: "Novo Lead" as const },
  { id: 2, name: "Lucas Andrade", whatsapp: "+55 21 99887-2211", email: "lucas@ex.com", origin: "TikTok", offer: "Renda Extra IA", status: "Contatado" as const },
  { id: 3, name: "Camila Rocha", whatsapp: "+55 31 99123-4567", email: "camila@ex.com", origin: "Google Ads", offer: "Bumbum 30D", status: "Em Conversa" as const },
  { id: 4, name: "Pedro Henrique", whatsapp: "+55 41 98123-9988", email: "pedro@ex.com", origin: "Facebook", offer: "Renda Extra IA", status: "Interessado" as const },
  { id: 5, name: "Juliana Lima", whatsapp: "+55 51 99988-7711", email: "ju@ex.com", origin: "Instagram", offer: "Detox 7D", status: "Comprou" as const },
  { id: 6, name: "Rafael Souza", whatsapp: "+55 11 98000-1122", email: "rafa@ex.com", origin: "Orgânico", offer: "Bumbum 30D", status: "Perdido" as const },
];

export const leadStatuses = ["Novo Lead", "Contatado", "Em Conversa", "Interessado", "Comprou", "Perdido"] as const;
export type LeadStatus = (typeof leadStatuses)[number];

export const winningOffers = [
  { niche: "Emagrecimento", structure: "VSL + Order Bump", type: "Lowticket → Upsell", headline: "Perca 4kg em 7 dias com o protocolo japonês", funnel: "Anúncio → VSL → Checkout → Upsell" },
  { niche: "Renda Extra", structure: "Quiz + Carta", type: "Midticket", headline: "Descubra qual nicho de IA combina com você", funnel: "Quiz → Carta → Webinar → Pitch" },
  { niche: "Relacionamento", structure: "Live perpétua", type: "Highticket", headline: "Como reconquistar em 21 dias", funnel: "Ads → Captura → Live → Aplicação" },
  { niche: "Musculação", structure: "Carta longa", type: "Lowticket", headline: "Bumbum em 30 dias sem academia", funnel: "Reels → Carta → Checkout" },
  { niche: "Finanças", structure: "Webinar perpétuo", type: "Highticket", headline: "De endividado a investidor em 90 dias", funnel: "Ads → Iscamento → Webinar → Pitch" },
];

export const adminUsers = [
  { id: 1, name: "João Silva", email: "joao@ex.com", plan: "Pro", credits: 8200, mrr: 97 },
  { id: 2, name: "Ana Beatriz", email: "ana@ex.com", plan: "Starter", credits: 1200, mrr: 49 },
  { id: 3, name: "Carlos Mendes", email: "carlos@ex.com", plan: "Agency", credits: 24000, mrr: 297 },
  { id: 4, name: "Renata Dias", email: "renata@ex.com", plan: "Free", credits: 30, mrr: 0 },
  { id: 5, name: "Marcos Vinicius", email: "marcos@ex.com", plan: "Pro", credits: 6400, mrr: 97 },
];
