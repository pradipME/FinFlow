package com.finflow.modules.beneficiaries.mapper;

import com.finflow.modules.beneficiaries.domain.Beneficiary;
import com.finflow.modules.beneficiaries.domain.BeneficiaryStatus;
import com.finflow.modules.beneficiaries.dto.BeneficiaryResponse;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-09-01T21:20:05+0530",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class BeneficiaryMapperImpl implements BeneficiaryMapper {

    @Override
    public BeneficiaryResponse toResponse(Beneficiary beneficiary) {
        if ( beneficiary == null ) {
            return null;
        }

        String id = null;
        String nickname = null;
        String beneficiaryName = null;
        String email = null;
        String bankName = null;
        String accountNumber = null;
        String routingNumber = null;
        String iban = null;
        String swiftCode = null;
        String currency = null;
        BeneficiaryStatus beneficiaryStatus = null;
        String createdAt = null;
        String updatedAt = null;

        if ( beneficiary.getId() != null ) {
            id = beneficiary.getId().toString();
        }
        nickname = beneficiary.getNickname();
        beneficiaryName = beneficiary.getBeneficiaryName();
        email = beneficiary.getEmail();
        bankName = beneficiary.getBankName();
        accountNumber = beneficiary.getAccountNumber();
        routingNumber = beneficiary.getRoutingNumber();
        iban = beneficiary.getIban();
        swiftCode = beneficiary.getSwiftCode();
        currency = beneficiary.getCurrency();
        beneficiaryStatus = beneficiary.getBeneficiaryStatus();
        createdAt = formatDateTime( beneficiary.getCreatedAt() );
        updatedAt = formatDateTime( beneficiary.getUpdatedAt() );

        BeneficiaryResponse beneficiaryResponse = new BeneficiaryResponse( id, nickname, beneficiaryName, email, bankName, accountNumber, routingNumber, iban, swiftCode, currency, beneficiaryStatus, createdAt, updatedAt );

        return beneficiaryResponse;
    }

    @Override
    public List<BeneficiaryResponse> toResponseList(List<Beneficiary> beneficiaries) {
        if ( beneficiaries == null ) {
            return null;
        }

        List<BeneficiaryResponse> list = new ArrayList<BeneficiaryResponse>( beneficiaries.size() );
        for ( Beneficiary beneficiary : beneficiaries ) {
            list.add( toResponse( beneficiary ) );
        }

        return list;
    }
}
