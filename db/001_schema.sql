-- Esquema inicial para la carta editable. Aplicar después de vincular el proyecto Neon.
-- owner_user_id almacena el identificador de Neon Auth; la autorización se valida en el servidor.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id text NOT NULL,
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9-]+$'),
  plan text NOT NULL DEFAULT 'administrada' CHECK (plan IN ('administrada', 'autogestionable')),
  editing_enabled boolean NOT NULL DEFAULT false,
  name text NOT NULL,
  tagline text NOT NULL DEFAULT '',
  initial text NOT NULL DEFAULT '',
  primary_color text NOT NULL DEFAULT '#d64a2e' CHECK (primary_color ~ '^#[0-9A-Fa-f]{6}$'),
  whatsapp text NOT NULL DEFAULT '',
  instagram text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  map_url text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX businesses_owner_user_id_idx ON businesses (owner_user_id);

CREATE TABLE business_hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  sort_order integer NOT NULL DEFAULT 0,
  days text NOT NULL,
  hours text NOT NULL
);

CREATE TABLE menu_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  sort_order integer NOT NULL DEFAULT 0,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  UNIQUE (business_id, sort_order)
);

CREATE TABLE menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES menu_categories(id) ON DELETE CASCADE,
  sort_order integer NOT NULL DEFAULT 0,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT '🍽️',
  photo_url text NOT NULL DEFAULT '',
  available boolean NOT NULL DEFAULT true,
  UNIQUE (category_id, sort_order)
);

CREATE TABLE item_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  sort_order integer NOT NULL DEFAULT 0,
  name text NOT NULL,
  price_ars integer NOT NULL CHECK (price_ars >= 0),
  UNIQUE (item_id, sort_order)
);

CREATE TABLE item_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  sort_order integer NOT NULL DEFAULT 0,
  label text NOT NULL
);

CREATE INDEX menu_categories_business_idx ON menu_categories (business_id, sort_order);
CREATE INDEX menu_items_category_idx ON menu_items (category_id, sort_order);
CREATE INDEX item_variants_item_idx ON item_variants (item_id, sort_order);
