USE ElectraTrace;

INSERT INTO PROJECTS (Project_Name, Description, Total_Est_Budget) VALUES
('Smart Home Hub', 'A central hub for IoT devices', 15000.00),
('Drone Controller', 'Custom remote control with telemetry', 25000.00);

INSERT INTO BOM (Proj_ID, BOM_Name) VALUES
(1, 'Power Supply Module'),
(1, 'Main Processing Board'),
(2, 'RF Communications');

INSERT INTO COMPONENTS (MPN, Description, Category, Datasheet_URL) VALUES
('ESP32-S3-WROOM-1', 'Wi-Fi/BT MCU Module', 'Microcontroller', 'https://espressif.com/datasheet'),
('LM317T', 'Voltage Regulator', 'Power Management', 'https://ti.com/ds'),
('10uF 16V', 'Ceramic Capacitor 0805', 'Passive', 'https://example.com/cap_ds'),
('10k Ohm', 'Resistor 0603 1%', 'Passive', 'https://example.com/res_ds'),
('NRF24L01+', '2.4GHz RF Transceiver', 'RF', 'https://nordicsemi.com/ds');

INSERT INTO BOM_ITEMS (BOM_ID, Comp_ID, Quantity_Required, Status) VALUES
(1, 2, 2, 'Pending'),
(1, 3, 4, 'Ordered'),
(2, 1, 1, 'In Stock'),
(3, 5, 2, 'Pending');

-- Adding a child component (e.g. decoupling cap for the ESP32)
INSERT INTO BOM_ITEMS (BOM_ID, Comp_ID, parent_BOM_ItemID, Quantity_Required, Status) VALUES
(2, 4, 3, 2, 'Pending');

INSERT INTO FOOTPRINTS (Comp_ID, Package_Type, Footprint_Name, CAD_Link, Model_3D_Link) VALUES
(1, 'Module', 'ESP32-WROOM', 'cad.com/esp32', '3d.com/esp32'),
(2, 'TO-220', 'TO220-3', 'cad.com/to220', '3d.com/to220'),
(3, '0805', 'CAPC2012X130N', 'cad.com/0805cap', '3d.com/0805cap');

INSERT INTO VENDORS_IN (Vendor_Name, Location_City, GSTIN, Contact_Info, Website) VALUES
('Robu.in', 'Pune', '27AABCR1234F1Z5', 'info@robu.in', 'https://robu.in'),
('ElectronicsComp', 'Delhi', '07AAECC7890H1Z2', 'sales@electronicscomp.com', 'https://electronicscomp.com');

INSERT INTO LISTINGS (Comp_ID, Vendor_ID, Price_INR, Stock_Qty, Purchase_URL) VALUES
(1, 1, 350.00, 500, 'https://robu.in/esp32'),
(2, 2, 15.50, 2000, 'https://electronicscomp.com/lm317'),
(3, 1, 2.00, 10000, 'https://robu.in/10uf_cap'),
(5, 2, 120.00, 300, 'https://electronicscomp.com/nrf24l01');
