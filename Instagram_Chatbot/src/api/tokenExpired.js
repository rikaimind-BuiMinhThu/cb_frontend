import Cookies from "js-cookie";
export function tokenExpired(){
    Cookies.set('is_auth', 'false');
    Cookies.remove('token', '/')
    // removeCookie('token', '/admin/client-management')
    // removeCookie('token', '/admin/user-management')
    // removeCookie('token', '/admin/keyword')
    // removeCookie('token', '/admin/dashboard')
    // removeCookie('token', '/admin/admin/chatbot')
    Cookies.remove('user_role')
    Cookies.remove('user_id')
    Cookies.remove('page_access_token')
    Cookies.remove('scenario_id')
    Cookies.remove('refreshToken')
    
    const isV2 = typeof window !== 'undefined' && window.location.pathname.indexOf('/v2') === 0;
    window.location.href = isV2 ? '/v2/sign-in' : '/';
}