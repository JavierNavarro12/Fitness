import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    // No hacer scroll si estamos navegando a /reports con un expandId
    // esto permite que el ReportAccordionList maneje el scroll al informe específico
    if (location.pathname === '/reports' && location.state?.expandId) {
      return;
    }

    window.scrollTo(0, 0);
  }, [location.pathname, location.state]);

  return null;
};

export default ScrollToTop;
