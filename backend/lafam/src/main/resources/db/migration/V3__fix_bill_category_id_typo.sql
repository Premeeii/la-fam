ALTER TABLE bills
    RENAME COLUMN bill_catergory_id TO bill_category_id;

ALTER TABLE bills
    RENAME CONSTRAINT fk_bills_bill_catergory_id TO fk_bills_bill_category_id;
