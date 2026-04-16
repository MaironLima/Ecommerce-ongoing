-- =========================================
-- 🔍 SEARCH SETUP - PRODUCT
-- =========================================

-- 1. Extensão necessária (fuzzy search)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- =========================================
-- 2. Coluna de busca (Full Text)
-- =========================================

ALTER TABLE product 
ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- =========================================
-- 3. Popular dados existentes (apenas se vazio)
-- =========================================

UPDATE product
SET search_vector = to_tsvector(
  'portuguese',
  coalesce(title, '') || ' ' || coalesce(description, '')
)
WHERE search_vector IS NULL;

-- =========================================
-- 4. Índices (performance)
-- =========================================

-- Full text search
CREATE INDEX IF NOT EXISTS idx_product_search 
ON product USING GIN(search_vector);

-- Fuzzy search (trigram)
CREATE INDEX IF NOT EXISTS idx_product_title_trgm 
ON product USING GIN(title gin_trgm_ops);

-- =========================================
-- 5. Função de atualização automática
-- =========================================

CREATE OR REPLACE FUNCTION product_search_update() 
RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    to_tsvector(
      'portuguese',
      coalesce(NEW.title, '') || ' ' || coalesce(NEW.description, '')
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =========================================
-- 6. Trigger (recria sempre com segurança)
-- =========================================

DROP TRIGGER IF EXISTS trigger_product_search ON product;

CREATE TRIGGER trigger_product_search
BEFORE INSERT OR UPDATE ON product
FOR EACH ROW
EXECUTE FUNCTION product_search_update();

-- =========================================
-- ✅ FIM
-- =========================================