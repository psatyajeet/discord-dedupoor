/*
  Warnings:

  - A unique constraint covering the columns `[discordId]` on the table `channels` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[discordId]` on the table `guilds` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[discordId]` on the table `messages` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[discordId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "channels_discordId_key" ON "channels"("discordId");

-- CreateIndex
CREATE UNIQUE INDEX "guilds_discordId_key" ON "guilds"("discordId");

-- CreateIndex
CREATE UNIQUE INDEX "messages_discordId_key" ON "messages"("discordId");

-- CreateIndex
CREATE UNIQUE INDEX "users_discordId_key" ON "users"("discordId");
