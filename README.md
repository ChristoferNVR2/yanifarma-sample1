# 🏥 Yanifarma - Sistema de Gestión de Farmacia

Sistema completo de gestión para farmacias con FastAPI, React y MySQL.

## 🚀 Quick Start

### 1. Start Docker Containers

```bash
docker-compose up -d
```

This starts:
- **MySQL Database** (port 3306)
- **FastAPI Backend** (port 8000)
- **React Frontend** (port 5173)

### 2. Initialize Database

Wait a few seconds for the database to be ready, then:

```bash
docker exec backend uv run python init_database.py
```

This will:
- ✓ Create all 27 tables
- ✓ Populate 100+ sample records
- ✓ Verify data was loaded correctly


### 3. Access the API

Open in your browser:
- **Interactive API Docs**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc

---

## 📊 Database

**27 Tables** organized in Third Normal Form (3NF):

| Category | Tables |
|----------|--------|
| **User Management** | rol, usuario, usuario_rol |
| **Customer Management** | cliente, cliente_telefono |
| **Supplier Management** | proveedor, contacto_proveedor, cargo |
| **Product Catalog** | producto, categoria, presentacion, componente, + junction tables |
| **Inventory** | inventario, lote, ubicacion_estante |
| **Purchasing** | pedido, detalle_pedido, compra, estado_pedido, motivo_pedido |
| **Sales** | venta, detalle_venta, pago, metodo_pago, comprobante |

## 🔌 API Endpoints (60+)

### Main Endpoints

| Resource | Endpoints |
|----------|-----------|
| **Usuarios** | `GET, POST, PUT, DELETE /api/usuarios/` |
| **Clientes** | `GET, POST, PUT, DELETE /api/clientes/` |
| **Proveedores** | `GET, POST, PUT, DELETE /api/proveedores/` |
| **Productos** | `GET, POST, PUT, DELETE /api/productos/` |
| **Inventario** | `GET, POST, PATCH /api/inventario/` |
| **Pedidos** | `GET, POST, PATCH /api/pedidos/` |
| **Ventas** | `GET, POST /api/ventas/` |

**See full API documentation**: http://localhost:8000/docs

## 🧪 Manual Testing

### Test with curl

```bash
# Get all users
curl http://localhost:8000/api/usuarios/

# Get all products
curl http://localhost:8000/api/productos/

# Search products
curl "http://localhost:8000/api/productos/search/?q=Paracetamol"

# Get all sales
curl http://localhost:8000/api/ventas/

# Get specific user
curl http://localhost:8000/api/usuarios/1005
```

### Create Operations

```bash
# Create a new customer
curl -X POST http://localhost:8000/api/clientes/ \
  -H "Content-Type: application/json" \
  -d '{
    "nro_doc": "12345678",
    "tipo_doc": "DNI",
    "nombres": "Juan",
    "apellido_paterno": "Pérez",
    "apellido_materno": "García",
    "correo": "juan@email.com",
    "telefonos": ["987654321"]
  }'

# Create a sale
curl -X POST http://localhost:8000/api/ventas/ \
  -H "Content-Type: application/json" \
  -d '{
    "id_cliente": 10009,
    "detalles": [
      {
        "id_producto": 4001,
        "cantidad": 2,
        "precio_unitario_venta": 3.50
      }
    ],
    "id_metodo_pago": 800001,
    "tipo_comprobante": "Boleta",
    "nro_comprobante": "B001-999999"
  }'
```

## 🔧 Development

### View Logs

```bash
# Backend logs
docker logs backend -f

# Database logs
docker logs fa-db -f

# All services
docker-compose logs -f
```

### Access Containers

```bash
# Backend shell
docker exec -it backend bash

# MySQL shell
docker exec -it fa-db mysql -u root -p123456 test
```

### Container Management

