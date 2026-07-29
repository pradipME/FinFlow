package com.finflow.modules.accounts.dto;

import com.finflow.modules.accounts.domain.AccountStatus;
import com.finflow.modules.accounts.domain.AccountType;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Request body for updating an account")
public record UpdateAccountRequest(
    @Schema(description = "New nickname", example = "My Updated Account")
    String nickname,

    @Schema(description = "New account type")
    AccountType accountType
) {}
