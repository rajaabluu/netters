import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./pages/layout";
import HomePage from "./pages";
import LoginPage from "./pages/auth/login";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import SignUpPage from "./pages/auth/sign-up";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/sign-up" element={<SignUpPage />} />
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
          </Route>
        </Routes>
        <Toaster richColors />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
