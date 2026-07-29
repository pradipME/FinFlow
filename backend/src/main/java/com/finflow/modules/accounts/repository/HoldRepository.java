package com.finflow.modules.accounts.repository;

import com.finflow.modules.accounts.domain.Hold;
import com.finflow.modules.accounts.domain.HoldStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface HoldRepository extends JpaRepository<Hold, UUID> {

    @Query("SELECT h FROM Hold h WHERE h.account.id = :accountId AND h.holdStatus = :status")
    List<Hold> findByAccountIdAndStatus(@Param("accountId") UUID accountId,
                                         @Param("status") HoldStatus status);

    @Query("SELECT h FROM Hold h WHERE h.account.id = :accountId AND h.holdStatus = 'ACTIVE'")
    List<Hold> findActiveHoldsByAccountId(@Param("accountId") UUID accountId);

    @Query("SELECT COALESCE(SUM(h.amountCents), 0) FROM Hold h WHERE h.account.id = :accountId AND h.holdStatus = 'ACTIVE'")
    Long sumActiveHoldAmountByAccountId(@Param("accountId") UUID accountId);

    @Query("SELECT h FROM Hold h WHERE h.holdStatus = 'ACTIVE' AND h.expiresAt IS NOT NULL AND h.expiresAt < :now")
    List<Hold> findExpiredActiveHolds(@Param("now") LocalDateTime now);
}
