
INSERT INTO city (name) VALUES ('Colombo'), ('Kandy'), ('Galle'), ('Negombo');
INSERT INTO country (name) VALUES ('Sri Lanka'), ('India'), ('United Kingdom'), ('USA');


INSERT INTO customer (name, dob, nic) VALUES ('Omindu Kumara', '1985-05-15', '198512345V');
INSERT INTO customer (name, dob, nic) VALUES ('Ravindu Sachintha', '1988-10-20', '198854321V');
INSERT INTO customer (name, dob, nic) VALUES ('Yevin Shane', '1990-01-01', '199000123V');


INSERT INTO customer_mobile (mobile, customer_id) VALUES ('0771234567', 1), ('0719876543', 1);
INSERT INTO customer_mobile (mobile, customer_id) VALUES ('0775556667', 2);
INSERT INTO customer_mobile (mobile, customer_id) VALUES ('0780001112', 3);


INSERT INTO address (line1, line2, city_id, country_id, customer_id) 
VALUES ('No 489, Flower Road', 'First Floor', 1, 1, 1);
INSERT INTO address (line1, line2, city_id, country_id, customer_id) 
VALUES ('No 555, Park Street', NULL, 1, 1, 2);

INSERT INTO family_relation (customer_id, family_member_id) VALUES (1, 2);
INSERT INTO family_relation (customer_id, family_member_id) VALUES (2, 1);
