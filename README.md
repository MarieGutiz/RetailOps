# RetailOps

## About the Project

**RetailOps** is an interactive web application for simulating retail inventory management, helping users make smarter decisions under uncertainty. It supports classic inventory control models such as Newsvendor, EOQ (Economic Order Quantity), ABC Analysis, and Critical Ratio. By modeling real-world retail scenarios, RetailOps shows how inventory decisions impact business performance.

Retailers constantly navigate two competing risks:

- Overstocking – incurring storage costs and potential waste

- Understocking – losing sales and disappointing customers

With **RetailOps**, users can:

- Input demand, cost, and inventory parameters for individual products or entire shops, including expected demand, variability, holding costs, and penalties for stockouts.
- Simulate different inventory scenarios under uncertainty using classic models:
  1. **Newsvendor** – analyze daily ordering decisions when demand is unpredictable, accounting for salvage values and lost sales penalties.
  2. **EOQ** (Economic Order Quantity) – calculate optimal order quantities, order cycles, and total costs for products with stable demand.
  3. **ABC** Analysis – categorize products based on sales value, demand, or both, helping prioritize which items need more attention or tighter inventory control.

- Receive actionable recommendations for optimal order quantities, reorder points, and inventory allocation to minimize costs and maximize service levels.

- Prioritize products and resources effectively using insights from ABC classification, Critical Ratio, and Monte Carlo simulations, so you can focus on high-impact items and improve overall inventory performance.
- Perform “**what-if**” analytics to compare scenarios, adjust service levels, or test alternative thresholds, giving you confidence in strategic decisions.
- Export PDF reports summarizing your simulation for insights.

---

## System Architecture

![Project Architecture](img/RetailOps_Architecture.png)

---

## Key Features

- 📊 **Newsvendor Simulation** – Optimize daily ordering under uncertain demand
- 📦 **EOQ Model** – Calculate optimal order quantities and cycles
- 🧮 **ABC Analysis** – Prioritize products based on consumption value
- 📈 **Analytics & Reporting** – Compare scenarios and evaluate performance
- 🔍 **What-if Analysis** – Test alternative strategies and parameters
- 📄 **PDF Export** – Generate simulation reports
- 🔐 **OAuth2 Authentication** – Google & GitHub login
- 📱 **Responsive Design** – Works across desktop, tablet, and mobile

---

## Technology Stack

### Frontend

- React
- TypeScript
- TailwindCSS
- Shadcn ui
- Zustand (state management)

### Backend

- Java 21
- Spring Boot 3.4.5
- REST API
- OAuth2 Authentication (Google / GitHub)

### Database

- MySQL 8.0.39 (RDBMS)

### Development Tools

- GitHub for version control
- Draw.io for architecture diagrams
- C4 Model for system architecture

---

## API Documentation

The backend REST API for RetailOps is fully documented and available interactively via SwaggerHub.  
You can explore all endpoints, try requests, and see response examples here:

🔗 [RetailOps API on SwaggerHub](https://app.swaggerhub.com/apis/ANALYSTDATA/retailops-inventory-optimization-api/v1.0-sim)

---

## Architecture Overview

The application follows a **client-server architecture** based on the C4 container model.

System components:

- **User Browser** – interacts with the web interface
- **React Frontend** – handles the user interface and input validation
- **Spring Boot Backend** – processes requests and performs calculations
- **Authentication Providers** – Google and GitHub OAuth2 services

The frontend communicates with the backend using REST APIs, while the backend manages authentication and business logic.

---

## Project Structure

```
RetailOps
│
├── backend
│   └── Spring Boot application
│
├── frontend
│   └── React + TypeScript application
│
├── img
│   └── architecture diagrams and screenshots
│
└── README.md
```

---

## Installation

### 1. Clone the repository

```
git clone https://github.com/mariegutiz/retailops.git
cd retailops
```

---

### 2. Configure the Database

This application requires a **MySQL database**.

Before running the backend, configure your database credentials in:

backend/inventorysimulator/src/main/resources/application.yml

> ⚠️ The `resources` folder may not be included in the repository (e.g. due to `.gitignore`).
>
> If it does not exist, create the following structure manually:
>
> ```
> backend/inventorysimulator/src/main/resources/
> ```
>
> Then create a file named:
>
> ```
> application.yml
> ```

Example configuration:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/retailops_db?createDatabaseIfNotExist=true
    username: your_username
    password: your_password
```

---

### 3. Start the Backend

```bash
cd backend/inventorysimulator
./mvnw spring-boot:run

```

The backend server will start on:

```

http://localhost:8080

```

---

### 4. Start the Frontend

```

cd frontend/inventorysim-app
npm install
npm run dev

```

The frontend application will start on:

```

http://localhost:5173

```

---

## Example Usage

1. Open the app in your browser and create a shop by providing a shop name.
2. Set preferences in the Settings tab, including currency format ($, €, etc.).
3. Check Overview to see past simulations.
4. Add Products in the Inventory tab:
   Add manually or import sample products (Florist or Cafeteria).
   Provide name, SKU, cost, price, description, and category.
5. Add Inventory: Use Add to Inventory in the product library.
6. Review Stock:
   - Check inventory levels and ABC classification (based on sales value = quantity × price).
   - See Critical Ratio, optimal order quantity (Q\*), and profit/loss from Monte Carlo simulations.
7. Run Simulations:
   - Newsvendor – Simulate uncertain demand. Enter expected demand, variability (standard deviation), salvage value, and penalties.
   - EOQ – Enter demand, fixed cost, and holding cost. Simulator provides Q\*, cycle, and number of orders.
   - ABC Analysis – Classic (based on sales value) or Advanced (incorporates demand) to categorize products.

8. Analytics (What-If Scenarios):
   - Compare Newsvendor service levels against past simulations.
   - Compare EOQ parameters against previous results.
   - Adjust ABC thresholds (e.g., A: 80%, B: 95%, C: >95%) and compare outcomes.
9. Generate Reports: Export PDF reports summarizing your specific simulation for insights or stakeholders.

---

## Future Improvements

- Interactive demand distribution visualization
- Extended analytics for inventory strategies
- Newsvendor model with replacement
- Deployment to cloud infrastructure
- AI-driven decision support

---

## Author

Developer - Mariela Gutierrez [@mariegutiz](https://github.com/mariegutiz)

---

## Demo

A short 2-minute brief walkthrough of **RetailOps** in action.

[▶️ Watch the Demo Video](https://drive.google.com/file/d/1h1TAwjX4GnAb4FQVZLulssai6mlB77Ud/view)

This video demonstrates how to create a shop, add products, manage inventory, and run simulations such as Newsvendor.

**RetailOps** is fully responsive and works seamlessly on tablets and smaller screens:

[📱 Responsive Demo](https://drive.google.com/file/d/1dCktRolVcufbMlfVzTFgQMeN6GmWAAAt/view?usp=sharing)

<p align="center">
  <img src="img/retailsOps.png" alt="RetailOps Logo" width="77" height="77" />
</p>
```
