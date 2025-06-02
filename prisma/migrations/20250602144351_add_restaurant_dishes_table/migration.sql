-- CreateTable
CREATE TABLE "RestaurantDish" (
    "id" TEXT NOT NULL,
    "restaurant_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dish_price" DECIMAL(65,30) NOT NULL,
    "dish_photo" TEXT NOT NULL,
    "main_dish" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT NOT NULL,

    CONSTRAINT "RestaurantDish_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RestaurantDish" ADD CONSTRAINT "RestaurantDish_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
