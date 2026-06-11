
-- ============ NICHES (catálogo público) ============
CREATE TABLE public.niches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  pains TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.niches TO anon, authenticated;
GRANT ALL ON public.niches TO service_role;
ALTER TABLE public.niches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "niches readable by all" ON public.niches FOR SELECT USING (true);
CREATE POLICY "admins manage niches" ON public.niches FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

INSERT INTO public.niches (name, pains) VALUES
  ('Emagrecimento', ARRAY['Perder barriga após gravidez','Compulsão por doces','Metabolismo lento','Falta de tempo para treinar']),
  ('Renda Extra', ARRAY['Sair do CLT','Dívidas no cartão','Não saber por onde começar','Medo de investir']),
  ('Relacionamento', ARRAY['Reconquistar ex','Insegurança no namoro','Comunicação no casamento','Ciúmes excessivo']),
  ('Inglês', ARRAY['Travar na hora de falar','Não entender filmes','Pronúncia ruim','Vergonha de praticar']),
  ('Espiritualidade', ARRAY['Ansiedade','Falta de propósito','Insônia','Bloqueios financeiros']),
  ('Marketing Digital', ARRAY['Não vender no Instagram','Tráfego pago caro','Falta de criativos','Não saber copywriting'])
ON CONFLICT (name) DO NOTHING;

-- ============ EBOOKS ============
CREATE TABLE public.ebooks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  offer_id UUID REFERENCES public.offers(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  cover_url TEXT,
  pdf_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ebooks TO authenticated;
GRANT ALL ON public.ebooks TO service_role;
ALTER TABLE public.ebooks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users manage own ebooks" ON public.ebooks FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "admins read all ebooks" ON public.ebooks FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'));
CREATE TRIGGER ebooks_updated_at BEFORE UPDATE ON public.ebooks
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============ PRODUCTS (checkout config) ============
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  offer_id UUID REFERENCES public.offers(id) ON DELETE CASCADE,
  platform TEXT NOT NULL DEFAULT 'hotmart',
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  checkout_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users manage own products" ON public.products FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "admins read all products" ON public.products FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'));
CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============ LANDING PAGES ============
CREATE TABLE public.landing_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  offer_id UUID REFERENCES public.offers(id) ON DELETE CASCADE,
  html TEXT NOT NULL DEFAULT '',
  theme TEXT NOT NULL DEFAULT 'dark',
  color TEXT NOT NULL DEFAULT '#FF5B1F',
  slug TEXT UNIQUE,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.landing_pages TO authenticated;
GRANT SELECT ON public.landing_pages TO anon;
GRANT ALL ON public.landing_pages TO service_role;
ALTER TABLE public.landing_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users manage own landing" ON public.landing_pages FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "published landing readable" ON public.landing_pages FOR SELECT
  USING (published = true);
CREATE POLICY "admins read all landing" ON public.landing_pages FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'));
CREATE TRIGGER landing_updated_at BEFORE UPDATE ON public.landing_pages
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============ CREATIVES ============
CREATE TABLE public.creatives (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  offer_id UUID REFERENCES public.offers(id) ON DELETE SET NULL,
  type TEXT NOT NULL DEFAULT 'copy',
  prompt TEXT,
  content TEXT,
  file_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.creatives TO authenticated;
GRANT ALL ON public.creatives TO service_role;
ALTER TABLE public.creatives ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users manage own creatives" ON public.creatives FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "admins read all creatives" ON public.creatives FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- ============ CREDIT LEDGER ============
CREATE TABLE public.credit_ledger (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  delta INTEGER NOT NULL,
  reason TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.credit_ledger TO authenticated;
GRANT ALL ON public.credit_ledger TO service_role;
ALTER TABLE public.credit_ledger ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own ledger" ON public.credit_ledger FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "admins read all ledger" ON public.credit_ledger FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- ============ consume_credits RPC ============
CREATE OR REPLACE FUNCTION public.consume_credits(_user_id UUID, _amount INTEGER, _reason TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE current_balance INTEGER;
BEGIN
  SELECT credits INTO current_balance FROM public.profiles WHERE id = _user_id FOR UPDATE;
  IF current_balance IS NULL THEN RAISE EXCEPTION 'Perfil não encontrado'; END IF;
  IF current_balance < _amount THEN RAISE EXCEPTION 'Créditos insuficientes (saldo: %, necessário: %)', current_balance, _amount; END IF;
  UPDATE public.profiles SET credits = credits - _amount, updated_at = now() WHERE id = _user_id;
  INSERT INTO public.credit_ledger (user_id, delta, reason) VALUES (_user_id, -_amount, _reason);
  RETURN current_balance - _amount;
END;
$$;

GRANT EXECUTE ON FUNCTION public.consume_credits(UUID, INTEGER, TEXT) TO authenticated, service_role;
