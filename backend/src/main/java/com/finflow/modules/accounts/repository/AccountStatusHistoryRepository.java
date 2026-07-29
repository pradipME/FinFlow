package com.finflow.modules.accounts.repository;

import com.finflow.modules.accounts.domain.AccountStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AccountStatusHistoryRepository extends JpaRepository<AccountStatusHistory, Long> {

    @Query("SELECT ash FROM AccountStatusHistory ash WHERE ash.account.id = :accountId ORDER BY ash.changedAt DESC")
    List<AccountStatusHistory> findByAccountIdOrderByChangedAtDesc(@Param("accountId") UUID accountId);
}
