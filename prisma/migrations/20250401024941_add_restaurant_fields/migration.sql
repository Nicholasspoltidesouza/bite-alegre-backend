/*
  Warnings:

  - The primary key for the `Restaurant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `banner_photo` on the `Restaurant` table. All the data in the column will be lost.
  - You are about to drop the column `profile_photo` on the `Restaurant` table. All the data in the column will be lost.
  - Added the required column `phone` to the `Restaurant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Restaurant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Restaurant" DROP CONSTRAINT "Restaurant_pkey",
DROP COLUMN "banner_photo",
DROP COLUMN "profile_photo",
ADD COLUMN     "bannerPhoto" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "phone" VARCHAR(20) NOT NULL,
ADD COLUMN     "profilePhoto" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "RestaurantTag" (
    "restaurantId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "RestaurantTag_pkey" PRIMARY KEY ("restaurantId","tagId")
);

-- AddForeignKey
ALTER TABLE "RestaurantTag" ADD CONSTRAINT "RestaurantTag_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantTag" ADD CONSTRAINT "RestaurantTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
