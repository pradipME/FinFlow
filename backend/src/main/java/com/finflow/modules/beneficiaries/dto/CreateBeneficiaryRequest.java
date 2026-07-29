package com.finflow.modules.beneficiaries.dto;

import com.finflow.modules.beneficiaries.domain.BeneficiaryStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Request body for creating a beneficiary")
public record CreateBeneficiaryRequest(
    @NotBlank(message = "Beneficiary name is required")
    @Schema(description = "Beneficiary name", example = "John Doe")
    String beneficiaryName,

    @Schema(description = "Nickname", example = "My Friend")
    String nickname,

    @Schema(description = "Email address")
    String email,

    @Schema(description = "Bank name", example = "Chase Bank")
    String bankName,

    @NotBlank(message = "Account number is required")
    @Schema(description = "Account number", example = "1234567890")
    String accountNumber,

    @Schema(description = "Routing number", example = "021000021")
    String routingNumber,

    @Schema(description = "IBAN", example = "GB29NWBK60161331926819")
    String iban,

    @Schema(description = "SWIFT code", example = "CHASUS33")
    String swiftCode,

    @Schema(description = "Currency code", example = "USD")
    String currency
) {}
