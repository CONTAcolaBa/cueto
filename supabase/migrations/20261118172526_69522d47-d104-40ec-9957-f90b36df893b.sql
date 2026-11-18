CREATE TABLE public.campaign_leads (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), slug text NOT NULL, whatsapp text NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
CREATE INDEX campaign_leads_slug_idx ON public.campaign_leads(slug);
GRANT SELECT ON public.campaign_leads TO authenticated;
GRANT ALL ON public.campaign_leads TO service_role;
ALTER TABLE public.campaign_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners can read their campaign leads" ON public.campaign_leads FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.pages p WHERE p.slug = campaign_leads.slug AND p.user_id = auth.uid()));