REVOKE ALL ON FUNCTION public.get_all_profiles() FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.get_user_roles(uuid) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_all_profiles() TO service_role;
GRANT EXECUTE ON FUNCTION public.get_user_roles(uuid) TO service_role;