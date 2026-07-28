package com.hackathon.aiguardian.service;

import com.hackathon.aiguardian.model.RecommendationEntity;
import com.hackathon.aiguardian.model.SavingsAccountOffer;
import com.hackathon.aiguardian.model.SubscriptionEntity;
import com.hackathon.aiguardian.repository.RecommendationRepository;
import com.hackathon.aiguardian.repository.SavingsAccountOfferRepository;
import com.hackathon.aiguardian.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * RecommendationDataSeeder
 *
 * Purpose: Startup seeder pre-populating recommendations, subscriptions, and savings offers.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class RecommendationDataSeeder implements ApplicationRunner {

    private final RecommendationRepository recommendationRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final SavingsAccountOfferRepository savingsAccountOfferRepository;

    @Override
    public void run(ApplicationArguments args) {
        seedRecommendations();
        seedSubscriptions();
        seedSavingsOffers();
    }

    private void seedRecommendations() {
        if (recommendationRepository.count() > 0) {
            return;
        }
        log.info("[RecommendationDataSeeder] Seeding demo recommendations...");

        List<RecommendationEntity> seeds = List.of(
            RecommendationEntity.builder()
                .id("rec_food_delivery")
                .type("SPENDING_ALERT")
                .title("Reduce Food Delivery Spending")
                .category("Food & Dining")
                .description("You spent 22% more on food delivery this month than your three-month average. Cutting back to your average could save you significantly.")
                .badge("Spending Alert")
                .badgeStyle("alert")
                .expectedBenefit("Potential savings: £45/month")
                .actionText("Set Limit")
                .applied(false)
                .potentialSavings(new BigDecimal("45.00"))
                .priority(1)
                .asOfDate(LocalDate.now())
                .percentChangeVsAverage(22)
                .build(),

            RecommendationEntity.builder()
                .id("rec_subscription_savings")
                .type("SUBSCRIPTION_SAVINGS")
                .title("Potential Subscription Savings")
                .category("Subscriptions")
                .description("We noticed you haven't used your 'CinemaMax' subscription in over 60 days. Cancelling it could save you £12.99 a month.")
                .badge("SAVINGS")
                .badgeStyle("success")
                .expectedBenefit("Save £12.99/month")
                .actionText("Review Subscriptions")
                .applied(false)
                .potentialSavings(new BigDecimal("12.99"))
                .priority(2)
                .asOfDate(LocalDate.now())
                .build(),

            RecommendationEntity.builder()
                .id("rec_savings_opportunity")
                .type("SAVINGS_OPPORTUNITY")
                .title("High-Interest Savings Opportunity")
                .category("Savings")
                .description("Your surplus cash in 'Current Account' is earning 0.1%. Moving £2,000 to a fixed saver at 4.5% AER could earn £90 extra this year.")
                .badge("OPPORTUNITY")
                .badgeStyle("info")
                .expectedBenefit("Potential: 4.5% AER (£90/year)")
                .actionText("Explore Accounts")
                .applied(false)
                .potentialSavings(new BigDecimal("90.00"))
                .priority(3)
                .asOfDate(LocalDate.now())
                .currentRate(new BigDecimal("0.10"))
                .potentialRate(new BigDecimal("4.50"))
                .surplusAmount(new BigDecimal("2000.00"))
                .build(),

            RecommendationEntity.builder()
                .id("rec_weekend_spike")
                .type("WEEKEND_SPIKE")
                .title("Recurring Weekend Spike")
                .category("Behavioural Alert")
                .description("Your spending consistently spikes by 40% on Sundays, primarily on retail and dining. Setting a weekend budget could save you £60/month.")
                .badge("RECURRING")
                .badgeStyle("alert")
                .expectedBenefit("Potential control: £60/month")
                .actionText("View Weekend Breakdown")
                .applied(false)
                .potentialSavings(new BigDecimal("60.00"))
                .priority(4)
                .asOfDate(LocalDate.now())
                .build(),

            RecommendationEntity.builder()
                .id("rec_surplus_reallocation")
                .type("SURPLUS_REALLOCATION")
                .title("Reallocate Surplus to Savings")
                .category("Budget Automation")
                .description("You are consistently £150 under budget in your 'Transport' category. Automating this surplus to savings could grow your pot by £1,800/year.")
                .badge("AUTOMATION")
                .badgeStyle("success")
                .expectedBenefit("Auto-Save: £150/month")
                .actionText("Create Auto-Transfer")
                .applied(false)
                .potentialSavings(new BigDecimal("150.00"))
                .priority(5)
                .asOfDate(LocalDate.now())
                .budgetUsedPercent(40)
                .fromCategory("transport")
                .build()
        );

        recommendationRepository.saveAll(seeds);
        log.info("[RecommendationDataSeeder] 5 recommendations seeded successfully.");
    }

    private void seedSubscriptions() {
        if (subscriptionRepository.count() > 0) {
            return;
        }
        log.info("[RecommendationDataSeeder] Seeding demo subscriptions...");

        List<SubscriptionEntity> seeds = List.of(
            SubscriptionEntity.builder()
                .id("sub_cinemamax")
                .name("CinemaMax")
                .monthlyCost(new BigDecimal("12.99"))
                .status("UNUSED")
                .lastUsedDate(LocalDate.now().minusDays(63))
                .category("Entertainment")
                .logoEmoji("🎬")
                .build(),

            SubscriptionEntity.builder()
                .id("sub_gamepass")
                .name("Xbox Game Pass")
                .monthlyCost(new BigDecimal("14.99"))
                .status("UNUSED")
                .lastUsedDate(LocalDate.now().minusDays(75))
                .category("Gaming")
                .logoEmoji("🎮")
                .build(),

            SubscriptionEntity.builder()
                .id("sub_spotify")
                .name("Spotify Premium")
                .monthlyCost(new BigDecimal("11.99"))
                .status("ACTIVE")
                .lastUsedDate(LocalDate.now().minusDays(1))
                .category("Music")
                .logoEmoji("🎵")
                .build(),

            SubscriptionEntity.builder()
                .id("sub_netflix")
                .name("Netflix Standard")
                .monthlyCost(new BigDecimal("15.99"))
                .status("ACTIVE")
                .lastUsedDate(LocalDate.now().minusDays(2))
                .category("Streaming")
                .logoEmoji("📺")
                .build(),

            SubscriptionEntity.builder()
                .id("sub_duolingo")
                .name("Duolingo Super")
                .monthlyCost(new BigDecimal("6.99"))
                .status("UNUSED")
                .lastUsedDate(LocalDate.now().minusDays(90))
                .category("Education")
                .logoEmoji("🦜")
                .build()
        );

        subscriptionRepository.saveAll(seeds);
        log.info("[RecommendationDataSeeder] 5 subscriptions seeded (3 unused, 2 active).");
    }

    private void seedSavingsOffers() {
        if (savingsAccountOfferRepository.count() > 0) {
            return;
        }
        log.info("[RecommendationDataSeeder] Seeding demo savings offers...");

        List<SavingsAccountOffer> seeds = List.of(
            SavingsAccountOffer.builder()
                .id("offer_marcus_12m")
                .provider("Marcus by Goldman Sachs")
                .rate(new BigDecimal("4.85"))
                .type("FIXED")
                .minDeposit(new BigDecimal("500.00"))
                .term("12 months")
                .badge("Best Rate")
                .build(),

            SavingsAccountOffer.builder()
                .id("offer_chase_easy")
                .provider("Chase UK")
                .rate(new BigDecimal("4.10"))
                .type("EASY_ACCESS")
                .minDeposit(new BigDecimal("1.00"))
                .term("No fixed term")
                .badge("FSCS Protected")
                .build(),

            SavingsAccountOffer.builder()
                .id("offer_nationwide_isa")
                .provider("Nationwide Building Society")
                .rate(new BigDecimal("4.50"))
                .type("ISA")
                .minDeposit(new BigDecimal("1.00"))
                .term("Tax-free")
                .badge("ISA Allowance")
                .build(),

            SavingsAccountOffer.builder()
                .id("offer_atom_1yr")
                .provider("Atom Bank")
                .rate(new BigDecimal("4.75"))
                .type("FIXED")
                .minDeposit(new BigDecimal("50.00"))
                .term("12 months")
                .badge("No Penalty")
                .build()
        );

        savingsAccountOfferRepository.saveAll(seeds);
        log.info("[RecommendationDataSeeder] 4 savings offers seeded.");
    }
}
