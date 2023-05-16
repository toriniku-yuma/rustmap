/*
  Warnings:

  - You are about to drop the column `like` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "like";

-- CreateTable
CREATE TABLE "Like" (
    "id" SERIAL NOT NULL,
    "likeId" INTEGER NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_likeId_fkey" FOREIGN KEY ("likeId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