```bash
# Stop containers
docker-compose down

# Restart containers
docker-compose restart

# Rebuild backend
docker-compose up --build -d backend

# View container status
docker-compose ps
```

### Database Access

```bash
# Access MySQL CLI
docker exec -it fa-db mysql -u root -p123456 test

# Inside MySQL:
SHOW TABLES;
SELECT * FROM usuario;
SELECT * FROM producto;
SELECT * FROM venta;
```

## 📝 Sample Data

After running `init_database.py`, you'll have:

- **2 Users**: jackyfarma (admin), malca (empleado)
- **3 Customers**: With contact information
- **2 Suppliers**: With company contacts
- **4 Products**: Paracetamol, Amoxicilina, Ibuprofeno, Loratadina
- **4 Inventory Batches**: With expiration dates and locations
- **2 Purchase Orders**: One completed, one in progress
- **3 Sales Transactions**: With payments and receipts

## 🔄 Reset Database

If you need to start fresh:

```bash
# Stop containers
docker-compose down

# Remove database volume (WARNING: deletes all data!)
docker volume rm yanifarma-sample1_mysql_data

# Start containers again
docker-compose up -d

# Wait for database to be ready (5-10 seconds)
sleep 10

# Reinitialize
docker exec backend uv run python init_database.py
```

## 🐛 Troubleshooting

### Containers won't start

```bash
# Check status
docker-compose ps

# View logs
docker-compose logs backend
docker-compose logs fa-db

# Restart
docker-compose restart
```

### Database connection issues

Verify `.env` configuration:
```
DB_HOST=database    # Must be 'database' (container name), not 'localhost'
DB_NAME=test
DB_USER=root
DB_PASSWORD=123456
```

### API returns errors

```bash
# Check if database is initialized
docker exec -it fa-db mysql -u root -p123456 test -e "SHOW TABLES;"

# If no tables, run:
docker exec backend uv run python init_database.py
```

### Port already in use

```bash
# Find what's using port 8000
lsof -i :8000

# Or change port in docker-compose.yml
ports:
  - "8001:8000"  # Use port 8001 on host instead
```

### Module not found errors

```bash
# Rebuild container with latest dependencies
docker-compose up --build -d backend
```

## ✅ Verification Checklist

Before starting development, verify:

- [ ] Containers running: `docker-compose ps`
- [ ] Backend accessible: `curl http://localhost:8000/`
- [ ] Database accessible: `docker exec -it fa-db mysql -u root -p123456 test`
- [ ] Tables created: Run `init_database.py`
- [ ] Data loaded: `curl http://localhost:8000/api/usuarios/`
- [ ] Endpoints working: Run `test_api.py`
- [ ] API docs accessible: http://localhost:8000/docs

## 🎯 Next Steps

1. ✅ Backend API is ready
2. ✅ Database populated with sample data
3. ⏳ Connect React frontend to the API
4. ⏳ Add authentication (JWT)
5. ⏳ Implement business logic
6. ⏳ Deploy to production

## 💻 Environment Configuration

`.env` file (already configured):
```env
DB_NAME=test
DB_HOST=database
DB_PASSWORD=123456
DB_DIALECT=mysql+pymysql
DB_USER=root
```

## 🌐 Access Points

| Service | URL | Port |
|---------|-----|------|
| API Documentation | http://localhost:8000/docs | 8000 |
| API Endpoints | http://localhost:8000/api/ | 8000 |
| Frontend | http://localhost:5173 | 5173 |
| MySQL | localhost | 3306 |

## 👥 Team

- **Course**: Base de Datos II
- **Institution**: Universidad Nacional de Trujillo
- **Students**: Abanto, Perez, Vega, Lujan

---

**Quick Reference Commands:**

```bash
# Start everything
docker-compose up -d

# Initialize database
docker exec backend uv run python init_database.py

# Test API
docker exec backend uv run python test_api.py

# View logs
docker logs backend -f

# Stop everything
docker-compose down
```
