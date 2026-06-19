import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateText } from "ai";
import { z } from "zod";

const MODEL = "google/gemini-3-flash-preview";

async function getGateway() {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
  return createLovableAiGatewayProvider(key);
}

async function consumeCredits(supabase: any, userId: string, amount: number, reason: string) {
  const { error } = await supabase.rpc("consume_credits", {
    _user_id: userId,
    _amount: amount,
    _reason: reason,
  });
  if (error) throw new Error(error.message);
}

async function assertCredits(supabase: any, userId: string, amount: number) {
  const { data, error } = await supabase
    .from("profiles")
    .select("credits")
    .eq("id", userId)
    .single();

  if (error) throw new Error("Não foi possível verificar seus créditos.");
  if ((data?.credits ?? 0) < amount) {
    throw new Error(`Créditos insuficientes (saldo: ${data?.credits ?? 0}, necessário: ${amount})`);
  }
}

function extractJsonObject(text: string) {
  const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/```$/i, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("A IA não retornou um JSON válido. Tente novamente com uma descrição mais específica.");
  }
  return JSON.parse(cleaned.slice(start, end + 1));
}

async function generateStructured<T>(gateway: Awaited<ReturnType<typeof getGateway>>, schema: z.ZodSchema<T>, prompt: string) {
  const { text } = await generateText({
    model: gateway(MODEL),
    prompt: `${prompt}\n\nResponda APENAS com um objeto JSON válido, sem markdown, sem comentários e sem texto fora do JSON. Use exatamente as chaves solicitadas.`,
  });

  try {
    return schema.parse(extractJsonObject(text));
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("A IA retornou um JSON inválido. Tente novamente.");
    }
    throw error;
  }
}

const flexibleString = (fallback: string) => z.preprocess((value) => {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    return String(record.label ?? record.value ?? record.level ?? record.status ?? JSON.stringify(value));
  }
  return String(value);
}, z.string().default(fallback));

const percentNumber = z.coerce.number().catch(50).transform((value) => Math.max(0, Math.min(100, Math.round(value))));

const stringArray = z.preprocess((value) => {
  if (Array.isArray(value)) return value.map((item) => typeof item === "string" ? item : JSON.stringify(item));
  if (typeof value === "string") return value.split(/\n|;|•|-/).map((item) => item.trim()).filter(Boolean);
  return [];
}, z.array(z.string()));

// ---------- VALIDATE NICHE (5 créditos) ----------
const ValidateInput = z.object({ niche: z.string().min(2), pain: z.string().optional() });
const ValidateOutput = z.object({
  score: z.coerce.number().default(0),
  classification: flexibleString("Boa"),
  searchVolume: flexibleString("Não estimado"),
  competition: flexibleString("Média"),
  trend: flexibleString("Estável"),
  easeOfSale: flexibleString("Média"),
  searchBar: percentNumber.default(50),
  competitionBar: percentNumber.default(50),
  trendBar: percentNumber.default(50),
  easeBar: percentNumber.default(50),
  pains: stringArray.default([]),
  insight: flexibleString(""),
});

export const validateNiche = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => ValidateInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertCredits(context.supabase, context.userId, 5);
    const gateway = await getGateway();
    const output = await generateStructured(gateway, ValidateOutput, `Você é um analista sênior de mercado de infoprodutos brasileiros. Avalie o nicho "${data.niche}"${data.pain ? ` com foco na dor "${data.pain}"` : ""}. Retorne em português as chaves: score, classification, searchVolume, competition, trend, easeOfSale, searchBar, competitionBar, trendBar, easeBar, pains, insight. Score e barras devem ser números de 0-100. Pains deve conter 4-6 dores reais do público.`);
    await consumeCredits(context.supabase, context.userId, 5, "validate_niche");
    return output;
  });

// ---------- GENERATE OFFER (10 créditos) ----------
const OfferInput = z.object({
  niche: z.string(),
  pain: z.string().optional(),
  audience: z.string().optional(),
});
const stringArray = z.preprocess((value) => {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") return value.split(/\n|;|•|-/).map((item) => item.trim()).filter(Boolean);
  return [];
}, z.array(z.string()));
const OfferOutput = z.object({
  name: z.string().default("Oferta Gerada"),
  bigIdea: z.string().default(""),
  mechanism: z.string().default(""),
  promise: z.string().default(""),
  headline: z.string().default(""),
  subheadline: z.string().default(""),
  benefits: stringArray.default([]),
  bonuses: stringArray.default([]),
  guarantee: z.string().default("Garantia incondicional de 7 dias"),
  priceSuggestion: z.string().default("R$ 97"),
});

export const generateOffer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => OfferInput.parse(d))
  .handler(async ({ context, data }) => {
    await consumeCredits(context.supabase, context.userId, 10, "generate_offer");
    const gateway = await getGateway();
    const output = await generateStructured(gateway, OfferOutput, `Crie uma oferta de infoproduto matadora em português para o nicho "${data.niche}"${data.pain ? `, dor central: "${data.pain}"` : ""}${data.audience ? `, público: "${data.audience}"` : ""}. Use copywriting de resposta direta brasileiro. Retorne as chaves: name, bigIdea, mechanism, promise, headline, subheadline, benefits, bonuses, guarantee, priceSuggestion. Benefits deve ter 4-6 itens e bonuses 3-5 itens.`);

    const { data: saved, error } = await context.supabase
      .from("offers")
      .insert({
        user_id: context.userId,
        title: output.name,
        niche: data.niche,
        status: "draft",
        data: output as never,
        score: 0,
      })
      .select()
      .single();
    if (error) throw error;
    return { offer: output, id: saved.id };
  });

// ---------- GENERATE COPY (5 créditos) ----------
const CopyInput = z.object({
  channel: z.string(),
  offerTitle: z.string(),
  bigIdea: z.string().optional(),
  promise: z.string().optional(),
});

export const generateCopy = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => CopyInput.parse(d))
  .handler(async ({ context, data }) => {
    await consumeCredits(context.supabase, context.userId, 5, "generate_copy");
    const gateway = await getGateway();
    const output = await generateStructured(gateway, z.object({ variations: stringArray.default([]) }), `Gere 3 variações de copy para o canal "${data.channel}", oferta "${data.offerTitle}"${data.bigIdea ? `, Big Idea: ${data.bigIdea}` : ""}${data.promise ? `, Promessa: ${data.promise}` : ""}. Português brasileiro, persuasivo, com gatilhos mentais (urgência, prova social, autoridade), adequado ao formato e limite de caracteres do canal. Cada variação deve ter ângulo diferente. Retorne a chave variations como array.`);

    // salvar como criativo
    await context.supabase.from("creatives").insert({
      user_id: context.userId,
      type: `copy_${data.channel}`,
      prompt: data.offerTitle,
      content: output.variations.join("\n\n---\n\n"),
    });

    return output;
  });

// ---------- GENERATE EBOOK (20 créditos) ----------
const EbookInput = z.object({
  offerId: z.string().uuid().optional(),
  title: z.string().min(2),
  niche: z.string(),
  tier: z.enum(["simple", "premium", "ultra"]).default("premium"),
});
const EbookOutput = z.object({
  title: z.string().default("Ebook Gerado"),
  subtitle: z.string().default(""),
  chapters: z.array(z.object({
    title: z.string().default("Capítulo"),
    summary: z.string().default(""),
    content: z.string().default(""),
  })).default([]),
  coverPrompt: z.string().default(""),
});

export const generateEbook = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => EbookInput.parse(d))
  .handler(async ({ context, data }) => {
    await consumeCredits(context.supabase, context.userId, 20, "generate_ebook");
    const gateway = await getGateway();
    const chaptersCount = data.tier === "simple" ? 8 : data.tier === "premium" ? 12 : 20;

    const output = await generateStructured(gateway, EbookOutput, `Crie um ebook profissional em português para o nicho "${data.niche}", título base "${data.title}". Tier: ${data.tier} (${chaptersCount} capítulos). Retorne as chaves: title, subtitle, chapters, coverPrompt. Chapters deve ser um array de capítulos com title, summary e content. Cada capítulo deve ter conteúdo útil e prático.`);

    const { data: saved, error } = await context.supabase
      .from("ebooks")
      .insert({
        user_id: context.userId,
        offer_id: data.offerId ?? null,
        title: output.title,
        content: output as never,
      })
      .select()
      .single();
    if (error) throw error;
    return { ebook: output, id: saved.id };
  });

// ---------- GENERATE LANDING PAGE (25 créditos) ----------
const LandingInput = z.object({
  offerId: z.string().uuid().optional(),
  offerTitle: z.string(),
  headline: z.string(),
  promise: z.string().optional(),
  color: z.string().default("#FF5B1F"),
  theme: z.enum(["dark", "light"]).default("dark"),
});

export const generateLandingPage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => LandingInput.parse(d))
  .handler(async ({ context, data }) => {
    await consumeCredits(context.supabase, context.userId, 25, "generate_landing");
    const gateway = await getGateway();

    const { text } = await generateText({
      model: gateway(MODEL),
      prompt: `Gere uma landing page completa em HTML5 puro (sem React, sem JS externo, com <style> inline) em português para a oferta:
Título: ${data.offerTitle}
Headline: ${data.headline}
${data.promise ? `Promessa: ${data.promise}` : ""}
Cor primária: ${data.color}
Tema: ${data.theme}

Inclua seções: hero com CTA, benefícios (4-6), prova social, depoimentos (3), FAQ (5), garantia, rodapé. Use fontes Google (Inter). Design moderno, mobile-first. Retorne APENAS o HTML completo começando com <!DOCTYPE html>, sem explicações nem markdown.`,
    });

    // Limpar fences se vier ```html
    const html = text.replace(/^```html\n?/i, "").replace(/\n?```$/, "").trim();
    const slug = (data.offerTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Math.random().toString(36).slice(2, 6)).slice(0, 60);

    const { data: saved, error } = await context.supabase
      .from("landing_pages")
      .insert({
        user_id: context.userId,
        offer_id: data.offerId ?? null,
        html,
        theme: data.theme,
        color: data.color,
        slug,
        published: false,
      })
      .select()
      .single();
    if (error) throw error;
    return { id: saved.id, slug, html };
  });

// ---------- GENERATE CREATIVE COPY (15 créditos) ----------
const CreativeInput = z.object({
  offerId: z.string().uuid().optional(),
  offerTitle: z.string(),
  type: z.enum(["instagram_post", "instagram_story", "reels_script", "vsl_script", "google_ad"]),
});

export const generateCreative = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => CreativeInput.parse(d))
  .handler(async ({ context, data }) => {
    await consumeCredits(context.supabase, context.userId, 15, "generate_creative");
    const gateway = await getGateway();

    const { text } = await generateText({
      model: gateway(MODEL),
      prompt: `Gere um criativo do tipo "${data.type}" para a oferta "${data.offerTitle}", em português, persuasivo, com hook forte nas primeiras 3 segundos/palavras, CTA clara. Para roteiros de vídeo, inclua marcações [CENA], [TEXTO NA TELA], [NARRAÇÃO].`,
    });

    const { data: saved, error } = await context.supabase
      .from("creatives")
      .insert({
        user_id: context.userId,
        offer_id: data.offerId ?? null,
        type: data.type,
        prompt: data.offerTitle,
        content: text,
      })
      .select()
      .single();
    if (error) throw error;
    return { id: saved.id, content: text };
  });
