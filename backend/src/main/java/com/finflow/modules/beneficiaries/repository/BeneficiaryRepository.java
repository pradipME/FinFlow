package com.finflow.modules.beneficiaries.repository;

import com.finflow.modules.beneficiaries.domain.Beneficiary;
import com.finflow.modules.beneficiaries.domain.BeneficiaryStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface BeneficiaryRepository extends JpaRepository<Beneficiary, UUID> {

    @Query("SELECT b FROM Beneficiary b WHERE b.ownerId = :ownerId AND b.isDeleted = false ORDER BY b.createdAt DESC")
    Page<Beneficiary> findByOwnerId(@Param("ownerId") String ownerId, Pageable pageable);

    @Query("SELECT b FROM Beneficiary b WHERE b.ownerId = :ownerId AND b.beneficiaryStatus = :status AND b.isDeleted = false")
    Page<Beneficiary> findByOwnerIdAndStatus(@Param("ownerId") String ownerId,
                                              @Param("status") BeneficiaryStatus status,
                                              Pageable pageable);

    @Query("SELECT b FROM Beneficiary b WHERE b.id = :id AND b.ownerId = :ownerId AND b.isDeleted = false")
    Optional<Beneficiary> findByIdAndOwnerId(@Param("id") UUID id, @Param("ownerId") String ownerId);

    boolean existsByOwnerIdAndAccountNumberAndIsDeletedFalse(String ownerId, String accountNumber);

    @Query("SELECT b FROM Beneficiary b WHERE b.ownerId = :ownerId AND b.beneficiaryName LIKE %:search% AND b.isDeleted = false")
    Page<Beneficiary> searchByName(@Param("ownerId") String ownerId, @Param("search") String search, Pageable pageable);

    long countByOwnerIdAndIsDeletedFalse(String ownerId);
}
