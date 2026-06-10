import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateText, Output } from "ai";
import { z } from "zod";

const MODEL = "google/gemini-3-flash-preview";

function getGateway() {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  // dynamic import to keep server-only module out of client graph
  return import("./ai-gateway.server").then((m) => m.createLovableAiGatewayProvider(key));
}

// ---------- VALIDATE NICHE ----------
const ValidateInput = z.object({ niche: z.string().min(2), pain: z.string().optional() });

export const validateNiche = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => ValidateInput.parse(d))
  .handler(async ({ data }) => {
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
      prompt: `Você é um analista sênior de mercado de infoprodutos brasileiros. Avalie o nicho "${data.niche}"${data.pain ? ` com foco na dor "${data.pain}"` : ""}. Retorne em português um score de 0-100, classificação (Excelente/Muito Boa/Boa/Arriscada), volume de busca estimado (ex: "320k/mês"), nível de concorrência, tendência YoY, facilidade de venda, barras (0-100) para cada indicador, lista das 4-6 principais dores reais do público, e um insight estratégico curto.`,
    });
    return output;
  });

// ---------- GENERATE OFFER ----------
const OfferInput = z.object({
  niche: z.string(),
  pain: z.string().optional(),
  audience: z.string().optional(),
});

export const generateOffer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => OfferInput.parse(d))
  .handler(async ({ context, data }) => {
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

    // persist
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

// ---------- GENERATE COPY ----------
const CopyInput = z.object({
  channel: z.string(),
  offerTitle: z.string(),
  bigIdea: z.string().optional(),
  promise: z.string().optional(),
});

export const generateCopy = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => CopyInput.parse(d))
  .handler(async ({ data }) => {
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
    return output;
  });
