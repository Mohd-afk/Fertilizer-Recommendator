# Implementation Plan — Fertilizer Recommendation System

This document outlines the strategy for building and deploying the complete fertilizer recommendation application, integrating live Arduino sensor data with an intelligent recommendation engine.

## Phase 1: Project Audit & Foundation
- [ ] Review existing codebase in `d:\Fertilizer Recommendation App` to map current features.
- [ ] Stabilize the project structure (React + Vite + Tailwind).
- [ ] Ensure `package.json` has all necessary dependencies for ML (e.g., `onnxruntime-web` or similar for client-side ML).

## Phase 2: Data & Schema (Tasks 1-3)
- [ ] **Task 1: Dataset Inventory**: Finalize the list of Kaggle/public datasets for Fertilizer, Crop, and Soil.
- [ ] **Task 2: Quality Screening**: Evaluate datasets for relevance and quality.
- [ ] **Task 3: Unified Schema**: Create a master schema (`unified_agriculture_schema.json`) that merges NPK, pH, moisture, and crop data.

## Phase 4: Intelligence Layer (Tasks 4-5)
- [ ] **Task 4: ML Architecture**:
    - Fertilizer type classification (Random Forest/XGBoost approach).
    - Dosage regression (Hybrid ML + Agronomy rules).
    - Timing/Schedule prediction.
- [ ] **Task 5: Agronomy Logic**:
    - Implement NPK gap calculation formulas.
    - Add environmental safety checks (e.g., don't fertilize if rainfall is excessive).

## Phase 5: Hardware & Integration (Task 6)
- [ ] **Task 6: Web Serial Implementation**:
    - Refine `serialCommunication.ts` to handle JSON streams from Arduino.
    - Implement calibration logic (transform raw ADC to pH/Moisture).
    - Add "Mock Mode" for testing without hardware.

## Phase 6: UI & Features (Tasks 7-8)
- [ ] **Farmer-Friendly UI**:
    - Large buttons, high-contrast cards.
    - Bilingual support (English/Telugu) for crop names and soil types.
- [ ] **History & Visualization**:
    - Dashboard with Recharts for historical soil trends.
    - Recommendation summary cards with "Why" explanations.

## Phase 7: Deployment & Vercel
- [ ] Prepare `vercel.json` if needed.
- [ ] Connect repository to Vercel (or provide instructions for manual deployment).
- [ ] Optimize build for production.

---

## 📅 Timeline
| Phase | Focus | Status |
| :--- | :--- | :--- |
| 1 | Audit & Foundation | 🔄 In Progress |
| 2 | Data & Schema | ⏳ Pending |
| 3 | Intelligence Layer | ⏳ Pending |
| 4 | Hardware Integration| ⏳ Pending |
| 5 | UI Refinement | ⏳ Pending |
| 6 | Vercel Hosting | ⏳ Pending |
