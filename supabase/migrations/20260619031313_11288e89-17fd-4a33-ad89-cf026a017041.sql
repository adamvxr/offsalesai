CREATE SCHEMA IF NOT EXISTS private;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

GRANT USAGE ON SCHEMA private TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

ALTER POLICY "users read own roles" ON public.user_roles
  USING (auth.uid() = user_id OR private.has_role(auth.uid(), 'admin'));

ALTER POLICY "admins read all profiles" ON public.profiles
  USING (private.has_role(auth.uid(), 'admin'));

ALTER POLICY "admins manage niches" ON public.niches
  USING (private.has_role(auth.uid(), 'admin'))
  WITH CHECK (private.has_role(auth.uid(), 'admin'));

ALTER POLICY "admins read all ebooks" ON public.ebooks
  USING (private.has_role(auth.uid(), 'admin'));

ALTER POLICY "admins read all products" ON public.products
  USING (private.has_role(auth.uid(), 'admin'));

ALTER POLICY "admins read all landing" ON public.landing_pages
  USING (private.has_role(auth.uid(), 'admin'));

ALTER POLICY "admins read all creatives" ON public.creatives
  USING (private.has_role(auth.uid(), 'admin'));

ALTER POLICY "admins read all ledger" ON public.credit_ledger
  USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "admin upload assets" ON storage.objects;
CREATE POLICY "admin upload assets"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'offerai-assets' AND private.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'offerai-assets' AND private.has_role(auth.uid(), 'admin'));

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.consume_credits(uuid, integer, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_credits(uuid, integer, text) TO service_role;