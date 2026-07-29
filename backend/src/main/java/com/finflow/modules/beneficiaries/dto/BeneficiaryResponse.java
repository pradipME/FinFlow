package com.finflow.modules.beneficiaries.dto;

import com.finflow.modules.beneficiaries.domain.BeneficiaryStatus;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Beneficiary response DTO")
public record BeneficiaryResponse(
    @Schema(description = "Beneficiary ID")
    String id,

    @Schema(description = "Nickname")
    String nickname,

    @Schema(description = "Beneficiary name")
    String beneficiaryName,

    @Schema(description = "Email")
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
    String currency,

    @Schema(description = "Beneficiary status")
    BeneficiaryStatus beneficiaryStatus,

    @Schema(description = "Created timestamp")
    String createdAt,

    @Schema(description = "Updated timestamp")
    String updatedAt
) {}
