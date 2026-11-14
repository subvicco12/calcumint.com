import {technologyFiveFramePolicy} from '@/lib/native-delivery/technology-five-frame-policy';
import {nativeFramePolicy} from '@/lib/native-delivery/frame-policy';
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { readableSessionCookies } from "@/lib/supabase/session-cookies";

function protectNativeFrame(request:NextRequest,response:NextResponse){if(request.nextUrl.pathname.startsWith('/embed/native/')){response.headers.set('Content-Security-Policy',nativeFramePolicy(request.nextUrl.pathname.slice('/embed/native/'.length),process.env.EMBED_SESSION_SECRET??''));response.headers.set('Cache-Control','no-store');response.headers.set('Referrer-Policy','no-referrer');}if(request.nextUrl.pathname.startsWith('/embed/technology/')){response.headers.set('Content-Security-Policy',technologyFiveFramePolicy(request.nextUrl.pathname.slice('/embed/technology/'.length),process.env.EMBED_SESSION_SECRET??''));response.headers.set('Cache-Control','no-store');response.headers.set('Referrer-Policy','no-referrer');}return response;}
export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return protectNativeFrame(request,NextResponse.next({ request }));

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return readableSessionCookies(request.cookies.getAll(), url);
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      }
    }
  });

  await supabase.auth.getUser();
  return protectNativeFrame(request,response);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"]
};
