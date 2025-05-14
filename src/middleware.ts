import baseConfig from '@/config';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher(['/site', '/agency/sign-in', '/agency/sign-up', 'api/uploadthing', '/']);

export default clerkMiddleware(async (auth, req) => {
    if(!isPublicRoute(req)) {
        await auth.protect();
    }
    
    const url = req.nextUrl
    const searchParams = url.searchParams.toString()
    const hostname = req.headers.get('host')

    const { publicDomain, publicUrl } = baseConfig.api

    const pathWithSearchParams = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ''}`


    //if subdomain exists
    const customSubDomain = hostname?.split(`${publicDomain}`).filter(Boolean)[0];


    if (customSubDomain) {
        return NextResponse.rewrite(new URL(`/${customSubDomain}${pathWithSearchParams}`, req.url))
    }


    if (url.pathname === '/sign-in' || url.pathname === '/sign-up') {
        const redirectUrl = new URL(`/agency/sign-in`, publicUrl);
        return NextResponse.redirect(redirectUrl);
    }

    if (url.pathname === "/" || (url.pathname === "/site" && url.host === baseConfig.api.publicUrl)) {
        return NextResponse.rewrite(new URL("/site", req.url))
    }

    if (url.pathname.startsWith("/agency") || url.pathname.startsWith("/subaccount")) {
        return NextResponse.rewrite(new URL(`${pathWithSearchParams}`, req.url))
    }

}
);

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};