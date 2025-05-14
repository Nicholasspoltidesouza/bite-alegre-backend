-- CreateEnum
CREATE TYPE "Weekday" AS ENUM ('MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN');

-- CreateTable
CREATE TABLE "OpeningHour" (
    "id" TEXT NOT NULL,
    "periodId" TEXT NOT NULL,
    "weekday" "Weekday" NOT NULL,
    "opensAt" TIME NOT NULL,
    "closesAt" TIME NOT NULL,
    "restaurantId" TEXT NOT NULL,

    CONSTRAINT "OpeningHour_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OpeningHour_restaurantId_weekday_idx" ON "OpeningHour"("restaurantId", "weekday");

-- CreateIndex
CREATE INDEX "OpeningHour_restaurantId_periodId_idx" ON "OpeningHour"("restaurantId", "periodId");

-- AddForeignKey
ALTER TABLE "OpeningHour" ADD CONSTRAINT "OpeningHour_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
