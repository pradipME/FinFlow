package com.finflow.modules.transfers.repository;

import com.finflow.modules.transfers.domain.ScheduleStatus;
import com.finflow.modules.transfers.domain.ScheduledTransfer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ScheduledTransferRepository extends JpaRepository<ScheduledTransfer, UUID> {

    @Query("SELECT s FROM ScheduledTransfer s WHERE s.ownerId = :ownerId ORDER BY s.createdAt DESC")
    Page<ScheduledTransfer> findByOwnerId(@Param("ownerId") String ownerId, Pageable pageable);

    @Query("SELECT s FROM ScheduledTransfer s WHERE s.id = :id AND s.ownerId = :ownerId")
    Optional<ScheduledTransfer> findByIdAndOwnerId(@Param("id") UUID id, @Param("ownerId") String ownerId);

    @Query("SELECT s FROM ScheduledTransfer s WHERE s.scheduleStatus = 'ACTIVE' AND s.nextExecution <= :now")
    List<ScheduledTransfer> findDueTransfers(@Param("now") LocalDateTime now);

    long countByOwnerIdAndScheduleStatus(String ownerId, ScheduleStatus status);
}
