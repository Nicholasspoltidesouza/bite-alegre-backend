/*
  Warnings:

  - You are about to drop the column `restaurantId` on the `Checkin` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Checkin` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Checkin" DROP CONSTRAINT "Checkin_restaurantId_fkey";

-- DropForeignKey
ALTER TABLE "Checkin" DROP CONSTRAINT "Checkin_userId_fkey";

-- AlterTable
ALTER TABLE "Checkin" DROP COLUMN "restaurantId",
DROP COLUMN "userId";

-- AddForeignKey
ALTER TABLE "Checkin" ADD CONSTRAINT "Checkin_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checkin" ADD CONSTRAINT "Checkin_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
