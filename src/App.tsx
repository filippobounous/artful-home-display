import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import { TestDataProvider } from '@/context/TestDataProvider';

// Pages
import Index from '@/pages/Index';
import AllItems from '@/pages/AllItems';
import AddItem from '@/pages/AddItem';
import Settings from '@/pages/Settings';
import Analytics from '@/pages/Analytics';
import CategoryPage from '@/pages/CategoryPage';
import HousePage from '@/pages/HousePage';
import Drafts from '@/pages/Drafts';
import Warnings from '@/pages/Warnings';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TestDataProvider>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <BrowserRouter>
            <SidebarProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/inventory" element={<AllItems />} />
                <Route path="/items/:itemId" element={<AllItems />} />
                <Route path="/add-item" element={<AddItem />} />
                <Route path="/drafts" element={<Drafts />} />
                <Route path="/warnings" element={<Warnings />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/category/:categoryId" element={<CategoryPage />} />
                <Route path="/house/:houseId" element={<HousePage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </SidebarProvider>
          </BrowserRouter>
          <Toaster />
        </ThemeProvider>
      </TestDataProvider>
    </QueryClientProvider>
  );
}

export default App;
