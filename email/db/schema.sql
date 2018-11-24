--
-- Schema for subscribers database
--
CREATE TABLE "subscribers" (
"id" INTEGER PRIMARY KEY,
"active" INTEGER DEFAULT 1 NOT NULL,
"email" VARCHAR(100) UNIQUE,
"cuisines" VARCHAR(255),
"location" VARCHAR(255),
"unsubscribe_token" VARCHAR(255),
"created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
"last_sent" DATETIME
);
INSERT INTO "subscribers" VALUES (2, 1, 'test@example.com', 'all', 'test', '123', '2018-11-24 12:28:30', '2018-11-24 12:30:24');
