package com.finflow.modules.beneficiaries.mapper;

import com.finflow.modules.beneficiaries.domain.Beneficiary;
import com.finflow.modules.beneficiaries.dto.BeneficiaryResponse;
import org.mapstruct.Mapper;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Mapper(componentModel = "spring")
public interface BeneficiaryMapper {

    DateTimeFormatter FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    BeneficiaryResponse toResponse(Beneficiary beneficiary);

    List<BeneficiaryResponse> toResponseList(List<Beneficiary> beneficiaries);

    default String formatDateTime(LocalDateTime dateTime) {
        if (dateTime == null) return null;
        return dateTime.format(FORMATTER);
    }
}
