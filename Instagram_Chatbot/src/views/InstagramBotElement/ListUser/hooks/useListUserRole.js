import { useMemo } from 'react';
import Cookies from 'js-cookie';

export default function useListUserRole() {
  return useMemo(() => Cookies.get('user_role') === 'admin_deel', []);
}
