-- DropForeignKey
ALTER TABLE "RestaurantTag" DROP CONSTRAINT "RestaurantTag_restaurantId_fkey";

-- DropForeignKey
ALTER TABLE "RestaurantTag" DROP CONSTRAINT "RestaurantTag_tagId_fkey";

-- AddForeignKey
ALTER TABLE "RestaurantTag" ADD CONSTRAINT "RestaurantTag_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantTag" ADD CONSTRAINT "RestaurantTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
