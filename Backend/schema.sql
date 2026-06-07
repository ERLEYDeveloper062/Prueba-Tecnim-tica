-- =============================================================
-- SCHEMA — Sistema de Monitoreo Industrial
-- =============================================================

-- Tabla sensores
CREATE TABLE sensores (
    sensor_id        SERIAL PRIMARY KEY,
    nombre           VARCHAR(100) NOT NULL,
    tipo             VARCHAR(20)  NOT NULL,
    fabricante       VARCHAR(100),
    fecha_fabricacion DATE,
    fecha_creacion   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla zonas
CREATE TABLE zonas (
    zona_id          SERIAL PRIMARY KEY,
    nombre           VARCHAR(100) NOT NULL,
    descripcion      VARCHAR(500),
    ubicacion        VARCHAR(200),
    estado_operativo VARCHAR(20),
    fecha_creacion   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla monitoreos
CREATE TABLE monitoreos (
    monitoreo_id     SERIAL PRIMARY KEY,
    sensor_id        INTEGER NOT NULL REFERENCES sensores(sensor_id),
    zona_id          INTEGER NOT NULL REFERENCES zonas(zona_id),
    fecha_instalacion DATE    NOT NULL,
    tipo_lectura     VARCHAR(20),
    valor_umbral     FLOAT   NOT NULL,
    estado           VARCHAR(10) DEFAULT 'ACTIVO',
    fecha_creacion   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Restricciones de dominio
ALTER TABLE sensores
    ADD CONSTRAINT ck_sensor_tipo
    CHECK (tipo IN ('temperatura', 'presion', 'vibracion', 'flujo'));

ALTER TABLE zonas
    ADD CONSTRAINT ck_zona_estado
    CHECK (estado_operativo IN ('activo', 'inactivo', 'mantenimiento'));

ALTER TABLE monitoreos
    ADD CONSTRAINT ck_monitoreo_tipo
    CHECK (tipo_lectura IN ('temperatura', 'presion', 'vibracion', 'flujo'));

ALTER TABLE monitoreos
    ADD CONSTRAINT ck_monitoreo_estado
    CHECK (estado IN ('ACTIVO', 'PAUSADO'));


-- =============================================================
-- DATOS DE PRUEBA
-- =============================================================

-- Sensores (6 registros)
INSERT INTO sensores (nombre, tipo, fabricante, fecha_fabricacion) VALUES
    ('ST-101 Temperatura Alta',  'temperatura', 'Siemens',        '2021-03-15'),
    ('SP-202 Presión Línea A',   'presion',     'Honeywell',      '2020-08-22'),
    ('SV-303 Vibración Motor 1', 'vibracion',   'ABB',            '2022-01-10'),
    ('SF-404 Flujo Principal',   'flujo',       'Endress+Hauser', '2019-11-05'),
    ('ST-105 Temperatura Baja',  'temperatura', 'Siemens',        '2023-06-30'),
    ('SP-206 Presión Línea B',   'presion',     'Yokogawa',       '2021-09-18');

-- Zonas (5 registros)
INSERT INTO zonas (nombre, descripcion, ubicacion, estado_operativo) VALUES
    ('Zona Caldera Principal',  'Área de caldera de vapor industrial',     'Edificio A — Piso 1',  'activo'),
    ('Zona Compresores',        'Sala de compresores de aire a presión',   'Edificio B — Piso 1',  'activo'),
    ('Zona Motores Eléctricos', 'Motores de bombas y ventiladores',        'Edificio A — Piso 2',  'activo'),
    ('Zona Almacenamiento',     'Tanques de almacenamiento de químicos',   'Exterior — Sector 3',  'mantenimiento'),
    ('Zona Distribución',       'Red de tuberías y válvulas de paso',      'Edificio C — Piso 1',  'inactivo');

-- Monitoreos (8 registros)
INSERT INTO monitoreos (sensor_id, zona_id, fecha_instalacion, tipo_lectura, valor_umbral, estado) VALUES
    (1, 1, '2023-01-10', 'temperatura', 85.0,  'ACTIVO'),
    (2, 2, '2023-01-15', 'presion',     120.5, 'ACTIVO'),
    (3, 3, '2023-02-01', 'vibracion',   4.5,   'ACTIVO'),
    (4, 1, '2023-02-20', 'flujo',       200.0, 'ACTIVO'),
    (5, 4, '2023-03-05', 'temperatura', 60.0,  'PAUSADO'),
    (6, 2, '2023-03-18', 'presion',     95.0,  'ACTIVO'),
    (1, 3, '2023-04-10', 'temperatura', 75.0,  'PAUSADO'),
    (4, 5, '2023-05-22', 'flujo',       150.0, 'ACTIVO');
