-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "phone" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'CUSTOMER',
    "nickname" TEXT,
    "avatar_url" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "farms" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "province" TEXT,
    "city" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "area_size" REAL,
    "certifications" JSONB,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "farms_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "farm_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "description" TEXT,
    "price" REAL NOT NULL,
    "unit" TEXT NOT NULL DEFAULT '公斤',
    "stock_quantity" REAL,
    "grade" TEXT,
    "is_organic" BOOLEAN NOT NULL DEFAULT false,
    "trace_code" TEXT,
    "image_urls" JSONB NOT NULL,
    "video_url" TEXT,
    "metadata" JSONB,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "products_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "farms" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "order_no" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "total_amount" REAL NOT NULL,
    "payment_method" TEXT,
    "payment_time" DATETIME,
    "shipping_address" JSONB,
    "tracking_number" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,
    "quantity" REAL NOT NULL,
    "unit_price" REAL NOT NULL,
    "subtotal" REAL NOT NULL,
    CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "market_prices" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "product_name" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "volume" REAL,
    "change_percent" REAL,
    "recorded_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "traceability_records" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "product_id" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "location" TEXT,
    "operator" TEXT,
    "data" JSONB,
    "images" JSONB,
    "recorded_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "traceability_records_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "farm_monitoring" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "farm_id" TEXT NOT NULL,
    "soil_humidity" REAL,
    "soil_temperature" REAL,
    "air_temperature" REAL,
    "air_humidity" REAL,
    "pest_risk" TEXT NOT NULL DEFAULT 'LOW',
    "alert_level" TEXT NOT NULL DEFAULT 'NORMAL',
    "recorded_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "farm_monitoring_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "farms" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "instructor_id" TEXT NOT NULL,
    "thumbnail_url" TEXT,
    "video_url" TEXT,
    "duration" INTEGER,
    "is_live" BOOLEAN NOT NULL DEFAULT false,
    "liveStartTime" TEXT,
    "price" REAL NOT NULL DEFAULT 0,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "courses_instructor_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "livestreams" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "thumbnail_url" TEXT,
    "stream_url" TEXT,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "start_time" DATETIME,
    "end_time" DATETIME,
    "viewer_count" INTEGER NOT NULL DEFAULT 0,
    "sales_amount" REAL NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "livestreams_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "farm_adoptions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "farm_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "adoption_type" TEXT NOT NULL,
    "area_size" REAL,
    "start_date" TEXT NOT NULL,
    "end_date" TEXT NOT NULL,
    "total_amount" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "farm_adoptions_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "farms" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "farm_adoptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "products_trace_code_key" ON "products"("trace_code");

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_no_key" ON "orders"("order_no");
