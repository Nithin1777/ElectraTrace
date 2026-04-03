USE ElectraTrace;

INSERT INTO PROJECTS (Project_Name, Description, Total_Est_Budget, Lead_Name, Due_Date, Version_Tag, Status) VALUES
('Smart Home Hub', 'A central hub for IoT devices', 15000.00, 'Alex Chen', '2026-11-15', 'v1.2.0', 'Active'),
('Drone Controller', 'Custom remote control with telemetry', 25000.00, 'Priya Nair', '2026-12-20', 'v0.9.5', 'Planning');

INSERT INTO BOM (Proj_ID, BOM_Name) VALUES
(1, 'Power Supply Module'),
(1, 'Main Processing Board'),
(2, 'RF Communications');

INSERT INTO COMPONENTS (MPN, Description, Category, Datasheet_URL) VALUES
('ESP32-S3-WROOM-1', 'Wi-Fi/BT MCU Module', 'Microcontroller', 'https://espressif.com/datasheet'),
('LM317T', 'Voltage Regulator', 'Power Management', 'https://ti.com/ds'),
('10uF 16V', 'Ceramic Capacitor 0805', 'Passive', 'https://example.com/cap_ds'),
('10k Ohm', 'Resistor 0603 1%', 'Passive', 'https://example.com/res_ds'),
('NRF24L01+', '2.4GHz RF Transceiver', 'RF', 'https://nordicsemi.com/ds'),
('ESP32 DevKit V1', 'ESP32 development board with Wi-Fi/BLE', 'Microcontroller & Dev Board', 'https://robu.in/product/esp32-devkit-v1-development-board/'),
('ESP32-CAM', 'ESP32 camera module with OV2640', 'Microcontroller & Dev Board', 'https://www.flyrobo.in/esp32-cam-wifi-bluetooth-camera-module-development-board-ov2640'),
('Arduino Uno R3', 'ATmega328P development board (CH340G)', 'Microcontroller & Dev Board', 'https://robu.in/product/uno-r3-ch340g-atmega328p-development-board-compatible-with-arduino/'),
('Arduino Nano', 'ATmega328P Nano development board', 'Microcontroller & Dev Board', 'https://www.flyrobo.in/arduino-nano-v3.0-ch340-chip'),
('Raspberry Pi Pico', 'RP2040 dual-core MCU board', 'Microcontroller & Dev Board', 'https://robu.in/product/raspberry-pi-pico/'),
('HC-SR04', 'Ultrasonic distance sensor with bracket', 'Sensor', 'https://www.flyrobo.in/ultrasonic-sensor-hc-sr04-with-mounting-bracket'),
('MPU6050', '6-axis accelerometer/gyro module', 'Sensor', 'https://robu.in/product/mpu6050-6-axis-gyro-accelerometer-sensor-module-with-3-3v-5v-compatible/'),
('HC-SR501', 'PIR motion sensor module', 'Sensor', 'https://www.flyrobo.in/hc-sr501-pir-motion-sensor-module'),
('DHT22', 'Digital temperature & humidity sensor', 'Sensor', 'https://robu.in/product/dht22-digital-temperature-humidity-sensor-module/'),
('IR Obstacle Sensor', 'IR obstacle detection module', 'Sensor', 'https://robotkits.co.in/product/ir-sensor/'),
('L298N Motor Driver', 'Dual H-bridge motor driver module', 'Motor & Driver', 'https://www.flyrobo.in/l298n_motor_driver_module_for_arduino'),
('SG90 Micro Servo', '9g micro servo motor', 'Motor & Driver', 'https://robu.in/product/towerpro-sg90-9g-mini-servo-90-degree-rotation/'),
('MG996R Servo', 'High torque metal gear servo motor', 'Motor & Driver', 'https://www.flyrobo.in/mg996r-metal-gear-high-torque-servo-motor'),
('NEMA 17 Stepper Motor', '1.7kg-cm stepper motor', 'Motor & Driver', 'https://robu.in/product/nema17-1-7kg-cm-stepper-motor/'),
('A4988 Stepper Driver', 'Stepper driver module with heat sink', 'Motor & Driver', 'https://www.flyrobo.in/a4988-stepper-motor-driver-module-with-heat-sink'),
('TP4056 Charger Module', '1A Li-ion charger with protection', 'Power & Connectivity', 'https://robu.in/product/tp4056-1a-li-ion-lithium-battery-charging-module-with-current-protection/'),
('LM2596 Buck Converter', 'Adjustable DC-DC step-down module', 'Power & Connectivity', 'https://www.flyrobo.in/lm2596-step-down-module-dc-dc-adjustable-voltage-regulator-power-supply'),
('MB102 Power Module', 'Breadboard power supply module', 'Power & Connectivity', 'https://www.flyrobo.in/breadboard-power-supply-module-3.3v-5v'),
('Jumper Wire Set', '65pcs breadboard jumper cable set', 'Power & Connectivity', 'https://robu.in/product/65pcs-breadboard-jumper-cable-wire-set/'),
('4WD Robot Chassis', '4 wheel robot chassis kit', 'Mechanical', 'https://robotkits.co.in/product/4-wheel-robot-chassis/'),
('Mecanum Wheels 60mm', '60mm mecanum wheels (4 pcs)', 'Mechanical', 'https://robotkits.co.in/product/60mm-mecanum-wheels-4-pcs/'),
('7.4V Li-ion Battery', '2200mAh 2S Li-ion battery pack', 'Mechanical', 'https://robotkits.co.in/product/7-4v-2200mah-li-ion-battery/');

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
(3, '0805', 'CAPC2012X130N', 'cad.com/0805cap', '3d.com/0805cap'),
(6, 'Dev Board', 'ESP32-DevKit-V1', 'https://robu.in/product/esp32-devkit-v1-development-board/', NULL),
(7, 'Module', 'ESP32-CAM', 'https://www.flyrobo.in/esp32-cam-wifi-bluetooth-camera-module-development-board-ov2640', NULL),
(8, 'Dev Board', 'Arduino-Uno-R3', 'https://robu.in/product/uno-r3-ch340g-atmega328p-development-board-compatible-with-arduino/', NULL),
(9, 'Dev Board', 'Arduino-Nano', 'https://www.flyrobo.in/arduino-nano-v3.0-ch340-chip', NULL),
(10, 'Dev Board', 'Raspberry-Pi-Pico', 'https://robu.in/product/raspberry-pi-pico/', NULL),
(11, 'Sensor Module', 'HC-SR04', 'https://www.flyrobo.in/ultrasonic-sensor-hc-sr04-with-mounting-bracket', NULL),
(12, 'Sensor Module', 'MPU6050', 'https://robu.in/product/mpu6050-6-axis-gyro-accelerometer-sensor-module-with-3-3v-5v-compatible/', NULL),
(13, 'Sensor Module', 'HC-SR501', 'https://www.flyrobo.in/hc-sr501-pir-motion-sensor-module', NULL),
(14, 'Sensor Module', 'DHT22', 'https://robu.in/product/dht22-digital-temperature-humidity-sensor-module/', NULL),
(15, 'Sensor Module', 'IR-Obstacle', 'https://robotkits.co.in/product/ir-sensor/', NULL),
(16, 'Driver Module', 'L298N', 'https://www.flyrobo.in/l298n_motor_driver_module_for_arduino', NULL),
(17, 'Servo', 'SG90', 'https://robu.in/product/towerpro-sg90-9g-mini-servo-90-degree-rotation/', NULL),
(18, 'Servo', 'MG996R', 'https://www.flyrobo.in/mg996r-metal-gear-high-torque-servo-motor', NULL),
(19, 'Stepper', 'NEMA17', 'https://robu.in/product/nema17-1-7kg-cm-stepper-motor/', NULL),
(20, 'Driver Module', 'A4988', 'https://www.flyrobo.in/a4988-stepper-motor-driver-module-with-heat-sink', NULL),
(21, 'Power Module', 'TP4056', 'https://robu.in/product/tp4056-1a-li-ion-lithium-battery-charging-module-with-current-protection/', NULL),
(22, 'Power Module', 'LM2596', 'https://www.flyrobo.in/lm2596-step-down-module-dc-dc-adjustable-voltage-regulator-power-supply', NULL),
(23, 'Power Module', 'MB102', 'https://www.flyrobo.in/breadboard-power-supply-module-3.3v-5v', NULL),
(24, 'Accessory', 'Jumper-Wires', 'https://robu.in/product/65pcs-breadboard-jumper-cable-wire-set/', NULL),
(25, 'Mechanical', '4WD-Chassis', 'https://robotkits.co.in/product/4-wheel-robot-chassis/', NULL),
(26, 'Mechanical', 'Mecanum-Wheels-60mm', 'https://robotkits.co.in/product/60mm-mecanum-wheels-4-pcs/', NULL),
(27, 'Battery Pack', '7.4V-LiIon-2200mAh', 'https://robotkits.co.in/product/7-4v-2200mah-li-ion-battery/', NULL);

