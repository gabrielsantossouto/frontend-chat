import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function Proxy(request: NextRequest) {

    const userId = request.cookies.get('userId')?.value
    const { pathname } = request.nextUrl

    // se nao tiver userId e ele estiver no chat ele vai redirecionar para o register
    if(!userId && request.nextUrl.pathname.startsWith('/chat')){
        return NextResponse.redirect(new URL('/login', request.url))
    }
    // se tiver userId e ele estiver no login ele vai redirecionar para o chat
    if(userId && (pathname === '/login' || pathname === '/')) {
        return NextResponse.redirect(new URL('/chat', request.nextUrl))
    }


}

export const config = {
    matcher: ['/chat/:path*', '/', '/login']
}