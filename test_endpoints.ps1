Start-Sleep -Seconds 45
Write-Host "=== 1. Health Check ==="
try {
    $r = Invoke-WebRequest -Uri 'http://localhost:8080/actuator/health' -TimeoutSec 10 -UseBasicParsing
    Write-Host "STATUS: $($r.StatusCode)"
    Write-Host "BODY: $($r.Content)"
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
}

Write-Host "`n=== 2. Admin Login ==="
$body = '{"identifier":"admin@gmail.com","password":"Admin@1111"}'
try {
    $r = Invoke-WebRequest -Uri 'http://localhost:8080/api/v1/auth/login' -Method POST -ContentType 'application/json' -Body $body -TimeoutSec 10 -UseBasicParsing
    Write-Host "STATUS: $($r.StatusCode)"
    $json = $r.Content | ConvertFrom-Json
    $jwt = $json.data.accessToken
    Write-Host "JWT: $($jwt.Substring(0, [Math]::Min(50, $jwt.Length)))..."
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
    $jwt = $null
}

if (-not $jwt) {
    Write-Host "No JWT obtained. Exiting."
    exit 1
}

$headers = @{ "Authorization" = "Bearer $jwt" }

Write-Host "`n=== 3. GET /api/v1/admin/users/50025a5a-0f81-4944-8ecb-7e9e81cdd2f4 ==="
try {
    $r = Invoke-WebRequest -Uri 'http://localhost:8080/api/v1/admin/users/50025a5a-0f81-4944-8ecb-7e9e81cdd2f4' -Headers $headers -TimeoutSec 10 -UseBasicParsing
    Write-Host "STATUS: $($r.StatusCode)"
    Write-Host "BODY: $($r.Content)"
} catch {
    $resp = $_.Exception.Response
    if ($resp) {
        Write-Host "STATUS: $([int]$resp.StatusCode)"
        $sr = New-Object System.IO.StreamReader($resp.GetResponseStream())
        Write-Host "BODY: $($sr.ReadToEnd())"
    } else {
        Write-Host "ERROR: $($_.Exception.Message)"
    }
}

Write-Host "`n=== 4. GET /api/v1/admin/users/50025a5a-0f81-4944-8ecb-7e9e81cdd2f4/cards ==="
try {
    $r = Invoke-WebRequest -Uri 'http://localhost:8080/api/v1/admin/users/50025a5a-0f81-4944-8ecb-7e9e81cdd2f4/cards' -Headers $headers -TimeoutSec 10 -UseBasicParsing
    Write-Host "STATUS: $($r.StatusCode)"
    Write-Host "BODY: $($r.Content)"
} catch {
    $resp = $_.Exception.Response
    if ($resp) {
        Write-Host "STATUS: $([int]$resp.StatusCode)"
        $sr = New-Object System.IO.StreamReader($resp.GetResponseStream())
        Write-Host "BODY: $($sr.ReadToEnd())"
    } else {
        Write-Host "ERROR: $($_.Exception.Message)"
    }
}

Write-Host "`n=== 5. GET /api/v1/admin/accounts ==="
$accountId = $null
try {
    $r = Invoke-WebRequest -Uri 'http://localhost:8080/api/v1/admin/accounts?page=0&size=10' -Headers $headers -TimeoutSec 10 -UseBasicParsing
    Write-Host "STATUS: $($r.StatusCode)"
    Write-Host "BODY: $($r.Content)"
    $acctJson = $r.Content | ConvertFrom-Json
    if ($acctJson.data.content -and $acctJson.data.content.Count -gt 0) {
        foreach ($a in $acctJson.data.content) {
            $ownerMatch = $false
            if ($a.ownerId -eq '50025a5a-0f81-4944-8ecb-7e9e81cdd2f4') { $ownerMatch = $true }
            if ($a.owner_id -eq '50025a5a-0f81-4944-8ecb-7e9e81cdd2f4') { $ownerMatch = $true }
            if ($ownerMatch -and -not $accountId) {
                $accountId = $a.id
                if (-not $accountId) { $accountId = $a.id }
            }
        }
        if (-not $accountId) {
            $accountId = $acctJson.data.content[0].id
            if (-not $accountId) { $accountId = $acctJson.data.content[0].id }
        }
        Write-Host "SELECTED ACCOUNT ID: $accountId"
    }
} catch {
    $resp = $_.Exception.Response
    if ($resp) {
        Write-Host "STATUS: $([int]$resp.StatusCode)"
        $sr = New-Object System.IO.StreamReader($resp.GetResponseStream())
        Write-Host "BODY: $($sr.ReadToEnd())"
    } else {
        Write-Host "ERROR: $($_.Exception.Message)"
    }
}

if (-not $accountId) {
    Write-Host "No account found. Cannot continue funding test."
    exit 1
}

