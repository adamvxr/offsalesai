import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateText, Output } from "ai";
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

// ---------- VALIDATE NICHE (5 créditos) ----------
const ValidateInput = z.object({ niche: z.string().min(2), pain: z.string().optional() });

export const validateNiche = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => ValidateInput.parse(d))
  .handler(async ({ data, context }) => {
    await consumeCredits(context.supabase, context.userId, 5, "validate_niche");
    const gateway = await getGateway();
    const { output } = await generateText({
      model: gateway(MODEL),
      output: Output.object({
        schema: z.object({
          score: z.number().min(0).max(100),
          classification: z.string(),
          searchVolume: z.string(),
          competition: z.string(),
          trend: z.string(),
          easeOfSale: z.string(),
          searchBar: z.number().min(0).max(100),
          competitionBar: z.number().min(0).max(100),
          trendBar: z.number().min(0).max(100),
          easeBar: z.number().min(0).max(100),
          pains: z.array(z.string()).min(3).max(6),
          insight: z.string(),
        }),
      }),
      prompt: `Você é um analista sênior de mercado de infoprodutos brasileiros. Avalie o nicho "${data.niche}"${data.pain ? ` com foco na dor "${data.pain}"` : ""}. Retorne em português um score de 0-100, classificação (Excelente/Muito Boa/Boa/Arriscada), volume de busca estimado (ex: "320k/mês"), nível de concorrência, tendência YoY, facilidade de venda, barras (0-100) para cada indicador, 4-6 dores reais do público, e um insight estratégico curto.`,
    });
    return output;
  });

// ---------- GENERATE OFFER (10 créditos) ----------
const OfferInput = z.object({
  niche: z.string(),
  pain: z.string().optional(),
  audience: z.string().optional(),
});

export const generateOffer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => OfferInput.parse(d))
  .handler(async ({ context, data }) => {
    await consumeCredits(context.supabase, context.userId, 10, "generate_offer");
    const gateway = await getGateway();
    const { output } = await generateText({
      model: gateway(MODEL),
      output: Output.object({
        schema: z.object({
          name: z.string(),
          bigIdea: z.string(),
          mechanism: z.string(),
          promise: z.string(),
          headline: z.string(),
          subheadline: z.string(),
          benefits: z.array(z.string()).min(4).max(6),
          bonuses: z.array(z.string()).min(3).max(5),
          guarantee: z.string(),
          priceSuggestion: z.string(),
        }),
      }),
      prompt: `Crie uma oferta de infoproduto matadora em português para o nicho "${data.niche}"${data.pain ? `, dor central: "${data.pain}"` : ""}${data.audience ? `, público: "${data.audience}"` : ""}. Use copywriting de resposta direta brasileiro. Big Idea contraintuitiva, mecanismo único nomeado (com ™), promessa específica e mensurável com prazo, headline forte, subheadline complementar, 4-6 benefícios em bullets curtos, 3-5 bônus irresistíveis, garantia incondicional, sugestão de preço (R$).`,
    });

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
    const { output } = await generateText({
      model: gateway(MODEL),
      output: Output.object({
        schema: z.object({
          variations: z.array(z.string()).min(3).max(4),
        }),
      }),
      prompt: `Gere 3 variações de copy para o canal "${data.channel}", oferta "${data.offerTitle}"${data.bigIdea ? `, Big Idea: ${data.bigIdea}` : ""}${data.promise ? `, Promessa: ${data.promise}` : ""}. Português brasileiro, persuasivo, com gatilhos mentais (urgência, prova social, autoridade), adequado ao formato e limite de caracteres do canal. Cada variação deve ter ângulo diferente.`,
    });

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

export const generateEbook = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => EbookInput.parse(d))
  .handler(async ({ context, data }) => {
    await consumeCredits(context.supabase, context.userId, 20, "generate_ebook");
    const gateway = await getGateway();
    const chaptersCount = data.tier === "simple" ? 8 : data.tier === "premium" ? 12 : 20;

    const { output } = await generateText({
      model: gateway(MODEL),
      output: Output.object({
        schema: z.object({
          title: z.string(),
          subtitle: z.string(),
          chapters: z.array(z.object({
            title: z.string(),
            summary: z.string(),
            content: z.string(),
          })).min(chaptersCount).max(chaptersCount + 4),
          coverPrompt: z.string(),
        }),
      }),
      prompt: `Crie um ebook profissional em português para o nicho "${data.niche}", título base "${data.title}". Tier: ${data.tier} (${chaptersCount} capítulos). Cada capítulo deve ter título cativante, summary de 1 frase, e content de 3-5 parágrafos com conteúdo útil e prático. Inclua um coverPrompt detalhado para gerar a capa.`,
    });

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
