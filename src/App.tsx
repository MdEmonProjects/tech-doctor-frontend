import { AppProvider } from './context/AppProvider';
import { AppRoutes } from './routes/AppRoutes';

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}
