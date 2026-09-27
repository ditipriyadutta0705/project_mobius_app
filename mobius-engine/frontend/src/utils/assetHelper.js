// ============================================================================
// PROJECT MOBIUS: ASSET RESOLVER FOR GITHUB PAGES & VERCEL DEPLOYMENT
// Resolves relative public URLs taking Vite BASE_URL into account
// ============================================================================

export function resolveAssetUrl(url) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  const clean = url.replace(/^\.\//, '').replace(/^\//, '');
  const baseUrl = import.meta.env.BASE_URL || './';
  const prefix = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${prefix}${clean}`;
}

export default resolveAssetUrl;
