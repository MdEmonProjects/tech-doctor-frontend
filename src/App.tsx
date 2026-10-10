import { Provider } from 'react-redux';
import store from './app/store';
import { AppProvider } from './context/AppProvider';
import { AppRoutes } from './routes/AppRoutes';

export default function App() {
  return (
    <Provider store={store}>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </Provider>
  );
}
