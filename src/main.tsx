import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { store } from "./app/store";
import { ProtectedRoute } from "./app/ProtectedRoute";
import { LoginPage } from "./auth/LoginPage";
import { VehicleListPage } from "./vehicles/VehicleListPage";
import { VehicleForm } from "./vehicles/VehicleForm";

const sampleVehicles = [
  {
    id: "1",
    vin: "1HGBH41JXMN109186",
    make: "Ford",
    model: "Transit",
    year: 2024,
    agency: "GSA",
    status: "IN_SERVICE",
    mileage: 12000,
    acquiredDate: "2024-01-15",
  },
  {
    id: "2",
    vin: "2T2BK1BA2KC123456",
    make: "Chevrolet",
    model: "Impala",
    year: 2021,
    agency: "DOT",
    status: "IN_MAINTENANCE",
    mileage: 35000,
    acquiredDate: "2021-06-02",
  },
] as const;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/vehicles"
          element={
            <ProtectedRoute>
              <VehicleListPage vehicles={sampleVehicles as any} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vehicles/new"
          element={
            <ProtectedRoute>
              <VehicleForm onSubmit={() => {}} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vehicles/:id/edit"
          element={
            <ProtectedRoute>
              <VehicleForm vehicle={sampleVehicles[0] as any} onSubmit={() => {}} />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
