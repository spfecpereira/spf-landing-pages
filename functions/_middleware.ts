// Cloudflare Pages Functions Middleware
// Routes requests to the correct content based on subdomain

export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  const hostname = url.hostname;

  // Mairinque subdomain
  if (hostname.startsWith('mairinque.')) {
    return serveSubdirectory(context, '/servicos-ti-mairinque');
  }

  // São Roque subdomain
  if (hostname.startsWith('saoroque.')) {
    return serveSubdirectory(context, '/servicos-ti-sao-roque');
  }

  // Default: serve as-is (Ibiúna or root domain)
  return next();
}

async function serveSubdirectory(context, basePath) {
  const { request, next } = context;
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Root of subdomain: serve the index.html from the subdirectory
  if (pathname === '/' || pathname === '') {
    const redirectUrl = `${basePath}/`;
    return Response.redirect(new URL(redirectUrl, url.origin).toString(), 301);
  }

  // Pass through to static assets
  return next();
}
