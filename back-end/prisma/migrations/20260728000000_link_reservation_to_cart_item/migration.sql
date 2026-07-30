-- AlterTable
ALTER TABLE "inventory_reservation" ADD COLUMN     "cart_item_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "inventory_reservation_cart_item_id_key" ON "inventory_reservation"("cart_item_id");

-- AddForeignKey
ALTER TABLE "inventory_reservation" ADD CONSTRAINT "inventory_reservation_cart_item_id_fkey" FOREIGN KEY ("cart_item_id") REFERENCES "cart_item"("id") ON DELETE SET NULL ON UPDATE CASCADE;