import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "site_settings_locales" (
  	"site_title" varchar NOT NULL,
  	"site_description" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  DROP TABLE "ui_strings" CASCADE;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "site_settings_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "site_settings" DROP COLUMN "site_title";
  ALTER TABLE "site_settings" DROP COLUMN "site_description";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "ui_strings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"product_card_add_to_cart_label" varchar DEFAULT 'Add to Cart' NOT NULL,
  	"product_card_sold_out_label" varchar DEFAULT 'Sold Out' NOT NULL,
  	"product_price_tax_text_default" varchar DEFAULT 'excl. tax' NOT NULL,
  	"stock_badge_in_stock_label" varchar DEFAULT 'In Stock' NOT NULL,
  	"stock_badge_low_stock_label" varchar DEFAULT 'Low Stock' NOT NULL,
  	"stock_badge_out_of_stock_label" varchar DEFAULT 'Out of Stock' NOT NULL,
  	"stock_badge_preorder_label" varchar DEFAULT 'Available for Preorder' NOT NULL,
  	"variant_selector_color_group_label" varchar DEFAULT 'Color' NOT NULL,
  	"variant_selector_size_group_label" varchar DEFAULT 'Size' NOT NULL,
  	"product_filters_filters_title" varchar DEFAULT 'Filters' NOT NULL,
  	"product_filters_clear_all_label" varchar DEFAULT 'Clear All' NOT NULL,
  	"product_filters_categories_label" varchar DEFAULT 'Categories' NOT NULL,
  	"product_filters_brands_label" varchar DEFAULT 'Brands' NOT NULL,
  	"product_filters_price_range_label" varchar DEFAULT 'Price Range' NOT NULL,
  	"product_filters_price_to_label" varchar DEFAULT 'to' NOT NULL,
  	"product_filters_apply_price_label" varchar DEFAULT 'Apply Price' NOT NULL,
  	"product_filters_availability_label" varchar DEFAULT 'Availability' NOT NULL,
  	"product_sort_sort_by_label" varchar DEFAULT 'Sort by' NOT NULL,
  	"product_grid_no_products_title" varchar DEFAULT 'No products found' NOT NULL,
  	"product_grid_no_products_description" varchar DEFAULT 'We couldn''t find any products matching your filters. Try adjusting your filter preferences or browse a different category.' NOT NULL,
  	"product_grid_loading_more_label" varchar DEFAULT 'Loading more products...' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  DROP TABLE "site_settings_locales" CASCADE;
  ALTER TABLE "site_settings" ADD COLUMN "site_title" varchar NOT NULL;
  ALTER TABLE "site_settings" ADD COLUMN "site_description" varchar NOT NULL;`)
}
