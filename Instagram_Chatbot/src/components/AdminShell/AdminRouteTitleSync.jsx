import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getPageTitle } from './adminMenuConfig';
import { useAdminHeaderTitleContext } from './AdminHeaderTitleContext';

function AdminRouteTitleSync() {
  const location = useLocation();
  const { setTitle } = useAdminHeaderTitleContext();

  useEffect(() => {
    setTitle(getPageTitle(location.pathname));
  }, [location.pathname, setTitle]);

  return null;
}

export default AdminRouteTitleSync;
