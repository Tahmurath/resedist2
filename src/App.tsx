import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// import { lazy } from "react";
import { queryClient } from "./axios";
import { QueryClientProvider } from "@tanstack/react-query";
import { router } from "./routes";
import { RouterProvider } from "react-router";
import './App.css'
import HttpBackend from 'i18next-http-backend';



i18n
    .use(HttpBackend) // استفاده از HTTP Backend برای بارگذاری فایل‌ها
    .use(initReactI18next) // الحاق به React
    .init({
        fallbackLng: 'en',
        debug: false,
        interpolation: {
            escapeValue: false, // برای React نیازی به escaping نیست
        },
        backend: {
            loadPath: '/locales/{{lng}}/translation.json', // مسیر فایل‌های زبان
        },
    });

function App() {

  return (
    <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

export default App
