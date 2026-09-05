package com.finflow.modules.accounts.repository;

import com.finflow.modules.accounts.domain.Account;
import com.finflow.modules.accounts.domain.AccountStatus;
import com.finflow.modules.accounts.domain.AccountType;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AccountRepository extends JpaRepository<Account, UUID> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT a FROM Account a WHERE a.id = :id AND a.isDeleted = false")
    Optional<Account> findByIdAndLock(@Param("id") UUID id);

    @Query("SELECT a FROM Account a WHERE a.ownerId = :ownerId AND a.isDeleted = false")
    Page<Account> findByOwnerId(@Param("ownerId") String ownerId, Pageable pageable);

    @Query("SELECT a FROM Account a WHERE a.ownerId = :ownerId AND a.accountStatus = :status AND a.isDeleted = false")
    Page<Account> findByOwnerIdAndStatus(@Param("ownerId") String ownerId,
                                         @Param("status") AccountStatus status,
                                         Pageable pageable);

    @Query("SELECT a FROM Account a WHERE a.ownerId = :ownerId AND a.accountType = :type AND a.isDeleted = false")
    Page<Account> findByOwnerIdAndType(@Param("ownerId") String ownerId,
                                       @Param("type") AccountType type,
                                       Pageable pageable);

    @Query("SELECT a FROM Account a WHERE a.ownerId = :ownerId AND a.accountType = :type AND a.accountStatus = :status AND a.isDeleted = false")
    Page<Account> findByOwnerIdAndTypeAndStatus(@Param("ownerId") String ownerId,
                                                @Param("type") AccountType type,
                                                @Param("status") AccountStatus status,
                                                Pageable pageable);

    Optional<Account> findByAccountNumberAndIsDeletedFalse(String accountNumber);

    boolean existsByAccountNumber(String accountNumber);

    @Query("SELECT a FROM Account a WHERE a.id = :id AND a.isDeleted = false")
    Optional<Account> findByIdAndIsDeletedFalse(@Param("id") UUID id);

    @Query("SELECT COUNT(a) FROM Account a WHERE a.ownerId = :ownerId AND a.isDeleted = false")
    long countByOwnerId(@Param("ownerId") String ownerId);

    @Query("SELECT COALESCE(SUM(a.availableBalanceCents), 0) FROM Account a WHERE a.isDeleted = false")
    long sumAvailableBalanceCents();

    long countByAccountStatusAndIsDeletedFalse(AccountStatus status);
}
