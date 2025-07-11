import { createBrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "*",
    element: <div>404 - Page Not Found</div>,
  }
]);
export default router;