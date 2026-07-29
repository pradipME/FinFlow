package com.finflow.modules.transfers.repository;

import com.finflow.modules.transfers.domain.ScheduleStatus;
import com.finflow.modules.transfers.domain.TransferTemplate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TransferTemplateRepository extends JpaRepository<TransferTemplate, UUID> {

    @Query("SELECT t FROM TransferTemplate t WHERE t.ownerId = :ownerId ORDER BY t.createdAt DESC")
    Page<TransferTemplate> findByOwnerId(@Param("ownerId") String ownerId, Pageable pageable);

    @Query("SELECT t FROM TransferTemplate t WHERE t.id = :id AND t.ownerId = :ownerId")
    Optional<TransferTemplate> findByIdAndOwnerId(@Param("id") UUID id, @Param("ownerId") String ownerId);

    long countByOwnerId(String ownerId);
}
