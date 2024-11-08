import * as React from 'react';
import { Router } from '@toolpad/core/AppProvider';
import { useNavigate } from 'react-router-dom';

export const useDemoRouter = (initialPath: string): Router => {
    const [pathname, setPathname] = React.useState(initialPath);
    const navigate = useNavigate();

    const router = React.useMemo(() => {
        return {
          pathname,
          searchParams: new URLSearchParams(),
          navigate: (path: string | URL) => {
            setPathname(String(path)); // Update pathname in the state
            navigate(String(path)); // Trigger navigation using react-router
          },
        };
      }, [pathname, navigate]);

    return router;
}