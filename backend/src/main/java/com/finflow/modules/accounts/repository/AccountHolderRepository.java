package com.finflow.modules.accounts.repository;

import com.finflow.modules.accounts.domain.AccountHolder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AccountHolderRepository extends JpaRepository<AccountHolder, UUID> {

    @Query("SELECT ah FROM AccountHolder ah WHERE ah.account.id = :accountId")
    List<AccountHolder> findByAccountId(@Param("accountId") UUID accountId);

    @Query("SELECT ah FROM AccountHolder ah WHERE ah.userId = :userId")
    List<AccountHolder> findByUserId(@Param("userId") String userId);

    @Query("SELECT ah FROM AccountHolder ah WHERE ah.account.id = :accountId AND ah.userId = :userId")
    Optional<AccountHolder> findByAccountIdAndUserId(@Param("accountId") UUID accountId,
                                                     @Param("userId") String userId);

    @Query("SELECT CASE WHEN COUNT(ah) > 0 THEN true ELSE false END FROM AccountHolder ah WHERE ah.account.id = :accountId AND ah.userId = :userId")
    boolean existsByAccountIdAndUserId(@Param("accountId") UUID accountId,
                                       @Param("userId") String userId);
}
