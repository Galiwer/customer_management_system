# Customer Management System (Backend)

A minimal, high-performance Spring Boot application for managing customers with multi-level relationships and bulk Excel upload support.

## 🛠 Technologies
- **Java 1.8**
- **Spring Boot 2.7.x**
- **MariaDB**
- **Apache POI** (Excel Processing)
- **Maven**
- **JUnit 5**

## 🚀 Getting Started

### 1. Database Setup
1. Create a MariaDB database named `customer_db`.
2. Update `server/src/main/resources/application.properties` with your credentials.
3. Run the scripts in `/db_scripts/` to set up tables and sample data:
   - `schema.sql` (DDL)
   - `data.sql` (DML)

### 2. Run the Application
```bash
cd server
mvn spring-boot:run
```
The server will start at `http://localhost:8080`.

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/customers` | Get all customers (Table view) |
| GET | `/api/customers/{id}` | View a single customer |
| POST | `/api/customers` | Create a new customer |
| PUT | `/api/customers/{id}` | Update an existing customer |
| POST | `/api/customers/upload` | Bulk upload `.xlsx` file |

## 📊 Excel Upload Format
The Excel file should have the following columns (starting Row 2):
- **A**: Name
- **B**: DOB (YYYY-MM-DD)
- **C**: NIC
- **D**: Mobiles (comma-separated)
- **E**: Address Line 1
- **F**: City Name
- **G**: Country Name

## 🧪 Testing
Run tests using:
```bash
mvn test
```

## 💎 Features
- **No-Lombok Architecture**: Pure Java boilerplate for maximum compatibility.
- **Relational Integrity**: Handles nested Mobiles, Addresses, and Family relationships.
- **Auto-Sync Master Data**: Automatically adds Cities and Countries from Excel if missing.
- **Transaction Safe**: Uses `@Transactional` to prevent data corruption during bulk ops.