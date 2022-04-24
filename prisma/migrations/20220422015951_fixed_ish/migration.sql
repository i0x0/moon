/*
  Warnings:

  - You are about to drop the `_chat_msgs` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `chatId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_chat_msgs" DROP CONSTRAINT "_chat_msgs_A_fkey";

-- DropForeignKey
ALTER TABLE "_chat_msgs" DROP CONSTRAINT "_chat_msgs_B_fkey";

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "chatId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_chat_msgs";

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
