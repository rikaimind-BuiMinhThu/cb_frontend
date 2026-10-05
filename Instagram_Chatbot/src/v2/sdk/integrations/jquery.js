export const ensureJQuery = () => {
  if (typeof window.jQuery === 'undefined') {
    const head = document.getElementsByTagName('head')[0];
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
    head.appendChild(script);
  }
};
