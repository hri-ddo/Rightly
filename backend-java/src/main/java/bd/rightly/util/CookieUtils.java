package bd.rightly.util;

import bd.rightly.constant.CookieNames;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import java.time.Duration;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
public class CookieUtils {

    private static final String ROOT = "/";
    private static final boolean SECURE = false;

    public void writeSession(HttpServletResponse response, String jwt, Duration maxAge) {
        ResponseCookie cookie = ResponseCookie.from(CookieNames.SESSION, jwt)
                .httpOnly(true)
                .secure(SECURE)
                .path(ROOT)
                .maxAge(maxAge)
                .sameSite("Lax")
                .build();
        response.addHeader("Set-Cookie", cookie.toString());
    }

    public void writeCsrf(HttpServletResponse response, String token, Duration maxAge) {
        ResponseCookie cookie = ResponseCookie.from(CookieNames.CSRF, token)
                .httpOnly(false)
                .secure(SECURE)
                .path(ROOT)
                .maxAge(maxAge)
                .sameSite("Lax")
                .build();
        response.addHeader("Set-Cookie", cookie.toString());
    }

    public void clearAuthCookies(HttpServletResponse response) {
        expireCookie(response, CookieNames.SESSION);
        expireCookie(response, CookieNames.CSRF);
    }

    private void expireCookie(HttpServletResponse response, String name) {
        ResponseCookie cookie = ResponseCookie.from(name, "")
                .httpOnly(CookieNames.SESSION.equals(name))
                .secure(SECURE)
                .path(ROOT)
                .maxAge(0)
                .sameSite("Lax")
                .build();
        response.addHeader("Set-Cookie", cookie.toString());
    }

    public static String readCookieValue(Cookie[] cookies, String name) {
        if (cookies == null) {
            return null;
        }
        for (Cookie cookie : cookies) {
            if (name.equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }
}