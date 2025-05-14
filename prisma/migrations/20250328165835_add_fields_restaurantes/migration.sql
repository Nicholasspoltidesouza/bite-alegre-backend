/*
  Warnings:

  - The primary key for the `Restaurant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `averagePrice` on the `Restaurant` table. All the data in the column will be lost.
  - You are about to drop the column `bannerPhoto` on the `Restaurant` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Restaurant` table. All the data in the column will be lost.
  - You are about to drop the column `profilePhoto` on the `Restaurant` table. All the data in the column will be lost.
  - The `id` column on the `Restaurant` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `name` on the `Restaurant` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `address` on the `Restaurant` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `email` on the `Restaurant` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `password` on the `Restaurant` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - A unique constraint covering the columns `[email]` on the table `Restaurant` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Restaurant" DROP CONSTRAINT "Restaurant_pkey",
DROP COLUMN "averagePrice",
DROP COLUMN "bannerPhoto",
DROP COLUMN "createdAt",
DROP COLUMN "profilePhoto",
ADD COLUMN     "average_price" DECIMAL(10,2),
ADD COLUMN     "banner_photo" TEXT,
ADD COLUMN     "profile_photo" TEXT,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "address" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(255),
ADD CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_email_key" ON "Restaurant"("email");
