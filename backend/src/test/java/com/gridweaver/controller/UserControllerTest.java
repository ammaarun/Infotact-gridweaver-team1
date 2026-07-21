package com.gridweaver.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gridweaver.dto.common.PagedResponse;
import com.gridweaver.dto.user.UserSummaryResponse;
import com.gridweaver.security.JwtTokenProvider;
import com.gridweaver.security.JwtAuthEntryPoint;
import com.gridweaver.security.JwtAccessDeniedHandler;
import com.gridweaver.security.CustomUserDetailsService;
import com.gridweaver.config.SecurityConfig;
import com.gridweaver.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doAnswer;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Controller-layer integration tests for {@link UserController}.
 *
 * <p>Uses {@link WebMvcTest} to load only the web layer (no full Spring context).
 * Security is tested via {@link WithMockUser} annotations.
 *
 * @author GridWeaver Team
 */
@WebMvcTest(UserController.class)
@Import(SecurityConfig.class)
@DisplayName("UserController Integration Tests")
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private JwtTokenProvider jwtTokenProvider;

    @MockitoBean
    private CustomUserDetailsService customUserDetailsService;

    @MockitoBean
    private JwtAuthEntryPoint jwtAuthEntryPoint;

    @MockitoBean
    private JwtAccessDeniedHandler jwtAccessDeniedHandler;

    @BeforeEach
    void setUp() throws Exception {
        // The mocked JwtAuthEntryPoint's commence() is a void no-op by default.
        // Stub it to actually send a 401 so unauthenticated-request tests work.
        doAnswer(invocation -> {
            var response = (jakarta.servlet.http.HttpServletResponse) invocation.getArgument(1);
            try {
                response.sendError(jakarta.servlet.http.HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
            } catch (java.io.IOException e) {
                throw new RuntimeException(e);
            }
            return null;
        }).when(jwtAuthEntryPoint).commence(any(), any(), any());
    }

    // -------------------------------------------------------------------------
    // GET /api/v1/users — ADMIN only
    // -------------------------------------------------------------------------

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("GET /api/v1/users — admin — returns paginated users")
    void listUsers_asAdmin_returnsPaginatedUsers() throws Exception {
        // Arrange
        UUID userId = UUID.randomUUID();
        UserSummaryResponse summary = new UserSummaryResponse(
            userId, "johndoe", "john@example.com", "John Doe", true);

        PagedResponse<UserSummaryResponse> pagedResponse = new PagedResponse<>(
            List.of(summary), 0, 20, 1, 1, true, true, false);

        given(userService.getAllUsers(any(), any(), any(), any(Pageable.class)))
            .willReturn(pagedResponse);

        // Act & Assert
        mockMvc.perform(get("/api/v1/users")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.content[0].username").value("johndoe"))
            .andExpect(jsonPath("$.data.total_elements").value(1));
    }

    @Test
    @WithMockUser(roles = "USER")
    @DisplayName("GET /api/v1/users — non-admin — returns 403 Forbidden")
    void listUsers_asUser_returns403() throws Exception {
        mockMvc.perform(get("/api/v1/users")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("GET /api/v1/users — unauthenticated — returns 401")
    void listUsers_unauthenticated_returns401() throws Exception {
        mockMvc.perform(get("/api/v1/users")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isUnauthorized());
    }
}
