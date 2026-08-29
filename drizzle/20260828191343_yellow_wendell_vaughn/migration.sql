CREATE TABLE "links" (
	"id" serial PRIMARY KEY,
	"slug" varchar(32) NOT NULL UNIQUE,
	"url" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
