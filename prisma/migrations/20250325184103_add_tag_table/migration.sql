-- CreateEnum
CREATE TYPE "TagType" AS ENUM ('LOCAL', 'CATEGORIA', 'OCASIAO');

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "type" "TagType" NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);
