/*
  Warnings:

  - A unique constraint covering the columns `[user_id,tag_id]` on the table `User_Preferences` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_Preferences_user_id_tag_id_key" ON "User_Preferences"("user_id", "tag_id");
