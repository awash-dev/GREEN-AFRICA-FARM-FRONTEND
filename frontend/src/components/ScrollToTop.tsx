import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // Use a small timeout to ensure the DOM has updated
        // and to handle potential browser scroll restoration
        const timer = setTimeout(() => {
            window.scrollTo(0, 0);
        }, 0);

        return () => clearTimeout(timer);
    }, [pathname]);

    return null;
}
