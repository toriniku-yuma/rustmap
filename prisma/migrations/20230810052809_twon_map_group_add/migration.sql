/*
  Warnings:

  - Added the required column `group` to the `TownMap2308` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TownMap2308" ADD COLUMN     "group" TEXT NOT NULL;
