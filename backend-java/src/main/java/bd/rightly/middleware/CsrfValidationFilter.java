package bd.rightly.middleware;

import bd.rightly.constant.CookieNames;
import bd.rightly.util.CookieUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Set;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class CsrfValidationFilter extends OncePerRequestFilter {

    private static final String CSRF_HEADER = "X-CSRF-Token";
    private static final Set<String> SAFE_METHODS = Set.of("GET", "HEAD", "OPTIONS", "TRACE");

    @Override
    protected void doFilterInternal(
            HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        if (SAFE_METHODS.contains(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }
        String path = request.getRequestURI();
        if (isCsrfExempt(path)) {
            filterChain.doFilter(request, response);
            return;
        }
        Cookie[] cookies = request.getCookies();
        String cookieToken = CookieUtils.readCookieValue(cookies, CookieNames.CSRF);
        String headerToken = request.getHeader(CSRF_HEADER);
        if (cookieToken == null
                || cookieToken.isBlank()
                || headerToken == null
                || !cookieToken.equals(headerToken)) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "CSRF token missing or invalid");
            return;
        }
        filterChain.doFilter(request, response);
    }

    private boolean isCsrfExempt(String path) {
        return path.startsWith("/api/health")
                || path.startsWith("/swagger-ui")
                || path.startsWith("/v3/api-docs")
                || path.equals("/api/auth/register")
                || path.equals("/api/auth/otp/request")
                || path.equals("/api/auth/otp/verify");
    }
}