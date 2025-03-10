import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Este middleware se ejecuta en cada solicitud
export function middleware(request: NextRequest) {
  // Solo para propósitos de desarrollo local
  if (process.env.NODE_ENV === 'development') {
    // Verificar si las credenciales de AWS están configuradas
    const missingEnvVars = []
    
    if (!process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID) missingEnvVars.push('AWS_ACCESS_KEY_ID')
    if (!process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY) missingEnvVars.push('AWS_SECRET_ACCESS_KEY')
    if (!process.env.NEXT_PUBLIC_AWS_S3_REGION) missingEnvVars.push('AWS_REGION')
    if (!process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME) missingEnvVars.push('AWS_S3_BUCKET_NAME')
    
    // Si faltan variables de entorno, redirigir a una página de configuración
    if (missingEnvVars.length > 0 && !request.nextUrl.pathname.startsWith('/setup')) {
      console.warn(`Missing environment variables: ${missingEnvVars.join(', ')}`)
      // En un entorno real, podrías redirigir a una página de configuración
      // return NextResponse.redirect(new URL('/setup', request.url))
    }
  }
  
  return NextResponse.next()
}

// Configurar en qué rutas se ejecuta el middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
