# 🚢 Compass Voyage

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Recharts-22B5BF?style=for-the-badge&logo=react&logoColor=white" alt="Recharts" />
  <img src="https://img.shields.io/badge/Lucide_Icons-FD4D4D?style=for-the-badge&logo=lucide&logoColor=white" alt="Lucide Icons" />
  <img src="https://img.shields.io/badge/LocalStorage-Browser-blue?style=for-the-badge&logo=googlechrome&logoColor=white" alt="LocalStorage" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</p>

## Overview

Compass Voyage is a shipment visibility platform for Compass Logistics International, designed to track ocean freight shipments from Port of Loading (POL) to Port of Discharge (POD). It provides shipment journey updates, schedule lookup, carrier comparisons, ETA revisions, and customer visibility through role-based dashboards.

## Features

- **Role-Based Access** – Separate Operations and Customer experiences.
- **Operations Dashboard** – View and manage shipment information across bookings.
- **Shipment Journey Tracking** – Track milestones from booking confirmation to delivery.
- **ETA Updates** – Record revised ETAs, delay reasons, and remarks.
- **Schedule Lookup** – Search sailing schedules using cascading filters.
- **Carrier Comparison** – Compare carrier schedules and transit options.
- **Customer Dashboard** – Customers can view only their assigned shipments.
- **Compass Agent** – Demo assistant for shipment-related questions.
- **Notifications** – Shipment-specific updates and alerts.
- **Demo Data** – Preloaded fictional shipment, carrier, port, and customer records.

## Technology Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Recharts
- Lucide Icons
- React Context API
- Browser LocalStorage
- Vercel

## User Roles

### Operations
- View shipment information across the demo dataset.
- Search schedules and compare carriers.
- Create bookings and manage customer users.
- Update shipment ETA and delay information.
- View shipment journeys and notifications.

### Customer
- View assigned shipment details and schedules.
- Track shipment milestones and revised ETA.
- View shipment updates and delay reasons.

## Shipment Journey

A shipment journey may include:

1. Booking Confirmed
2. Cargo Received
3. Gate-In
4. Loaded on Vessel
5. Vessel Departed
6. Transshipment
7. Vessel Arrived
8. Customs Clearance
9. Cargo Available
10. Delivered

## Getting Started

### Prerequisites

- Node.js
- npm
- Git

### Installation

```bash
git clone <your-existing-repository-url>
cd <repository-folder>
npm install
```

If npm reports a peer dependency conflict, use:

```bash
npm install --legacy-peer-deps
```

### Run the Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

## Project Structure

```text
compass-voyage/
├── public/
│   └── assets/
├── src/
│   ├── components/
│   │   ├── agent/
│   │   ├── auth/
│   │   ├── common/
│   │   ├── customer/
│   │   ├── journey/
│   │   ├── notifications/
│   │   └── operations/
│   ├── context/
│   ├── data/
│   ├── types/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Demo Information

Compass Voyage currently uses fictional, preloaded shipment and schedule data for demonstration purposes.

- Data is stored in browser LocalStorage.
- Shipment and carrier schedules are not connected to live carrier APIs.
- Application data is local to the browser and is not a shared production database.
- Authentication and role-based access are intended for demonstration; production deployment requires secure backend authentication and authorization.

## Future Enhancements

- Live carrier schedule and tracking integrations.
- Shared backend database.
- Secure production authentication and role permissions.
- Real-time shipment event updates.
- Enhanced AI-powered shipment explanations.
- Automated ETA and delay notifications.

---

**Compass Logistics International**  
*Connecting shipments. Improving visibility.*