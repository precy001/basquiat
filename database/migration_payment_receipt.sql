-- BASQUIAT order payment proof migration
-- Run once against the same database used by config/database.php.
ALTER TABLE orders
  ADD COLUMN payment_receipt VARCHAR(500) NULL AFTER order_note;
