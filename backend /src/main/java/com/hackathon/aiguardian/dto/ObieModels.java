package com.hackathon.aiguardian.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

/**
 * ObieModels
 *
 * Purpose: Data Transfer Objects representing OBIE AISP v4.0 JSON structures
 * matching the Hackathon Mock Bank Postman collection.
 */
public class ObieModels {

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class TokenResponse {
        @JsonProperty("access_token")
        private String accessToken;

        @JsonProperty("refresh_token")
        private String refreshToken;

        @JsonProperty("expires_in")
        private Integer expiresIn;

        @JsonProperty("token_type")
        private String tokenType;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AccountListResponse {
        @JsonProperty("Data")
        private AccountData data;

        @Data
        @JsonIgnoreProperties(ignoreUnknown = true)
        public static class AccountData {
            @JsonProperty("Account")
            private List<AccountDto> account;
        }

        @Data
        @JsonIgnoreProperties(ignoreUnknown = true)
        public static class AccountDto {
            @JsonProperty("AccountId")
            private String accountId;

            @JsonProperty("Nickname")
            private String nickname;

            @JsonProperty("Status")
            private String status;

            @JsonProperty("AccountCategory")
            private String accountCategory;

            @JsonProperty("Currency")
            private String currency;
        }
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class BalanceListResponse {
        @JsonProperty("Data")
        private BalanceData data;

        @Data
        @JsonIgnoreProperties(ignoreUnknown = true)
        public static class BalanceData {
            @JsonProperty("Balance")
            private List<BalanceDto> balance;
        }

        @Data
        @JsonIgnoreProperties(ignoreUnknown = true)
        public static class BalanceDto {
            @JsonProperty("AccountId")
            private String accountId;

            @JsonProperty("Amount")
            private AmountDto amount;

            @JsonProperty("CreditDebitIndicator")
            private String creditDebitIndicator;

            @JsonProperty("Type")
            private String type;
        }
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class TransactionListResponse {
        @JsonProperty("Data")
        private TransactionData data;

        @Data
        @JsonIgnoreProperties(ignoreUnknown = true)
        public static class TransactionData {
            @JsonProperty("Transaction")
            private List<TransactionDto> transaction;
        }

        @Data
        @JsonIgnoreProperties(ignoreUnknown = true)
        public static class TransactionDto {
            @JsonProperty("AccountId")
            private String accountId;

            @JsonProperty("TransactionId")
            private String transactionId;

            @JsonProperty("TransactionReference")
            private String transactionReference;

            @JsonProperty("Amount")
            private AmountDto amount;

            @JsonProperty("CreditDebitIndicator")
            private String creditDebitIndicator;

            @JsonProperty("Status")
            private String status;

            @JsonProperty("BookingDateTime")
            private String bookingDateTime;

            @JsonProperty("TransactionInformation")
            private String transactionInformation;

            @JsonProperty("MerchantDetails")
            private MerchantDetailsDto merchantDetails;
        }
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AmountDto {
        @JsonProperty("Amount")
        private String amount;

        @JsonProperty("Currency")
        private String currency;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class MerchantDetailsDto {
        @JsonProperty("MerchantName")
        private String merchantName;

        @JsonProperty("MerchantCategoryCode")
        private String merchantCategoryCode;
    }
}
