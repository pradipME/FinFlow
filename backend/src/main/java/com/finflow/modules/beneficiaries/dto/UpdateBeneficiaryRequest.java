package com.finflow.modules.beneficiaries.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Request body for updating a beneficiary")
public record UpdateBeneficiaryRequest(
    @Schema(description = "Beneficiary name")
    String beneficiaryName,

    @Schema(description = "Nickname")
    String nickname,

    @Schema(description = "Email address")
    String email,

    @Schema(description = "Bank name")
    String bankName,

    @Schema(description = "Account number")
    String accountNumber,

    @Schema(description = "Routing number")
    String routingNumber,

    @Schema(description = "IBAN")
    String iban,

    @Schema(description = "SWIFT code")
    String swiftCode,

    @Schema(description = "Currency code")
    String currency
) {}
