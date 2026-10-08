DROP POLICY IF EXISTS "Anyone can read pages" ON public.pages;
REVOKE SELECT ON public.pages FROM anon;
CREATE POLICY "Users can read their own pages" ON public.pages FOR SELECT TO authenticated USING (auth.uid() = user_id);