INSERT INTO VENDORS_IN (Vendor_Name, Location_City, GSTIN, Contact_Info, Website) VALUES
('Robu.in', 'Pune', '27AABCR1234F1Z5', 'info@robu.in', 'https://robu.in'),
('ElectronicsComp', 'Delhi', '07AAECC7890H1Z2', 'sales@electronicscomp.com', 'https://electronicscomp.com'),
('FlyRobo', 'Online', '27AABCF9999F1Z9', 'support@flyrobo.in', 'https://www.flyrobo.in'),
('RobotKits', 'Online', '29AABCR8888H1Z3', 'support@robotkits.co.in', 'https://robotkits.co.in');

INSERT INTO LISTINGS (Comp_ID, Vendor_ID, Price_INR, Stock_Qty, Purchase_URL) VALUES
(1, 1, 350.00, 500, 'https://robu.in/esp32'),
(2, 2, 15.50, 2000, 'https://electronicscomp.com/lm317'),
(3, 1, 2.00, 10000, 'https://robu.in/10uf_cap'),
(5, 2, 120.00, 300, 'https://electronicscomp.com/nrf24l01'),
(6, 1, 399.00, 120, 'https://robu.in/product/esp32-devkit-v1-development-board/'),
(7, 3, 299.00, 90, 'https://www.flyrobo.in/esp32-cam-wifi-bluetooth-camera-module-development-board-ov2640'),
(8, 1, 449.00, 150, 'https://robu.in/product/uno-r3-ch340g-atmega328p-development-board-compatible-with-arduino/'),
(9, 3, 299.00, 200, 'https://www.flyrobo.in/arduino-nano-v3.0-ch340-chip'),
(10, 1, 399.00, 140, 'https://robu.in/product/raspberry-pi-pico/'),
(11, 3, 89.00, 300, 'https://www.flyrobo.in/ultrasonic-sensor-hc-sr04-with-mounting-bracket'),
(12, 1, 159.00, 180, 'https://robu.in/product/mpu6050-6-axis-gyro-accelerometer-sensor-module-with-3-3v-5v-compatible/'),
(13, 3, 99.00, 220, 'https://www.flyrobo.in/hc-sr501-pir-motion-sensor-module'),
(14, 1, 249.00, 160, 'https://robu.in/product/dht22-digital-temperature-humidity-sensor-module/'),
(15, 4, 69.00, 260, 'https://robotkits.co.in/product/ir-sensor/'),
(16, 3, 179.00, 130, 'https://www.flyrobo.in/l298n_motor_driver_module_for_arduino'),
(17, 1, 129.00, 240, 'https://robu.in/product/towerpro-sg90-9g-mini-servo-90-degree-rotation/'),
(18, 3, 549.00, 110, 'https://www.flyrobo.in/mg996r-metal-gear-high-torque-servo-motor'),
(19, 1, 799.00, 75, 'https://robu.in/product/nema17-1-7kg-cm-stepper-motor/'),
(20, 3, 129.00, 190, 'https://www.flyrobo.in/a4988-stepper-motor-driver-module-with-heat-sink'),
(21, 1, 39.00, 400, 'https://robu.in/product/tp4056-1a-li-ion-lithium-battery-charging-module-with-current-protection/'),
(22, 3, 79.00, 320, 'https://www.flyrobo.in/lm2596-step-down-module-dc-dc-adjustable-voltage-regulator-power-supply'),
(23, 3, 59.00, 280, 'https://www.flyrobo.in/breadboard-power-supply-module-3.3v-5v'),
(24, 1, 79.00, 500, 'https://robu.in/product/65pcs-breadboard-jumper-cable-wire-set/'),
(25, 4, 599.00, 60, 'https://robotkits.co.in/product/4-wheel-robot-chassis/'),
(26, 4, 1299.00, 40, 'https://robotkits.co.in/product/60mm-mecanum-wheels-4-pcs/'),
(27, 4, 899.00, 55, 'https://robotkits.co.in/product/7-4v-2200mah-li-ion-battery/');
