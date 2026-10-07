ALTER TABLE public.pages
  ADD COLUMN base_raised numeric(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN base_donations integer NOT NULL DEFAULT 0,
  ADD COLUMN goal numeric(12,2) NOT NULL DEFAULT 10000,
  ADD COLUMN paid_raised numeric(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN paid_donations integer NOT NULL DEFAULT 0;

CREATE TABLE public.pix_payments (
  external_id text PRIMARY KEY,
  slug text NOT NULL,
  amount numeric(12,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.pix_payments TO service_role;
ALTER TABLE public.pix_payments ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_pix_payments_updated_at BEFORE UPDATE ON public.pix_payments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.confirm_pix_payment(_external_id text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE r public.pix_payments;
BEGIN
  UPDATE public.pix_payments SET status = 'paid'
  WHERE external_id = _external_id AND status <> 'paid'
  RETURNING * INTO r;
  IF FOUND THEN
    UPDATE public.pages SET paid_raised = paid_raised + r.amount, paid_donations = paid_donations + 1
    WHERE slug = r.slug;
  END IF;
END; $$;
REVOKE EXECUTE ON FUNCTION public.confirm_pix_payment(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.confirm_pix_payment(text) TO service_role;