# Estructura de la Base de Datos (SH Automotores)

Este documento detalla los modelos y tablas creadas mediante Sequelize en PostgreSQL para el backend del proyecto.

---

## 1. Tabla: `users`
Almacena todos los usuarios del sistema, incluyendo vendedores y administradores.
- **id**: UUID (Primary Key)
- **full_name**: String, no nulo
- **email**: String, único, no nulo
- **password_hash**: String, no nulo
- **role**: ENUM ('super_admin', 'seller'), por defecto: 'seller'
- **phone**: String, opcional
- **status**: ENUM ('active', 'inactive'), por defecto: 'active'
- **createdAt / updatedAt**: Automáticos.

## 2. Tabla: `vehicles`
Almacena el catálogo de vehículos publicados o en borrador.
- **id**: UUID (Primary Key)
- **user_id**: UUID (Foreign Key -> `users.id`), no nulo (quién lo publicó)
- **brand**: String, no nulo
- **model**: String, no nulo
- **year**: Integer, no nulo
- **price**: Decimal(12, 2), no nulo
- **currency**: ENUM ('USD', 'ARS'), por defecto: 'USD'
- **mileage**: Integer, no nulo
- **condition**: ENUM ('new', 'used'), por defecto: 'used'
- **category**: String, opcional (SUV, Sedan, etc.)
- **description**: Text, opcional
- **status**: ENUM ('draft', 'pending_approval', 'published', 'reserved', 'sold', 'hidden', 'rejected'), por defecto: 'draft'
- **views**: Integer, por defecto: 0
- **admin_notes**: Text, opcional
- **sale_type**: String, por defecto: 'direct'
- **pricing_details**: JSONB, por defecto: {}
- **promotional_text**: String, opcional
- **createdAt / updatedAt**: Automáticos.

## 3. Tabla: `vehicle_images`
Almacena la relación de imágenes asociadas a cada vehículo.
- **id**: UUID (Primary Key)
- **vehicle_id**: UUID (Foreign Key -> `vehicles.id` con eliminación en cascada), no nulo
- **url**: String, no nulo
- **is_main**: Boolean, por defecto: falso
- **order**: Integer, por defecto: 0

## 4. Tabla: `clientes`
Registro de posibles compradores/clientes ingresados por los vendedores.
- **id**: UUID (Primary Key)
- **user_id**: UUID (Foreign Key -> `users.id`), opcional/asociable
- **nombre**: String, no nulo
- **apellido**: String, no nulo
- **telefono**: String, opcional
- **descripcion**: Text, opcional
- **estado_interes**: ENUM ('Interesado 0km', 'Interesado Usado', 'Entrega Vehículo', 'Entrega Dinero'), no nulo
- **created_at / updated_at**: Automáticos.

## 5. Tabla: `registros`
Almacena distintas gestiones o eventos puntuales vinculando un vendedor con un vehículo (ej. visitas, citas o revisiones).
- **id**: UUID (Primary Key)
- **vendedor_id**: UUID (Foreign Key -> `users.id`), no nulo
- **vehiculo_id**: UUID (Foreign Key -> `vehicles.id`), no nulo
- **titulo**: String, no nulo
- **descripcion**: Text, opcional
- **estado**: ENUM ('Abierto', 'Pendiente', 'Cerrado'), por defecto: 'Abierto'
- **created_at / updated_at**: Automáticos.

## 6. Tabla: `leads`
Prospectos o intenciones de de contacto generados públicamente (ej: un click en WhatsApp).
- **id**: UUID (Primary Key)
- **vehicle_id**: UUID (Foreign Key -> `vehicles.id`), opcional
- **name**: String, no nulo
- **phone**: String, opcional
- **message**: Text, opcional
- **source**: String, por defecto: 'whatsapp_click'
- **status**: ENUM ('new', 'contacted', 'closed', 'lost'), por defecto: 'new'
- **createdAt / updatedAt**: Automáticos.

## 7. Tabla: `activity_logs`
Bitácora del sistema y de acciones de usuario a modo de auditoría.
- **id**: UUID (Primary Key)
- **user_id**: UUID (Foreign Key -> `users.id`), opcional
- **action**: String, no nulo
- **entity_type**: String, opcional
- **entity_id**: UUID, opcional
- **details**: JSONB, opcional
- **createdAt / updatedAt**: Automáticos.

## 8. Tabla: `VehicleViews`
Registro simple para métricas de interacciones y vistas por vehículo en el tiempo.
- **id**: UUID (Primary Key)
- **vehicle_id**: UUID, no nulo
- **viewed_at**: Date, por defecto: fecha y hora actual

---

### Relaciones principales:
*   Un **Usuario** (Vendedor/Admin) tiene múltiples **Vehículos** (1:N).
*   Un **Usuario** tiene múltiples **Clientes** y **Registros** (1:N).
*   Un **Vehículo** tiene múltiples **Imágenes** (1:N).
*   Un **Vehículo** tiene múltiples **Registros** asociados (1:N).
*   Un **Vehículo** puede generar múltiples **Leads** de consulta (1:N).
