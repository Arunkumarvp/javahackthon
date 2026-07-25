package com.hackathon.aiguardian.config;

import com.hackathon.aiguardian.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * SecurityConfig
 *
 * Purpose: Spring Security configuration for the AI Financial Guardian REST API.
 *
 * Responsibilities:
 * - Configure CORS to allow the Vite frontend (localhost:5173).
 * - Disable CSRF for the stateless REST API.
 * - Permit /api/auth/** endpoints without authentication.
 * - Protect all other API endpoints via Bearer token validation using TokenAuthFilter.
 * - Provide BCryptPasswordEncoder bean for password hashing.
 *
 * Dependencies:
 * - UserRepository (for token-to-user lookup)
 * - Spring Security
 *
 * Security Considerations:
 * - No JWT or OAuth (per BackendEngineer skill constraint) — uses simple UUID Bearer tokens stored in DB.
 * - Session is stateless; Spring Security session creation is disabled.
 * - Sensitive auth failure messages are kept deliberately vague to prevent user enumeration.
 */
@Slf4j
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserRepository userRepository;

    /**
     * Configures the main security filter chain.
     *
     * @param http HttpSecurity builder
     * @return Configured SecurityFilterChain
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/h2-console/**").permitAll()
                .requestMatchers("/actuator/health").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(tokenAuthFilter(), UsernamePasswordAuthenticationFilter.class)
            // Allow H2 console to render in frames (dev only)
            .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()));

        return http.build();
    }

    /**
     * Creates the Bearer token authentication filter.
     *
     * @return TokenAuthFilter instance
     */
    @Bean
    public TokenAuthFilter tokenAuthFilter() {
        return new TokenAuthFilter(userRepository);
    }

    /**
     * BCrypt password encoder — strength factor 12 for production-grade hashing.
     *
     * @return BCryptPasswordEncoder
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    /**
     * CORS configuration: allows the Vite dev server and local backend origins.
     *
     * @return CorsConfigurationSource
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(
            "http://localhost:5173",  // Vite dev server
            "http://localhost:3000",  // Alternative dev server
            "http://localhost:8080"   // Spring Boot self
        ));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }

    // =====================================================================
    // Inner class: TokenAuthFilter
    // =====================================================================

    /**
     * TokenAuthFilter
     *
     * Purpose: Validates Bearer tokens on every incoming HTTP request.
     *
     * Responsibilities:
     * - Extract the Bearer token from the Authorization header.
     * - Lookup the corresponding User in the database by sessionToken.
     * - Populate the Spring Security context with the authenticated principal.
     *
     * Security Considerations:
     * - Tokens are UUIDs generated server-side — not predictable.
     * - Invalid or missing tokens simply leave the SecurityContext empty,
     *   causing protected endpoints to return 403 automatically.
     */
    @Slf4j
    @RequiredArgsConstructor
    public static class TokenAuthFilter extends OncePerRequestFilter {

        private final UserRepository userRepository;

        @Override
        protected void doFilterInternal(HttpServletRequest request,
                                        HttpServletResponse response,
                                        FilterChain filterChain) throws ServletException, IOException {
            String authHeader = request.getHeader("Authorization");

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7).trim();

                userRepository.findBySessionToken(token).ifPresent(user -> {
                    UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(user, null, List.of());
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    log.debug("[TokenAuthFilter] Authenticated user: {}", user.getUsername());
                });
            }

            filterChain.doFilter(request, response);
        }
    }
}
