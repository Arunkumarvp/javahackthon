package com.hackathon.aiguardian.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hackathon.aiguardian.dto.RecommendationDto;
import com.hackathon.aiguardian.dto.RecommendationsPageDto;
import com.hackathon.aiguardian.dto.SpendingLimitRequest;
import com.hackathon.aiguardian.model.SpendingLimitRule;
import com.hackathon.aiguardian.service.RecommendationService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(RecommendationsController.class)
@AutoConfigureMockMvc(addFilters = false)
class RecommendationsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private RecommendationService recommendationService;

    @Test
    @DisplayName("GET /api/recommendations returns 200 OK and paginated recommendations")
    void getRecommendations_Status200() throws Exception {
        RecommendationDto dto = RecommendationDto.builder()
            .id("rec_food_delivery")
            .title("Reduce Food Delivery Spending")
            .category("Food & Dining")
            .potentialSavings(new BigDecimal("45.00"))
            .build();

        RecommendationsPageDto pageDto = RecommendationsPageDto.builder()
            .content(List.of(dto))
            .page(0)
            .size(10)
            .totalElements(1)
            .totalPages(1)
            .build();

        when(recommendationService.getRecommendations(anyString(), anyString(), anyString(), any(), anyInt(), anyInt()))
            .thenReturn(pageDto);

        mockMvc.perform(get("/api/recommendations"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content[0].id").value("rec_food_delivery"))
            .andExpect(jsonPath("$.content[0].title").value("Reduce Food Delivery Spending"));
    }

    @Test
    @DisplayName("POST /api/recommendations/{id}/spending-limit returns 200 OK")
    void setSpendingLimit_Status200() throws Exception {
        SpendingLimitRule rule = SpendingLimitRule.builder()
            .id(1L)
            .recommendationId("rec_food_delivery")
            .category("Food & Dining")
            .monthlyLimit(new BigDecimal("150.00"))
            .build();

        when(recommendationService.setSpendingLimit(eq("rec_food_delivery"), any(SpendingLimitRequest.class)))
            .thenReturn(rule);

        SpendingLimitRequest request = new SpendingLimitRequest("Food & Dining", new BigDecimal("150.00"));

        mockMvc.perform(post("/api/recommendations/rec_food_delivery/spending-limit")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("ACTIVE"))
            .andExpect(jsonPath("$.category").value("Food & Dining"));
    }
}
