import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { BookingProvider } from "./contexts/BookingContext";
import { ServicesProvider } from "./contexts/ServicesContext";
import Auth from "./pages/Auth";
import ClientServices from "./pages/ClientServices";
import ClientBooking from "./pages/ClientBooking";
import ClientBookings from "./pages/ClientBookings";
import ClientProfile from "./pages/ClientProfile";
import ProviderDashboard from "./pages/ProviderDashboard";
import ProviderServices from "./pages/ProviderServices";
import ProviderProfile from "./pages/ProviderProfile";

function Router() {
  const { isLoggedIn } = useAuth();

  return (
    <Switch>
      <Route path={"/"} component={isLoggedIn ? ClientServices : Auth} />
      <Route path={"/auth"} component={Auth} />
      <Route path={"/client/services"} component={ClientServices} />
      <Route path={"/client/booking/:serviceId"} component={ClientBooking} />
      <Route path={"/client/bookings"} component={ClientBookings} />
      <Route path={"/client/profile"} component={ClientProfile} />
      <Route path={"/provider/dashboard"} component={ProviderDashboard} />
      <Route path={"/provider/services"} component={ProviderServices} />
      <Route path={"/provider/profile"} component={ProviderProfile} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <AuthProvider>
          <BookingProvider>
            <ServicesProvider>
              <TooltipProvider>
                <Toaster />
                <Router />
              </TooltipProvider>
            </ServicesProvider>
          </BookingProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
