import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import App from './App';

// Since App composes many providers and pages, we mock heavy child pages/components
vi.mock('./pages/Auth', () => ({ default: () => <div data-testid="page-auth">Auth Page</div> }));
vi.mock('./pages/ClientServices', () => ({ default: () => <div data-testid="page-client-services">Client Services</div> }));
vi.mock('./pages/ClientBooking', () => ({ default: () => <div data-testid="page-client-booking">Client Booking</div> }));
vi.mock('./pages/ClientBookings', () => ({ default: () => <div data-testid="page-client-bookings">Client Bookings</div> }));
vi.mock('./pages/ClientProfile', () => ({ default: () => <div data-testid="page-client-profile">Client Profile</div> }));
vi.mock('./pages/ProviderDashboard', () => ({ default: () => <div data-testid="page-provider-dashboard">Provider Dashboard</div> }));
vi.mock('./pages/ProviderServices', () => ({ default: () => <div data-testid="page-provider-services">Provider Services</div> }));
vi.mock('./pages/ProviderProfile', () => ({ default: () => <div data-testid="page-provider-profile">Provider Profile</div> }));
vi.mock('./pages/NotFound', () => ({ default: () => <div data-testid="page-not-found">Not Found</div> }));

// Mock UI providers that might touch DOM APIs
vi.mock('@/components/ui/tooltip', () => ({ TooltipProvider: ({ children }: any) => <>{children}</> }));
vi.mock('@/components/ui/sonner', () => ({ Toaster: () => <div data-testid="toaster" /> }));

// Control Auth state via context hook mock
vi.mock('./contexts/AuthContext', async () => {
  const actual = await vi.importActual<any>('./contexts/AuthContext');
  let isLoggedIn = false;
  return {
    ...actual,
    useAuth: () => ({ isLoggedIn }),
    __setAuth: (value: boolean) => { isLoggedIn = value; },
  };
});

// Keep Booking/Services providers light by mocking to passthrough
vi.mock('./contexts/BookingContext', async () => {
  const actual = await vi.importActual<any>('./contexts/BookingContext');
  return { ...actual, BookingProvider: ({ children }: any) => <>{children}</> };
});
vi.mock('./contexts/ServicesContext', async () => {
  const actual = await vi.importActual<any>('./contexts/ServicesContext');
  return { ...actual, ServicesProvider: ({ children }: any) => <>{children}</> };
});

// Theme provider passthrough to avoid DOM side-effects
vi.mock('./contexts/ThemeContext', async () => {
  const actual = await vi.importActual<any>('./contexts/ThemeContext');
  return { ...actual, ThemeProvider: ({ children }: any) => <>{children}</> };
});

// Silence ErrorBoundary by making it transparent in tests
vi.mock('./components/ErrorBoundary', () => ({ default: ({ children }: any) => <>{children}</> }));

// wouter location mocking helper
function setLocation(path: string) {
  window.history.pushState({}, 'Test', path);
}

describe('App Router', () => {
  let setAuth: (v: boolean) => void;

  beforeEach(async () => {
    const mod = await import('./contexts/AuthContext');
    // @ts-ignore
    setAuth = mod.__setAuth;
    setAuth(false);
  });

  it('Should render Auth on "/" when not logged in', () => {
    setLocation('/');
    render(<App />);
    expect(screen.getByTestId('page-auth')).toBeInTheDocument();
  });

  it('Should render Client Services on "/" when logged in', () => {
    setLocation('/');
    setAuth(true);
    render(<App />);
    expect(screen.getByTestId('page-client-services')).toBeInTheDocument();
  });

  it('Should navigate to Client Booking with param', () => {
    setLocation('/client/booking/123');
    render(<App />);
    expect(screen.getByTestId('page-client-booking')).toBeInTheDocument();
  });

  it('Should route to specific provider pages', () => {
    setLocation('/provider/services');
    render(<App />);
    expect(screen.getByTestId('page-provider-services')).toBeInTheDocument();
  });

  it('Should fall back to NotFound for unknown routes', () => {
    setLocation('/some/unknown/path');
    render(<App />);
    expect(screen.getByTestId('page-not-found')).toBeInTheDocument();
  });
});
