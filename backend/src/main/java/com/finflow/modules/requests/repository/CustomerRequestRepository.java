package com.finflow.modules.requests.repository;

import com.finflow.modules.requests.domain.CustomerRequest;
import com.finflow.modules.requests.domain.CustomerRequestStatus;
import com.finflow.modules.requests.domain.CustomerRequestType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CustomerRequestRepository extends JpaRepository<CustomerRequest, UUID> {

    @Query("SELECT r FROM CustomerRequest r WHERE r.customerId = :customerId ORDER BY r.createdAt DESC")
    Page<CustomerRequest> findByCustomerId(@Param("customerId") String customerId, Pageable pageable);

    @Query("SELECT r FROM CustomerRequest r WHERE (:status IS NULL OR r.requestStatus = :status) ORDER BY r.createdAt ASC")
    Page<CustomerRequest> findByStatus(@Param("status") CustomerRequestStatus status, Pageable pageable);

    @Query("SELECT r FROM CustomerRequest r WHERE r.id = :id")
    Optional<CustomerRequest> findById(@Param("id") UUID id);

    long countByRequestStatus(CustomerRequestStatus status);

    long countByCustomerIdAndRequestStatus(String customerId, CustomerRequestStatus status);

    long countByRequestTypeAndRequestStatus(CustomerRequestType type, CustomerRequestStatus status);

    long countByRequestStatusAndCreatedAtGreaterThan(CustomerRequestStatus status, java.time.LocalDateTime createdAt);
}