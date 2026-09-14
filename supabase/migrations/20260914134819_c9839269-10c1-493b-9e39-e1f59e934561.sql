REVOKE EXECUTE ON FUNCTION public.increment_page_visit(text) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.increment_page_click(text) FROM anon, authenticated, PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_page_visit(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.increment_page_click(text) TO service_role;