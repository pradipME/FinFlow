Start-Sleep -Seconds 5

Write-Host "=== Customer Login ==="
$body = '{"identifier":"demo3@finflow.com","password":"Customer@1111"}'
try {
    $r = Invoke-WebRequest -Uri 'http://localhost:8080/api/v1/auth/login' -Method POST -ContentType 'application/json' -Body $body -TimeoutSec 10 -UseBasicParsing
    Write-Host "STATUS: $($r.StatusCode)"
    $json = $r.Content | ConvertFrom-Json
    $cjwt = $json.data.accessToken
    Write-Host "Customer JWT obtained"
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
    $cjwt = $null
}

if (-not $cjwt) {
    Write-Host "No customer JWT. Trying customer1@finflow.com"
    $body = '{"identifier":"customer1@finflow.com","password":"Customer@1111"}'
    try {
        $r = Invoke-WebRequest -Uri 'http://localhost:8080/api/v1/auth/login' -Method POST -ContentType 'application/json' -Body $body -TimeoutSec 10 -UseBasicParsing
        Write-Host "STATUS: $($r.StatusCode)"
        $json = $r.Content | ConvertFrom-Json
        $cjwt = $json.data.accessToken
    } catch {
        Write-Host "ERROR: $($_.Exception.Message)"
    }
}

Write-Host "`n=== Admin Login ==="
$body = '{"identifier":"admin@gmail.com","password":"Admin@1111"}'
$r = Invoke-WebRequest -Uri 'http://localhost:8080/api/v1/auth/login' -Method POST -ContentType 'application/json' -Body $body -TimeoutSec 10 -UseBasicParsing
$json = $r.Content | ConvertFrom-Json
$ajwt = $json.data.accessToken
Write-Host "Admin JWT obtained"

$adminHeaders = @{ "Authorization" = "Bearer $ajwt" }

Write-Host "`n=== Customer 403 Test ==="
Write-Host "Customer JWT obtained: $($null -ne $cjwt)"
if ($cjwt) {
    $custHeaders = @{ "Authorization" = "Bearer $cjwt" }
    $fundBody = '{"amountCents":10000,"description":"Customer self-fund test"}'
    try {
        $r = Invoke-WebRequest -Uri "http://localhost:8080/api/v1/admin/accounts/71414a34-5bb7-424c-a6e5-dd17d1901e83/fund" -Method POST -ContentType 'application/json' -Body $fundBody -Headers $custHeaders -TimeoutSec 10 -UseBasicParsing
        Write-Host "STATUS: $($r.StatusCode) - UNEXPECTED! Should be 403"
    } catch {
        $resp = $_.Exception.Response
        if ($resp) {
            $code = [int]$resp.StatusCode
            Write-Host "STATUS: $code"
            if ($code -eq 403) {
                Write-Host "PASS: Customer correctly denied (403)"
            } else {
                Write-Host "UNEXPECTED STATUS: $code"
            }
            $sr = New-Object System.IO.StreamReader($resp.GetResponseStream())
            Write-Host "BODY: $($sr.ReadToEnd())"
        } else {
            Write-Host "ERROR: $($_.Exception.Message)"
        }
    }
} else {
    Write-Host "SKIPPED: No customer JWT available"
}

Write-Host "`n=== Admin Dashboard ==="
try {
    $r = Invoke-WebRequest -Uri 'http://localhost:8080/api/v1/admin/dashboard' -Headers $adminHeaders -TimeoutSec 10 -UseBasicParsing
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
