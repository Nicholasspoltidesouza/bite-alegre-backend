-- CreateTable
CREATE TABLE "User_Preferences" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,
    "weight" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "User_Preferences_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User_Preferences" ADD CONSTRAINT "User_Preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Preferences" ADD CONSTRAINT "User_Preferences_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
