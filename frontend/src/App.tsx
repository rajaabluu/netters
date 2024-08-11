import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./pages/layout";
import HomePage from "./pages";
import LoginPage from "./pages/auth/login";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import SignUpPage from "./pages/auth/signup";
import NotificationPage from "./pages/notification";
import { AuthProvider } from "./context/auth_context";
import PrivateRoute from "./components/routes/private_route";
import GuestRoute from "./components/routes/guest_route";
import ProfilePage from "./pages/[username]";
import PostDetailPage from "./pages/[username]/post/[id]";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<GuestRoute />}>
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/signup" element={<SignUpPage />} />
            </Route>
            {/* Private Route */}
            <Route element={<PrivateRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/notification" element={<NotificationPage />} />
                <Route path="/:username" element={<ProfilePage />} />
                <Route
                  path="/:username/post/:id"
                  element={<PostDetailPage />}
                />
              </Route>
            </Route>
            {/* End Private Route */}
          </Routes>
          <Toaster richColors />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
