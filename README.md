# 🧭 Compass Voyage
### Shipment Visibility & Transportation Schedule Intelligence

**A Proof of Concept (POC) for Compass Logistics International**

<p align="center">
  <strong>Streamlining shipment visibility, transportation schedule lookup, and carrier comparison through a unified logistics platform.</strong>
</p>

---

## 📌 Project Overview

Compass Voyage is a logistics shipment visibility and transportation schedule management application designed to simplify operational shipment lookup and customer tracking.

The platform provides Operations users with tools to identify shipment schedules using route and booking information, compare available carrier options, and inspect shipment journeys. Customers receive a focused view of their assigned shipment and its recorded milestones.

The project is developed as a **Proof of Concept (POC)** to demonstrate how structured logistics data and a centralized interface can improve shipment visibility and operational workflows.

## 🛠️ Technology Stack

<p align="center">
  <img src="https://img.shields.io/badge/Google_AI_Studio-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google AI Studio"/>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"/>
  <br/>
  <img src="https://img.shields.io/badge/Logistics-0D2240?style=for-the-badge" alt="Logistics"/>
  <img src="https://img.shields.io/badge/Shipment_Tracking-16A34A?style=for-the-badge" alt="Shipment Tracking"/>
  <img src="https://img.shields.io/badge/Carrier_Analytics-B7F500?style=for-the-badge&logoColor=black" alt="Carrier Analytics"/>
  <img src="https://img.shields.io/badge/POC-6B7280?style=for-the-badge" alt="Proof of Concept"/>
</p>

> **Note:** The badges above represent the intended development environment and application capabilities. Confirm the actual framework and integrations in the repository before treating every badge as an implemented dependency.

## ✨ Key Features

### 1. Operations Dashboard
- Shipment status overview and operational metrics.
- Visibility into delayed shipments and upcoming schedules.
- Access to shipment records and relevant operational information.

### 2. Transportation Schedule Lookup
- Dependent dropdowns for Port of Loading (POL), Port of Discharge (POD), carrier company, and booking number.
- Route-aware filtering of available carrier and booking options.
- Exact shipment schedule lookup based on the selected criteria.
- Direct access to the associated shipment details and journey.

### 3. Carrier Comparison & Recommendation
- Compare available carrier options for a selected route.
- Evaluate schedule availability and transit duration.
- Consider historical reliability, delays, and freight cost when reliable data is available.
- Provide transparent recommendations based on available information.
- Identify missing metrics instead of inventing performance figures.

### 4. Customer Shipment Tracking
- One assigned shipment per demo customer.
- Shipment status, route, vessel, and container details where available.
- Estimated arrival and revised ETA information.
- Customer-specific shipment visibility.

### 5. Shipment Journey Timeline
- Recorded shipment milestones and locations.
- Planned versus actual dates.
- Revised schedules and delay information where available.
- Clear distinction between confirmed events and planned milestones.

### 6. Notifications
- Shipment and schedule-related notifications.
- User-specific notification visibility.
- Read/unread states where implemented.

### 7. Compass Agent
- Logistics-focused assistance for supported shipment and schedule queries.
- Responses based on available application records.
- Customer-specific access restrictions for shipment-related answers.

## 👥 User Roles

| Role | Description |
|---|---|
| **Operations** | Searches shipment schedules, reviews shipment journeys, compares carriers, and manages authorized operational records. |
| **Customer** | Views the single shipment assigned to their account and its recorded tracking information. |

Carrier companies are attributes of shipments and schedules, not application login roles.

## 🔄 Application Workflows

### Operations — Shipment Schedule Lookup

```text
Select POL
    ↓
Select POD
    ↓
Select Carrier Company
    ↓
Select Booking Number
    ↓
Search Shipment Schedule
    ↓
View Exact Shipment Details
    ↓
Open Shipment Journey
```

The dropdowns should update according to the preceding selections, preventing incompatible route, carrier, and booking combinations.

### Operations — Carrier Comparison

```text
Select POL and POD
        ↓
Retrieve Available Carrier Options
        ↓
Compare Schedules and Available Metrics
        ↓
Evaluate Recommendation
        ↓
Review Supporting Explanation
        ↓
Select Carrier for a New Booking
```

