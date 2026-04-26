# Customer Management System

A full-stack application designed for managing customer records, contact information, and family relationships. The system supports manual data entry through a dynamic user interface and high-performance bulk data ingestion via Excel and CSV files.

## Project Structure

The project is divided into two main components:
- **client**: A modern, responsive frontend built with Vanilla JavaScript and CSS.
- **server**: A robust RESTful API built with Java, Spring Boot, and MariaDB.

## Technology Stack

### Backend
- **Core**: Java 1.8, Spring Boot 2.7.18
- **Database**: MariaDB
- **Persistence**: Spring Data JPA / Hibernate
- **Excel Processing**: Apache POI 4.1.2 with Streaming support (xlsx-streamer)
- **Validation**: Hibernate Validator
- **Testing**: JUnit 5, MockMvc, H2 In-Memory Database

### Frontend
- **Logic**: Vanilla JavaScript (ES6+)
- **Styling**: Modern CSS3 with Flexbox and Grid
- **Build Tool**: Vite
- **Icons**: SVG based assets

## Features

- **Dynamic CRUD**: Full management of customers including multiple mobile numbers and addresses.
- **Relational Data Mapping**: Automatic lookup and creation of City and Country entities during import.
- **Family Links**: Capability to link customers as family members with automatic orphan removal logic.
- **Bulk Import**: Streaming support for large Excel (.xlsx) and CSV files to ensure low memory footprint.
- **Advanced UI**: Responsive dashboard with real-time search, drag-and-drop file uploads, and interactive modals.
- **Integration Testing**: Comprehensive test suite covering both happy paths and edge cases using isolated H2 database.

## Installation and Setup

### 1. Database Configuration
1. Ensure MariaDB is installed and running.
2. Create a database named `customer_db`.
3. Execute the SQL scripts located in the `DatabaseScripts` directory to initialize the schema:
   - `DDL.sql`: Creates tables and relationships.
   - `DML.sql`: Populates initial master data (Cities/Countries).

### 2. Environment Configuration
#### Server (.env)
Create a `.env` file in the `server` directory with the following variables:
```env
DB_URL=jdbc:mariadb://localhost:3306/customer_db
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

#### Client (.env)
Create a `.env` file in the `client` directory with the following variables:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### 3. Backend Setup (Server)
1. Navigate to the `server` directory.
2. Configure database credentials in `src/main/resources/application.properties`.
3. Build and run the application:
   ```bash
   mvn spring-boot:run
   ```
   The API will be available at `http://localhost:8080`.

### 3. Frontend Setup (Client)
1. Navigate to the `client` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## API Documentation

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/customers` | Retrieve all customer records |
| GET | `/api/customers/{id}` | Retrieve details of a specific customer |
| POST | `/api/customers` | Create a new customer record |
| PUT | `/api/customers/{id}` | Update an existing customer record |
| DELETE | `/api/customers/{id}` | Delete a customer record |
| POST | `/api/customers/upload` | Perform bulk upload of Excel/CSV files |

## Testing

The project includes a robust integration test suite. To execute the tests, run the following command from the `server` directory:
```bash
mvn test
```
The tests utilize an in-memory H2 database to ensure data integrity during the testing process.

## Bulk Upload Specifications

The system expects Excel or CSV files to follow this column structure:
- **Name**: Customer full name.
- **Date of Birth**: Formatted as YYYY-MM-DD.
- **NIC**: Unique Identification Number.
- **Mobiles**: Comma-separated list of mobile numbers.
- **Address Line 1**: Primary street address.
- **City**: Name of the city (auto-mapped).
- **Country**: Name of the country (auto-mapped).