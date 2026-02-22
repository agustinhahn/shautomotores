-- backend/migrations/registros_clientes.sql
-- Run this script in PostgreSQL to create the new tables.

CREATE TABLE IF NOT EXISTS registros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendedor_id UUID NOT NULL,
    vehiculo_id UUID NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    estado VARCHAR(50) NOT NULL DEFAULT 'Abierto' CHECK (estado IN ('Abierto', 'Pendiente', 'Cerrado')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_vendedor FOREIGN KEY (vendedor_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_vehiculo FOREIGN KEY (vehiculo_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    telefono VARCHAR(50),
    descripcion TEXT,
    estado_interes VARCHAR(50) NOT NULL CHECK (estado_interes IN ('Interesado 0km', 'Interesado Usado', 'Entrega Vehículo', 'Entrega Dinero')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