Recommendations must be based on available records. Missing price or reliability data must be disclosed.

### Customer — Shipment Tracking

```text
Customer Login / Demo Account
        ↓
Load Assigned Shipment
        ↓
View Shipment Status and Schedule
        ↓
Open Recorded Journey Timeline
```

Each demo customer should have exactly one assigned shipment. Production implementations must enforce ownership through server-side authorization.

## 🏗️ System Architecture

The intended application architecture separates the user interface, business logic, and data access.

```text
┌──────────────────────────────────────┐
│             User Interface           │
│ Login • Operations • Customer        │
│ Schedule Lookup • Carrier Comparison │
└──────────────────┬───────────────────┘
                   ↓
┌──────────────────────────────────────┐
│          Application Logic           │
│ Validation • Filtering • Permissions │
│ Recommendation • Timeline Processing │
└──────────────────┬───────────────────┘
                   ↓
┌──────────────────────────────────────┐
│              Data Layer              │
│ Users • Ports • Shipments            │
│ Schedules • Events • Notifications   │
└──────────────────────────────────────┘
```

The actual persistence and authentication architecture depends on the implementation present in the repository. A browser-only demonstration is not equivalent to a secure, shared production application.

## 🗃️ Core Data Entities

| Entity | Purpose |
|---|---|
| User | Stores Operations and Customer account information. |
| Port | Stores port codes, names, countries, and regions. |
| Shipment | Stores booking details, route, carrier, cargo, status, and estimated dates. |
| Schedule | Stores planned transportation milestones and alternative schedule options where implemented. |
| Shipment Event | Records journey milestones, locations, dates, and confirmation status. |
| Notification | Stores relevant messages associated with users and shipments. |

## 🎨 Design System

Compass Voyage uses a professional navy and neon-green visual identity.

| Design element | Value |
|---|---|
| Primary navy | `#0D2240` |
| Neon green | `#B7F500` |
| Company | Compass Logistics International |
| Application | Compass Voyage |

The design aims to maintain consistent branding across the login page, Operations dashboard, Customer dashboard, schedule lookup, and carrier comparison.

## 🔐 Security Considerations

- Customer shipment access must be restricted to the assigned shipment.
- Operations permissions must be enforced for authorized actions.
- Production deployments require server-side authentication and authorization.
- Credentials and secrets must not be committed to the repository.
- Demo account switching must not be treated as production authentication.
- Shipment events, carrier prices, and reliability statistics must not be fabricated or presented as live data.

## 🧪 Project Status

**Project Type:** Proof of Concept (POC)

Compass Voyage demonstrates a proposed workflow for logistics shipment visibility, transportation schedule lookup, carrier comparison, and customer-specific tracking.

Actual implementation and testing status should be confirmed against the current source code. Features that have not been verified or integrated with live systems should not be considered production-ready.

## 🚀 Future Enhancements

Potential future improvements include:

- Integration with approved carrier schedule and tracking APIs.
- Real-time vessel tracking.
- Predictive ETA and delay-risk analysis using validated historical data.
- Freight cost optimization using verified quotations.
- ERP and electronic data interchange integrations.
- Production-grade authentication, audit logging, and monitoring.

These are potential enhancements and are not claims of existing implementation.

## 📂 Repository Structure

The directory structure depends on the framework and files generated by Google AI Studio. Refer to the actual repository for the application's entry point, components, assets, data layer, and configuration files.

## ⚙️ Getting Started

Open the project using the development environment supported by the repository.

For a Google AI Studio-based application, open the project in the supported app-building workspace and launch its preview.

Follow the setup instructions included in the source code if the project requires a separate runtime or backend. Do not assume that a particular package manager, database, or deployment configuration is available unless it is included in the repository.

## ⚠️ Disclaimer

Compass Voyage is a proof of concept developed to demonstrate logistics application workflows. Demonstration data may be synthetic. Live shipment tracking, carrier availability, pricing, performance statistics, and production security must be independently verified before operational use.

---

<p align="center">
  <strong>Compass Voyage</strong><br/>
  Shipment visibility through structured logistics workflows.
</p>
