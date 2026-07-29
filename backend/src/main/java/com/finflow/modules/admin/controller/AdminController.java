package com.finflow.modules.admin.controller;

import com.finflow.modules.admin.dto.AdminDashboardResponse;
import com.finflow.modules.admin.dto.AuditLogResponse;
import com.finflow.modules.admin.dto.UserManagementResponse;
import com.finflow.modules.admin.service.AdminService;
import com.finflow.shared.dto.ApiResponse;
import com.finflow.shared.dto.PageResponse;
import com.finflow.shared.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin")
@Tag(name = "Admin", description = "Platform administration endpoints")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/audit-logs")
    @Operation(summary = "List all audit logs")
    public ResponseEntity<ApiResponse<PageResponse<AuditLogResponse>>> getAuditLogs(
            @PageableDefault(page = 0, size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getAuditLogs(pageable)));
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get admin dashboard statistics")
    public ResponseEntity<ApiResponse<AdminDashboardResponse>> getDashboard() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getDashboardStats()));
    }

    @GetMapping("/users")
    @Operation(summary = "List users for management")
    public ResponseEntity<ApiResponse<PageResponse<UserManagementResponse>>> getUsers(
            @PageableDefault(page = 0, size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getUserList(pageable)));
    }
}
