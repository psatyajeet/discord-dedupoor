-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "guildId" INTEGER;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "guilds"("id") ON DELETE SET NULL ON UPDATE CASCADE;
