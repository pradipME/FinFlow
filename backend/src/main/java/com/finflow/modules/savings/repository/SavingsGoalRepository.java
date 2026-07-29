package com.finflow.modules.savings.repository;

import com.finflow.modules.savings.domain.SavingsGoal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SavingsGoalRepository extends JpaRepository<SavingsGoal, UUID> {

    @Query("SELECT s FROM SavingsGoal s WHERE s.ownerId = :ownerId ORDER BY s.createdAt DESC")
    Page<SavingsGoal> findByOwnerId(@Param("ownerId") String ownerId, Pageable pageable);

    @Query("SELECT s FROM SavingsGoal s WHERE s.id = :id AND s.ownerId = :ownerId")
    Optional<SavingsGoal> findByIdAndOwnerId(@Param("id") UUID id, @Param("ownerId") String ownerId);

    long countByOwnerId(String ownerId);
}