Write-Host "`n=== 6. GET /api/v1/admin/accounts/$accountId (before fund) ==="
$balanceBefore = 0
try {
    $r = Invoke-WebRequest -Uri "http://localhost:8080/api/v1/admin/accounts/$accountId" -Headers $headers -TimeoutSec 10 -UseBasicParsing
    Write-Host "STATUS: $($r.StatusCode)"
    Write-Host "BODY: $($r.Content)"
    $acctDetail = $r.Content | ConvertFrom-Json
    $balanceBefore = $acctDetail.availableBalanceCents
    if (-not $balanceBefore) { $balanceBefore = $acctDetail.available_balance_cents }
    if (-not $balanceBefore) { $balanceBefore = 0 }
    Write-Host "BALANCE BEFORE: $balanceBefore"
} catch {
    $resp = $_.Exception.Response
    if ($resp) {
        Write-Host "STATUS: $([int]$resp.StatusCode)"
        $sr = New-Object System.IO.StreamReader($resp.GetResponseStream())
        Write-Host "BODY: $($sr.ReadToEnd())"
    } else {
        Write-Host "ERROR: $($_.Exception.Message)"
    }
}

Write-Host "`n=== 7. POST /api/v1/admin/accounts/$accountId/fund ==="
$fundBody = '{"amountCents":10000,"description":"Admin funding verification"}'
try {
    $r = Invoke-WebRequest -Uri "http://localhost:8080/api/v1/admin/accounts/$accountId/fund" -Method POST -ContentType 'application/json' -Body $fundBody -Headers $headers -TimeoutSec 10 -UseBasicParsing
    Write-Host "STATUS: $($r.StatusCode)"
    Write-Host "BODY: $($r.Content)"
} catch {
    $resp = $_.Exception.Response
    if ($resp) {
        Write-Host "STATUS: $([int]$resp.StatusCode)"
        $sr = New-Object System.IO.StreamReader($resp.GetResponseStream())
        Write-Host "BODY: $($sr.ReadToEnd())"
    } else {
        Write-Host "ERROR: $($_.Exception.Message)"
    }
}

Write-Host "`n=== 8. GET /api/v1/admin/accounts/$accountId (after fund) ==="
try {
    $r = Invoke-WebRequest -Uri "http://localhost:8080/api/v1/admin/accounts/$accountId" -Headers $headers -TimeoutSec 10 -UseBasicParsing
    Write-Host "STATUS: $($r.StatusCode)"
    Write-Host "BODY: $($r.Content)"
    $acctDetail = $r.Content | ConvertFrom-Json
    $balanceAfter = $acctDetail.availableBalanceCents
    if (-not $balanceAfter) { $balanceAfter = $acctDetail.available_balance_cents }
    if (-not $balanceAfter) { $balanceAfter = 0 }
    Write-Host "BALANCE AFTER: $balanceAfter"
    Write-Host "BALANCE INCREASE: $($balanceAfter - $balanceBefore)"
} catch {
    $resp = $_.Exception.Response
    if ($resp) {
        Write-Host "STATUS: $([int]$resp.StatusCode)"
        $sr = New-Object System.IO.StreamReader($resp.GetResponseStream())
        Write-Host "BODY: $($sr.ReadToEnd())"
    } else {
        Write-Host "ERROR: $($_.Exception.Message)"
    }
}

Write-Host "`n=== 9. GET /api/v1/admin/transactions ==="
try {
    $r = Invoke-WebRequest -Uri 'http://localhost:8080/api/v1/admin/transactions?page=0&size=10' -Headers $headers -TimeoutSec 10 -UseBasicParsing
    Write-Host "STATUS: $($r.StatusCode)"
    Write-Host "BODY: $($r.Content)"
} catch {
    $resp = $_.Exception.Response
    if ($resp) {
        Write-Host "STATUS: $([int]$resp.StatusCode)"
        $sr = New-Object System.IO.StreamReader($resp.GetResponseStream())
        Write-Host "BODY: $($sr.ReadToEnd())"
    } else {
        Write-Host "ERROR: $($_.Exception.Message)"
    }
}

Write-Host "`n=== 10. GET /api/v1/admin/audit-logs ==="
try {
    $r = Invoke-WebRequest -Uri 'http://localhost:8080/api/v1/admin/audit-logs?page=0&size=10' -Headers $headers -TimeoutSec 10 -UseBasicParsing
    Write-Host "STATUS: $($r.StatusCode)"
    Write-Host "BODY: $($r.Content)"
} catch {
    $resp = $_.Exception.Response
    if ($resp) {
        Write-Host "STATUS: $([int]$resp.StatusCode)"
        $sr = New-Object System.IO.StreamReader($resp.GetResponseStream())
        Write-Host "BODY: $($sr.ReadToEnd())"
    } else {
        Write-Host "ERROR: $($_.Exception.Message)"
    }
}

Write-Host "`n=== DONE ==="
