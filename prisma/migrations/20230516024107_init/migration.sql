/*
  Warnings:

  - You are about to drop the `Like` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `address` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_likeId_fkey";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "like" TEXT[];

-- DropTable
DROP TABLE "Like";
