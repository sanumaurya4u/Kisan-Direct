# Kisan Direct - SIH 2026 Demo Guide

This document serves as your **presentation script** for the Smart India Hackathon. Follow these steps in order to demonstrate the complete, end-to-end functionality of the Kisan Direct platform.

## Pre-requisites
- Ensure your local development server is running (`npm run dev`).
- The database is pre-seeded with Product Categories (Vegetables, Fruits, Grains) and Products (Tomatoes, Wheat, etc.).

---

## 👨‍🌾 Step 1: The Farmer (Supply Side)

**Goal:** Show how easily a farmer can list their produce without intermediaries.

1. **Register:** Go to `/register` and create an account:
   - Email: `farmer@example.com`
   - Role: `Farmer`
   - Complete the profile setup (Farm size: 5 acres, Location: Nashik).
2. **Dashboard:** You will be routed to the **Farmer Dashboard**.
3. **Create Listing:**
   - Click **"Create Listing"**.
   - Select **Tomato** from the pre-seeded products.
   - Set Quantity: `50 Quintals`.
   - Set Price: `₹2000 per Quintal`.
   - Hit **Publish**.
4. **Result:** The listing is now live in the global marketplace.

---

## 🏢 Step 2: The Bulk Buyer (Demand Side)

**Goal:** Show how institutional buyers or retailers bypass mandis to source directly.

1. **Register/Login:** Open an incognito window, go to `/register` and create an account:
   - Email: `buyer@example.com`
   - Role: `Bulk Buyer`
   - Company: `FreshRetail Corp`
2. **Dashboard:** You will be routed to the **Buyer Dashboard**.
3. **Post Requirement:**
   - Create a requirement for **Tomato**.
   - Quantity needed: `40 Quintals`.
   - Target Price: `₹2200 per Quintal`.
4. **AI Matching:** 
   - Click **"Find Matches"** on the new requirement.
   - The platform will use the **Match Engine** to find the Farmer's listing you just created!
   - Point out the **Match Score** (e.g., 90%+) and the **Price Breakdown** (showing 0% platform fee and estimated logistics).
5. **Initiate Order:** 
   - Click **"Initiate Order"** on the match.

---

## 🤝 Step 3: Order Acceptance & Smart Selling

**Goal:** Demonstrate transaction transparency and farmer empowerment.

1. **Switch back to the Farmer's window.**
2. **Check Notifications:** 
   - Click the **Notification Bell** in the top right. You will see a real-time alert: *"New Order Received"*.
3. **Review Order:**
   - Go to **Received Orders**.
   - Review the Buyer's request. Highlight the **"Net Farmer Realization"** card to the judges. Point out that the farmer keeps 100% of the crop value.
4. **Accept Order:** Click **"Accept"**.
5. **Ready for Pickup:** Once packed, click **"Ready for Pickup"**. 
   - *Behind the scenes: This automatically triggers a Postgres function that spawns a Logistics Job!*

---

## 🚚 Step 4: Logistics & Route Optimization

**Goal:** Show how the platform integrates transport partners and optimizes routes.

1. **Register/Login:** Open a third window, go to `/register`:
   - Email: `logistics@example.com`
   - Role: `Logistics Partner`
2. **Dashboard:** You will be routed to the **Logistics Dashboard**.
3. **Add Vehicle:**
   - Click **"Add Vehicle"** (e.g., Tata Ace, Capacity: 2000kg).
4. **Accept Job:**
   - Go to the **Jobs** tab. You will see the pending job spawned by the Farmer.
   - Assign your vehicle and click **"Accept Job"**.
5. **Route Optimization:**
   - Click **"View Route"**.
   - Show the judges the **interactive Leaflet Map** displaying the calculated route from the Farmer's location to the Buyer's location.

---

## 📊 Step 5: Admin Analytics & AI Forecasting

**Goal:** Showcase platform scalability and AI-driven agricultural planning.

1. **Register/Login:** Create an account with the role `Admin`.
2. **Dashboard:**
   - Show the **Platform Admin Dashboard**.
   - Highlight the real-time **Gross Merchandise Value (GMV)**, user demographics pie chart, and live statistics.
3. **AI Demand Forecasting (Phase 9):**
   - Navigate to the **Market Analytics** tab (`/analytics`).
   - Show the **Recharts Area Graph** demonstrating simulated 6-month demand trends.
   - Point out the **Smart Selling Recommendation** engine advising farmers on what to plant based on these predictive trends.

---

### 🎉 Conclusion
You have now demonstrated a complete farm-to-retail supply chain, completely removing middlemen, visualizing logistics, and predicting future demand!
