-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true);

-- Storage policies for product images
CREATE POLICY "Anyone can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Admins can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update product images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete product images"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

-- Insert initial products
INSERT INTO public.products (name, slug, description, short_description, price, compare_at_price, category, ingredients, benefits, how_to_use, expected_results, in_stock, featured)
VALUES 
(
  'Crème Camouflante Noire',
  'creme-camouflante-noire',
  'Notre crème camouflante noire offre une couverture naturelle et imperceptible pour les zones clairsemées. Formulée avec des pigments micronisés de haute qualité, elle s''adapte parfaitement à votre cuir chevelu pour un résultat invisible et durable.',
  'Couverture naturelle pour zones clairsemées',
  38.00,
  49.00,
  'camouflage',
  ARRAY['Cire d''abeille naturelle', 'Huile de jojoba bio', 'Pigments minéraux naturels', 'Vitamine E', 'Extrait de bambou'],
  ARRAY['Couverture immédiate et naturelle', 'Résistant à l''eau et à la transpiration', 'Formule non comédogène', 'Enrichi en actifs nourrissants'],
  'Appliquez une petite quantité sur les zones clairsemées avec les doigts ou l''applicateur fourni. Estompez délicatement pour un résultat naturel. Laissez sécher 2 minutes.',
  'Résultat visible immédiatement. Tenue jusqu''à 24h. Résiste à la pluie légère et à la transpiration.',
  true,
  true
),
(
  'Crème Camouflante Châtain',
  'creme-camouflante-chatain',
  'Notre crème camouflante châtain offre une couverture naturelle et imperceptible pour les zones clairsemées. Formulée avec des pigments micronisés de haute qualité, elle s''adapte parfaitement à votre cuir chevelu pour un résultat invisible et durable.',
  'Couverture naturelle teinte châtain',
  39.00,
  49.00,
  'camouflage',
  ARRAY['Cire d''abeille naturelle', 'Huile de jojoba bio', 'Pigments minéraux naturels', 'Vitamine E', 'Extrait de bambou'],
  ARRAY['Couverture immédiate et naturelle', 'Résistant à l''eau et à la transpiration', 'Formule non comédogène', 'Enrichi en actifs nourrissants'],
  'Appliquez une petite quantité sur les zones clairsemées avec les doigts ou l''applicateur fourni. Estompez délicatement pour un résultat naturel. Laissez sécher 2 minutes.',
  'Résultat visible immédiatement. Tenue jusqu''à 24h. Résiste à la pluie légère et à la transpiration.',
  true,
  true
),
(
  'Shampoing Anti-Chute Fortifiant',
  'shampoing-anti-chute-fortifiant',
  'Notre shampoing anti-chute combine les dernières avancées scientifiques avec des ingrédients naturels pour renforcer le cheveu dès la racine. Sa formule active stimule la micro-circulation du cuir chevelu et apporte les nutriments essentiels au bulbe capillaire.',
  'Formule active pour renforcer le cheveu',
  28.00,
  NULL,
  'anti-chute',
  ARRAY['Caféine naturelle', 'Biotine (Vitamine B7)', 'Extrait de saw palmetto', 'Zinc PCA', 'Huile essentielle de romarin', 'Kératine végétale'],
  ARRAY['Stimule la micro-circulation', 'Renforce la fibre capillaire', 'Nourrit le bulbe en profondeur', 'Usage quotidien possible'],
  'Appliquez sur cheveux mouillés, massez délicatement le cuir chevelu pendant 2-3 minutes pour activer la circulation. Rincez abondamment. Utilisez 3 à 5 fois par semaine.',
  'Premiers résultats visibles après 4 à 6 semaines d''utilisation régulière. Cheveux plus denses et résistants après 3 mois.',
  true,
  true
),
(
  'Sérum Anti-Chute Intensif',
  'serum-anti-chute-intensif',
  'Notre sérum concentré en actifs cible directement les causes de la chute de cheveux. Sa formule hautement concentrée pénètre en profondeur pour agir sur le follicule pileux et prolonger la phase de croissance du cheveu.',
  'Traitement concentré ciblé',
  45.00,
  NULL,
  'anti-chute',
  ARRAY['Minoxidil végétal', 'Complexe de peptides', 'Acide hyaluronique', 'Niacinamide', 'Extrait de ginseng', 'Procapil™'],
  ARRAY['Action ciblée sur le follicule', 'Prolonge le cycle de vie du cheveu', 'Texture légère non grasse', 'Compatible avec coiffage'],
  'Appliquez 1ml directement sur le cuir chevelu sec, matin et soir. Massez délicatement. Ne pas rincer. Laissez agir au minimum 4 heures avant le prochain shampoing.',
  'Réduction visible de la chute après 8 semaines. Repousse constatée après 3-4 mois d''utilisation assidue.',
  true,
  false
);