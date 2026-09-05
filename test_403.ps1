Start-Sleep -Seconds 3

Write-Host "=== Admin Login ==="
$body = '{"identifier":"admin@gmail.com","password":"Admin@1111"}'
$r = Invoke-WebRequest -Uri 'http://localhost:8080/api/v1/auth/login' -Method POST -ContentType 'application/json' -Body $body -TimeoutSec 10 -UseBasicParsing
$json = $r.Content | ConvertFrom-Json
$ajwt = $json.data.accessToken
$adminHeaders = @{ "Authorization" = "Bearer $ajwt" }
Write-Host "Admin JWT obtained"

Write-Host "`n=== Create New Customer via Admin API ==="
$custBody = '{"email":"testverify403@finflow.com","phoneNumber":"+1555000099","username":"testverify403","password":"Verify403@1111"}'
try {
    $r = Invoke-WebRequest -Uri 'http://localhost:8080/api/v1/admin/customers' -Method POST -ContentType 'application/json' -Body $custBody -Headers $adminHeaders -TimeoutSec 10 -UseBasicParsing
    Write-Host "STATUS: $($r.StatusCode)"
    Write-Host "BODY: $($r.Content)"
    $custJson = $r.Content | ConvertFrom-Json
    $newCustId = $custJson.data.id
    Write-Host "New customer ID: $newCustId"
} catch {
    $resp = $_.Exception.Response
    if ($resp) {
        Write-Host "STATUS: $([int]$resp.StatusCode)"
        $sr = New-Object System.IO.StreamReader($resp.GetResponseStream())
        $errBody = $sr.ReadToEnd()
        Write-Host "BODY: $errBody"
        if ($errBody -match 'already exists') {
            Write-Host "Customer already exists, trying login..."
        }
    } else {
        Write-Host "ERROR: $($_.Exception.Message)"
    }
}

Write-Host "`n=== Login as New Customer ==="
$custLoginBody = '{"identifier":"testverify403@finflow.com","password":"Verify403@1111"}'
try {
    $r = Invoke-WebRequest -Uri 'http://localhost:8080/api/v1/auth/login' -Method POST -ContentType 'application/json' -Body $custLoginBody -TimeoutSec 10 -UseBasicParsing
    Write-Host "STATUS: $($r.StatusCode)"
    $custJson = $r.Content | ConvertFrom-Json
    $cjwt = $custJson.data.accessToken
    Write-Host "Customer JWT obtained"
} catch {
    $resp = $_.Exception.Response
    if ($resp) {
        Write-Host "STATUS: $([int]$resp.StatusCode)"
        $sr = New-Object System.IO.StreamReader($resp.GetResponseStream())
        Write-Host "BODY: $($sr.ReadToEnd())"
    }
    $cjwt = $null
}

if ($cjwt) {
    $custHeaders = @{ "Authorization" = "Bearer $cjwt" }

    Write-Host "`n=== Customer 403 Test: POST /api/v1/admin/accounts/71414a34-5bb7-424c-a6e5-dd17d1901e83/fund ==="
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
                Write-Host "PASS: Customer correctly denied (403 Forbidden)"
            } else {
                Write-Host "STATUS: $code (not 403)"
            }
            $sr = New-Object System.IO.StreamReader($resp.GetResponseStream())
            Write-Host "BODY: $($sr.ReadToEnd())"
        } else {
            Write-Host "ERROR: $($_.Exception.Message)"
        }
    }
}

Write-Host "`n=== DONE ==="
