CREATE TABLE "claims" (
	"id" serial PRIMARY KEY NOT NULL,
	"ownerType" varchar(50),
	"propertyDamage" varchar(50),
	"injuredStatus" varchar(50),
	"firstName" varchar(100),
	"lastName" varchar(100),
	"email" text,
	"phone" text,
	"tcpaConsent" boolean,
	"summary" text
);
