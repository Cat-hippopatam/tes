-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'AUTHOR', 'MODERATOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('COURSE', 'MODULE', 'ARTICLE', 'VIDEO', 'PODCAST', 'QUIZ', 'TASK');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'ARCHIVED', 'DELETED');

-- CreateEnum
CREATE TYPE "DifficultyLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "VideoProvider" AS ENUM ('YOUTUBE', 'RUTUBE', 'VIMEO', 'LOCAL');

-- CreateEnum
CREATE TYPE "ReactionType" AS ENUM ('LIKE', 'DISLIKE');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'PAST_DUE', 'CANCELED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "ModerationItemType" AS ENUM ('CONTENT', 'COMMENT', 'PROFILE');

-- CreateEnum
CREATE TYPE "ModerationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('EMAIL', 'IN_APP', 'TELEGRAM');

-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('EMAIL', 'GOOGLE', 'VK', 'YANDEX', 'GITHUB');

-- CreateEnum
CREATE TYPE "StorageProvider" AS ENUM ('VERCEL_BLOB', 'AWS_S3', 'CLOUDINARY', 'LOCAL');

-- CreateTable
CREATE TABLE "users" (
    "user_id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "password_hash" VARCHAR(255),
    "role" "Role" NOT NULL DEFAULT 'USER',
    "email_verified" TIMESTAMPTZ(6),
    "is_blocked" BOOLEAN NOT NULL DEFAULT false,
    "blocked_reason" TEXT,
    "last_login_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "account_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "provider" VARCHAR(50) NOT NULL,
    "provider_account_id" VARCHAR(255) NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" VARCHAR(50),
    "scope" VARCHAR(255),
    "id_token" TEXT,
    "session_state" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("account_id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("identifier","token")
);

-- CreateTable
CREATE TABLE "Authenticator" (
    "credentialID" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "provider_account_id" VARCHAR(255) NOT NULL,
    "credentialPublicKey" TEXT NOT NULL,
    "counter" INTEGER NOT NULL,
    "credentialDeviceType" TEXT NOT NULL,
    "credentialBackedUp" BOOLEAN NOT NULL,
    "transports" TEXT,

    CONSTRAINT "Authenticator_pkey" PRIMARY KEY ("user_id","credentialID")
);

-- CreateTable
CREATE TABLE "profiles" (
    "profile_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "nickname" VARCHAR(50) NOT NULL,
    "display_name" VARCHAR(255) NOT NULL,
    "avatar_url" TEXT,
    "cover_image" TEXT,
    "bio" TEXT,
    "website" VARCHAR(255),
    "telegram" VARCHAR(100),
    "youtube" VARCHAR(100),
    "total_views" INTEGER NOT NULL DEFAULT 0,
    "subscribers" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("profile_id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "session_id" UUID NOT NULL,
    "session_token" VARCHAR(255) NOT NULL,
    "user_id" UUID NOT NULL,
    "expires" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("session_id")
);

-- CreateTable
CREATE TABLE "content" (
    "content_id" UUID NOT NULL,
    "type" "ContentType" NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "body" TEXT,
    "cover_image" TEXT,
    "video_url" TEXT,
    "video_provider" "VideoProvider",
    "video_duration" INTEGER,
    "module_id" UUID,
    "difficulty_level" "DifficultyLevel",
    "meta_title" VARCHAR(255),
    "meta_description" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "is_premium" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMPTZ(6),
    "author_profile_id" UUID NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "views_count" INTEGER NOT NULL DEFAULT 0,
    "likes_count" INTEGER NOT NULL DEFAULT 0,
    "comments_count" INTEGER NOT NULL DEFAULT 0,
    "favorites_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "content_pkey" PRIMARY KEY ("content_id")
);

-- CreateTable
CREATE TABLE "attachments" (
    "attachment_id" UUID NOT NULL,
    "content_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "file_name" VARCHAR(255) NOT NULL,
    "file_size" INTEGER NOT NULL,
    "mime_type" VARCHAR(100) NOT NULL,
    "url" TEXT NOT NULL,
    "storage_provider" VARCHAR(50) NOT NULL,
    "storage_path" TEXT NOT NULL,
    "description" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "download_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "attachments_pkey" PRIMARY KEY ("attachment_id")
);

-- CreateTable
CREATE TABLE "modules" (
    "module_id" UUID NOT NULL,
    "course_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "cover_image" TEXT,
    "duration" INTEGER,
    "lessons_count" INTEGER NOT NULL DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMPTZ(6),
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "modules_pkey" PRIMARY KEY ("module_id")
);

-- CreateTable
CREATE TABLE "tags" (
    "tag_id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "slug" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "color" VARCHAR(7),
    "content_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("tag_id")
);

-- CreateTable
CREATE TABLE "tag_content" (
    "tag_content_id" UUID NOT NULL,
    "tag_id" UUID NOT NULL,
    "content_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tag_content_pkey" PRIMARY KEY ("tag_content_id")
);

-- CreateTable
CREATE TABLE "comments" (
    "comment_id" UUID NOT NULL,
    "content_id" UUID NOT NULL,
    "author_profile_id" UUID NOT NULL,
    "text" TEXT NOT NULL,
    "parent_id" UUID,
    "status" "ModerationStatus" NOT NULL DEFAULT 'PENDING',
    "moderated_by" UUID,
    "moderated_at" TIMESTAMPTZ(6),
    "moderation_reason" TEXT,
    "likes_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "comments_pkey" PRIMARY KEY ("comment_id")
);

-- CreateTable
CREATE TABLE "favorites" (
    "favorite_id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,
    "content_id" UUID NOT NULL,
    "note" TEXT,
    "collection" VARCHAR(100),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("favorite_id")
);

-- CreateTable
CREATE TABLE "content_reactions" (
    "content_reaction_id" UUID NOT NULL,
    "type" "ReactionType" NOT NULL,
    "profile_id" UUID NOT NULL,
    "content_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_reactions_pkey" PRIMARY KEY ("content_reaction_id")
);

-- CreateTable
CREATE TABLE "comment_reactions" (
    "comment_reaction_id" UUID NOT NULL,
    "type" "ReactionType" NOT NULL,
    "profile_id" UUID NOT NULL,
    "comment_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comment_reactions_pkey" PRIMARY KEY ("comment_reaction_id")
);

-- CreateTable
CREATE TABLE "history" (
    "history_id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,
    "content_id" UUID NOT NULL,
    "watched_seconds" INTEGER,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "viewed_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "history_pkey" PRIMARY KEY ("history_id")
);

-- CreateTable
CREATE TABLE "progress" (
    "progress_id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,
    "content_id" UUID NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'not_started',
    "progress_percent" INTEGER NOT NULL DEFAULT 0,
    "last_position" INTEGER,
    "completed_lessons" INTEGER NOT NULL DEFAULT 0,
    "total_lessons" INTEGER NOT NULL DEFAULT 0,
    "started_at" TIMESTAMPTZ(6),
    "completed_at" TIMESTAMPTZ(6),
    "last_viewed_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "progress_pkey" PRIMARY KEY ("progress_id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "subscription_id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,
    "plan_type" VARCHAR(50) NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "start_date" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMPTZ(6),
    "trial_ends_at" TIMESTAMPTZ(6),
    "auto_renew" BOOLEAN NOT NULL DEFAULT true,
    "cancel_at_period_end" BOOLEAN NOT NULL DEFAULT false,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'RUB',
    "payment_method_id" UUID,
    "provider_subscription_id" VARCHAR(255),
    "provider" VARCHAR(50),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "canceled_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("subscription_id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "transaction_id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,
    "subscription_id" UUID,
    "type" VARCHAR(50) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'RUB',
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "content_id" UUID,
    "payment_method_id" UUID,
    "provider" VARCHAR(50) NOT NULL,
    "provider_payment_id" VARCHAR(255),
    "provider_response" JSONB,
    "refunded_at" TIMESTAMPTZ(6),
    "refund_amount" DOUBLE PRECISION,
    "refund_reason" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "completed_at" TIMESTAMPTZ(6),
    "failed_at" TIMESTAMPTZ(6),

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("transaction_id")
);

-- CreateTable
CREATE TABLE "payment_methods" (
    "payment_method_id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "provider" VARCHAR(50) NOT NULL,
    "provider_token" TEXT NOT NULL,
    "last4" VARCHAR(4),
    "card_type" VARCHAR(50),
    "expiry_month" INTEGER,
    "expiry_year" INTEGER,
    "phone_number" VARCHAR(20),
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_expired" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "payment_methods_pkey" PRIMARY KEY ("payment_method_id")
);

-- CreateTable
CREATE TABLE "business_events" (
    "event_id" UUID NOT NULL,
    "profile_id" UUID,
    "event_type" VARCHAR(100) NOT NULL,
    "event_category" VARCHAR(50) NOT NULL,
    "object_type" VARCHAR(50),
    "object_id" UUID,
    "metadata" JSONB,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "session_id" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "business_events_pkey" PRIMARY KEY ("event_id")
);

-- CreateTable
CREATE TABLE "moderation_queue" (
    "moderation_item_id" UUID NOT NULL,
    "item_type" "ModerationItemType" NOT NULL,
    "item_id" UUID NOT NULL,
    "item_snapshot" JSONB,
    "status" "ModerationStatus" NOT NULL DEFAULT 'PENDING',
    "submitted_by_profile_id" UUID NOT NULL,
    "moderated_by_profile_id" UUID,
    "moderation_comment" TEXT,
    "moderated_at" TIMESTAMPTZ(6),
    "priority" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "moderation_queue_pkey" PRIMARY KEY ("moderation_item_id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "notification_id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,
    "type" "NotificationType" NOT NULL,
    "channel" VARCHAR(50) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "body" TEXT NOT NULL,
    "data" JSONB,
    "link_url" TEXT,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "is_sent" BOOLEAN NOT NULL DEFAULT false,
    "external_id" VARCHAR(255),
    "error_message" TEXT,
    "scheduled_for" TIMESTAMPTZ(6),
    "sent_at" TIMESTAMPTZ(6),
    "read_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("notification_id")
);

-- CreateTable
CREATE TABLE "certificates" (
    "certificate_id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,
    "content_id" UUID NOT NULL,
    "issued_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMPTZ(6) NOT NULL,
    "image_url" TEXT,
    "pdf_url" TEXT,
    "certificate_number" VARCHAR(50) NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "certificates_pkey" PRIMARY KEY ("certificate_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_created_at_idx" ON "users"("created_at");

-- CreateIndex
CREATE INDEX "users_deleted_at_idx" ON "users"("deleted_at");

-- CreateIndex
CREATE INDEX "accounts_user_id_idx" ON "accounts"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "Authenticator_credentialID_key" ON "Authenticator"("credentialID");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_user_id_key" ON "profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_nickname_key" ON "profiles"("nickname");

-- CreateIndex
CREATE INDEX "profiles_user_id_idx" ON "profiles"("user_id");

-- CreateIndex
CREATE INDEX "profiles_nickname_idx" ON "profiles"("nickname");

-- CreateIndex
CREATE INDEX "profiles_display_name_idx" ON "profiles"("display_name");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token");

-- CreateIndex
CREATE INDEX "sessions_session_token_idx" ON "sessions"("session_token");

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "content_slug_key" ON "content"("slug");

-- CreateIndex
CREATE INDEX "content_slug_idx" ON "content"("slug");

-- CreateIndex
CREATE INDEX "content_author_profile_id_idx" ON "content"("author_profile_id");

-- CreateIndex
CREATE INDEX "content_type_idx" ON "content"("type");

-- CreateIndex
CREATE INDEX "content_status_idx" ON "content"("status");

-- CreateIndex
CREATE INDEX "content_published_at_idx" ON "content"("published_at");

-- CreateIndex
CREATE INDEX "content_module_id_idx" ON "content"("module_id");

-- CreateIndex
CREATE INDEX "content_difficulty_level_idx" ON "content"("difficulty_level");

-- CreateIndex
CREATE INDEX "content_deleted_at_idx" ON "content"("deleted_at");

-- CreateIndex
CREATE INDEX "attachments_content_id_idx" ON "attachments"("content_id");

-- CreateIndex
CREATE INDEX "attachments_mime_type_idx" ON "attachments"("mime_type");

-- CreateIndex
CREATE INDEX "attachments_created_at_idx" ON "attachments"("created_at");

-- CreateIndex
CREATE INDEX "modules_course_id_idx" ON "modules"("course_id");

-- CreateIndex
CREATE INDEX "modules_sort_order_idx" ON "modules"("sort_order");

-- CreateIndex
CREATE INDEX "modules_is_published_idx" ON "modules"("is_published");

-- CreateIndex
CREATE INDEX "modules_deleted_at_idx" ON "modules"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tags_slug_key" ON "tags"("slug");

-- CreateIndex
CREATE INDEX "tags_slug_idx" ON "tags"("slug");

-- CreateIndex
CREATE INDEX "tags_name_idx" ON "tags"("name");

-- CreateIndex
CREATE INDEX "tag_content_tag_id_idx" ON "tag_content"("tag_id");

-- CreateIndex
CREATE INDEX "tag_content_content_id_idx" ON "tag_content"("content_id");

-- CreateIndex
CREATE UNIQUE INDEX "tag_content_tag_id_content_id_key" ON "tag_content"("tag_id", "content_id");

-- CreateIndex
CREATE INDEX "comments_content_id_idx" ON "comments"("content_id");

-- CreateIndex
CREATE INDEX "comments_author_profile_id_idx" ON "comments"("author_profile_id");

-- CreateIndex
CREATE INDEX "comments_parent_id_idx" ON "comments"("parent_id");

-- CreateIndex
CREATE INDEX "comments_status_idx" ON "comments"("status");

-- CreateIndex
CREATE INDEX "comments_created_at_idx" ON "comments"("created_at");

-- CreateIndex
CREATE INDEX "comments_deleted_at_idx" ON "comments"("deleted_at");

-- CreateIndex
CREATE INDEX "favorites_profile_id_idx" ON "favorites"("profile_id");

-- CreateIndex
CREATE INDEX "favorites_content_id_idx" ON "favorites"("content_id");

-- CreateIndex
CREATE INDEX "favorites_collection_idx" ON "favorites"("collection");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_profile_id_content_id_key" ON "favorites"("profile_id", "content_id");

-- CreateIndex
CREATE INDEX "content_reactions_content_id_idx" ON "content_reactions"("content_id");

-- CreateIndex
CREATE INDEX "content_reactions_profile_id_idx" ON "content_reactions"("profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "content_reactions_profile_id_content_id_key" ON "content_reactions"("profile_id", "content_id");

-- CreateIndex
CREATE INDEX "comment_reactions_comment_id_idx" ON "comment_reactions"("comment_id");

-- CreateIndex
CREATE INDEX "comment_reactions_profile_id_idx" ON "comment_reactions"("profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "comment_reactions_profile_id_comment_id_key" ON "comment_reactions"("profile_id", "comment_id");

-- CreateIndex
CREATE INDEX "history_profile_id_idx" ON "history"("profile_id");

-- CreateIndex
CREATE INDEX "history_content_id_idx" ON "history"("content_id");

-- CreateIndex
CREATE INDEX "history_viewed_at_idx" ON "history"("viewed_at");

-- CreateIndex
CREATE UNIQUE INDEX "history_profile_id_content_id_key" ON "history"("profile_id", "content_id");

-- CreateIndex
CREATE INDEX "progress_profile_id_idx" ON "progress"("profile_id");

-- CreateIndex
CREATE INDEX "progress_content_id_idx" ON "progress"("content_id");

-- CreateIndex
CREATE INDEX "progress_status_idx" ON "progress"("status");

-- CreateIndex
CREATE UNIQUE INDEX "progress_profile_id_content_id_key" ON "progress"("profile_id", "content_id");

-- CreateIndex
CREATE INDEX "subscriptions_profile_id_idx" ON "subscriptions"("profile_id");

-- CreateIndex
CREATE INDEX "subscriptions_status_idx" ON "subscriptions"("status");

-- CreateIndex
CREATE INDEX "subscriptions_end_date_idx" ON "subscriptions"("end_date");

-- CreateIndex
CREATE INDEX "subscriptions_provider_subscription_id_idx" ON "subscriptions"("provider_subscription_id");

-- CreateIndex
CREATE INDEX "transactions_profile_id_idx" ON "transactions"("profile_id");

-- CreateIndex
CREATE INDEX "transactions_subscription_id_idx" ON "transactions"("subscription_id");

-- CreateIndex
CREATE INDEX "transactions_status_idx" ON "transactions"("status");

-- CreateIndex
CREATE INDEX "transactions_provider_payment_id_idx" ON "transactions"("provider_payment_id");

-- CreateIndex
CREATE INDEX "transactions_created_at_idx" ON "transactions"("created_at");

-- CreateIndex
CREATE INDEX "payment_methods_profile_id_idx" ON "payment_methods"("profile_id");

-- CreateIndex
CREATE INDEX "payment_methods_is_default_idx" ON "payment_methods"("is_default");

-- CreateIndex
CREATE INDEX "payment_methods_provider_token_idx" ON "payment_methods"("provider_token");

-- CreateIndex
CREATE INDEX "business_events_profile_id_idx" ON "business_events"("profile_id");

-- CreateIndex
CREATE INDEX "business_events_event_type_idx" ON "business_events"("event_type");

-- CreateIndex
CREATE INDEX "business_events_event_category_idx" ON "business_events"("event_category");

-- CreateIndex
CREATE INDEX "business_events_object_type_object_id_idx" ON "business_events"("object_type", "object_id");

-- CreateIndex
CREATE INDEX "business_events_created_at_idx" ON "business_events"("created_at");

-- CreateIndex
CREATE INDEX "moderation_queue_status_idx" ON "moderation_queue"("status");

-- CreateIndex
CREATE INDEX "moderation_queue_item_type_item_id_idx" ON "moderation_queue"("item_type", "item_id");

-- CreateIndex
CREATE INDEX "moderation_queue_submitted_by_profile_id_idx" ON "moderation_queue"("submitted_by_profile_id");

-- CreateIndex
CREATE INDEX "moderation_queue_priority_idx" ON "moderation_queue"("priority");

-- CreateIndex
CREATE INDEX "moderation_queue_created_at_idx" ON "moderation_queue"("created_at");

-- CreateIndex
CREATE INDEX "notifications_profile_id_idx" ON "notifications"("profile_id");

-- CreateIndex
CREATE INDEX "notifications_type_idx" ON "notifications"("type");

-- CreateIndex
CREATE INDEX "notifications_is_read_idx" ON "notifications"("is_read");

-- CreateIndex
CREATE INDEX "notifications_scheduled_for_idx" ON "notifications"("scheduled_for");

-- CreateIndex
CREATE INDEX "notifications_created_at_idx" ON "notifications"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "certificates_certificate_number_key" ON "certificates"("certificate_number");

-- CreateIndex
CREATE INDEX "certificates_profile_id_idx" ON "certificates"("profile_id");

-- CreateIndex
CREATE INDEX "certificates_content_id_idx" ON "certificates"("content_id");

-- CreateIndex
CREATE INDEX "certificates_certificate_number_idx" ON "certificates"("certificate_number");

-- CreateIndex
CREATE UNIQUE INDEX "certificates_profile_id_content_id_key" ON "certificates"("profile_id", "content_id");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Authenticator" ADD CONSTRAINT "Authenticator_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content" ADD CONSTRAINT "content_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "modules"("module_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content" ADD CONSTRAINT "content_author_profile_id_fkey" FOREIGN KEY ("author_profile_id") REFERENCES "profiles"("profile_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "content"("content_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modules" ADD CONSTRAINT "modules_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "content"("content_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tag_content" ADD CONSTRAINT "tag_content_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("tag_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tag_content" ADD CONSTRAINT "tag_content_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "content"("content_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "content"("content_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_author_profile_id_fkey" FOREIGN KEY ("author_profile_id") REFERENCES "profiles"("profile_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "comments"("comment_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("profile_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "content"("content_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_reactions" ADD CONSTRAINT "content_reactions_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("profile_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_reactions" ADD CONSTRAINT "content_reactions_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "content"("content_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_reactions" ADD CONSTRAINT "comment_reactions_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("profile_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_reactions" ADD CONSTRAINT "comment_reactions_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("comment_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "history" ADD CONSTRAINT "history_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("profile_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "history" ADD CONSTRAINT "history_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "content"("content_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progress" ADD CONSTRAINT "progress_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("profile_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progress" ADD CONSTRAINT "progress_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "content"("content_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("profile_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_payment_method_id_fkey" FOREIGN KEY ("payment_method_id") REFERENCES "payment_methods"("payment_method_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("profile_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("subscription_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "content"("content_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_payment_method_id_fkey" FOREIGN KEY ("payment_method_id") REFERENCES "payment_methods"("payment_method_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_methods" ADD CONSTRAINT "payment_methods_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("profile_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_events" ADD CONSTRAINT "business_events_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("profile_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moderation_queue" ADD CONSTRAINT "moderation_queue_submitted_by_profile_id_fkey" FOREIGN KEY ("submitted_by_profile_id") REFERENCES "profiles"("profile_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moderation_queue" ADD CONSTRAINT "moderation_queue_moderated_by_profile_id_fkey" FOREIGN KEY ("moderated_by_profile_id") REFERENCES "profiles"("profile_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("profile_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("profile_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "content"("content_id") ON DELETE CASCADE ON UPDATE CASCADE;
