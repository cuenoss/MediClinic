import { createBrowserRouter } from "react-router";
import { MainLayout } from "./components/layouts/MainLayout";
import { AuthLayout } from "./components/layouts/AuthLayout";
import { LoginScreen } from "./components/auth/LoginScreen";
import { RegisterScreen } from "./components/auth/RegisterScreen";
import { PasswordResetScreen } from "./components/auth/PasswordResetScreen";
import { Dashboard } from "./components/dashboard/Dashboard";
import { PatientList } from "./components/patients/PatientList";
import { PatientProfile } from "./components/patients/PatientProfile";
import { AppointmentCalendar } from "./components/appointments/AppointmentCalendar";
import { AppointmentSchedule } from "./components/appointments/AppointmentSchedule";
import { FileManager } from "./components/files/FileManager";
import { Settings } from "./components/settings/Settings";
import { Finance } from "./components/finance/Finance";

export const router = createBrowserRouter([
  {
    path: "/auth",
    Component: AuthLayout,
    children: [
      { path: "login", Component: LoginScreen },
      { path: "register", Component: RegisterScreen },
      { path: "reset-password", Component: PasswordResetScreen },
    ],
  },
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "patients", Component: PatientList },
      { path: "patients/:id", Component: PatientProfile },
      { path: "appointments", Component: AppointmentCalendar },
      { path: "appointments/schedule", Component: AppointmentSchedule },
      { path: "files", Component: FileManager },
      { path: "finance", Component: Finance },
      { path: "settings", Component: Settings },
    ],
  },
]);
