-- DropForeignKey
ALTER TABLE "Checkin" DROP CONSTRAINT "Checkin_restaurant_id_fkey";

-- DropForeignKey
ALTER TABLE "Checkin" DROP CONSTRAINT "Checkin_user_id_fkey";

-- AlterTable
ALTER TABLE "Checkin" ADD COLUMN     "restaurantId" TEXT,
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "feedback" DROP NOT NULL,
ALTER COLUMN "stars" SET DATA TYPE DECIMAL(65,30);

-- AddForeignKey
ALTER TABLE "Checkin" ADD CONSTRAINT "Checkin_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checkin" ADD CONSTRAINT "Checkin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
