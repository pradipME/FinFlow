$ErrorActionPreference = "Continue"
$base = "http://localhost:8080"
function Log($name, $status, $detail) {
    Write-Host "$name => $status | $detail"
}
function Invoke-Api($method, $path, $headers, $body) {
    try {
        $params = @{ Uri = "$base$path"; Method = $method; Headers = $headers; TimeoutSec = 25; UseBasicParsing = $true }
        if ($body) { $params.ContentType = "application/json"; $params.Body = $body }
        $r = Invoke-RestMethod @params
        return @{ Status = 200; Body = $r }
    } catch {
        $resp = $_.Exception.Response
        if ($resp) {
            $code = [int]$resp.StatusCode
            $sr = New-Object System.IO.StreamReader($resp.GetResponseStream())
            $text = $sr.ReadToEnd()
            return @{ Status = $code; Body = $text }
        }
        return @{ Status = -1; Body = $_.Exception.Message }
    }
}

$stamp = Get-Date -Format "HHmmss"
$rand = -join ((1..4) | ForEach-Object { Get-Random -Minimum 0 -Maximum 9 })
$emailA = "payA_$stamp$rand@finflow.com"
$emailB = "payB_$stamp$rand@finflow.com"
$phoneA = "+1999000$stamp"
$phoneB = "+1888000$stamp"
$pw = "Str0ng!Pass#2026"

Write-Host "=== 0. Admin login ==="
$adminLogin = Invoke-Api "POST" "/api/v1/auth/login" $null '{"identifier":"admin@gmail.com","password":"Admin@1111"}'
$adminJwt = $adminLogin.Body.data.accessToken
if (-not $adminJwt) { Log "Admin login" $adminLogin.Status "FAILED"; exit 1 }
$adminH = @{ "Authorization" = "Bearer $adminJwt" }
Log "Admin login" $adminLogin.Status "ok"

Write-Host "`n=== 1. Registration: missing phone (expect 4xx) ==="
$r1 = Invoke-Api "POST" "/api/v1/auth/register" $null ('{"email":"nophone_'+$stamp+'@finflow.com","username":"nophone_'+$stamp+'","password":"'+$pw+'","termsAccepted":true}')
Log "Reg missing phone" $r1.Status "isError=$($r1.Status -ge 400)"

Write-Host "`n=== 2. Registration: bad phone format (expect 4xx) ==="
$r2 = Invoke-Api "POST" "/api/v1/auth/register" $null ('{"email":"bad_'+$stamp+'@finflow.com","username":"badphone_'+$stamp+'","phoneNumber":"nope","password":"'+$pw+'","termsAccepted":true}')
Log "Reg bad phone" $r2.Status "isError=$($r2.Status -ge 400)"

Write-Host "`n=== 3. Register A (expect 201 + phone echoed) ==="
$r3 = Invoke-Api "POST" "/api/v1/auth/register" $null ('{"email":"'+$emailA+'","username":"payA_'+$stamp+'","phoneNumber":"'+$phoneA+'","password":"'+$pw+'","termsAccepted":true}')
$r3raw = $r3.Body | ConvertTo-Json -Depth 4 -Compress
Log "Register A" $r3.Status "created=$($r3.Status -eq 201) phoneInBody=$($r3raw.Contains($phoneA))"

Write-Host "`n=== 4. Duplicate phone (expect 4xx) ==="
$r4 = Invoke-Api "POST" "/api/v1/auth/register" $null ('{"email":"dup_'+$stamp+'@finflow.com","username":"dup_'+$stamp+'","phoneNumber":"'+$phoneA+'","password":"'+$pw+'","termsAccepted":true}')
Log "Duplicate phone" $r4.Status "isError=$($r4.Status -ge 400)"

Write-Host "`n=== 5. Register B (expect 201) ==="
$r5 = Invoke-Api "POST" "/api/v1/auth/register" $null ('{"email":"'+$emailB+'","username":"payB_'+$stamp+'","phoneNumber":"'+$phoneB+'","password":"'+$pw+'","termsAccepted":true}')
Log "Register B" $r5.Status "created=$($r5.Status -eq 201)"

Write-Host "`n=== 6. Login A & B ==="
$la = Invoke-Api "POST" "/api/v1/auth/login" $null ('{"identifier":"'+$emailA+'","password":"'+$pw+'"}')
$jb = Invoke-Api "POST" "/api/v1/auth/login" $null ('{"identifier":"'+$emailB+'","password":"'+$pw+'"}')
$jwtA = $la.Body.data.accessToken
$jwtB = $jb.Body.data.accessToken
$hA = @{ "Authorization" = "Bearer $jwtA" }
$hB = @{ "Authorization" = "Bearer $jwtB" }
Log "Login A" $la.Status "ok=$([bool]$jwtA)"
Log "Login B" $jb.Status "ok=$([bool]$jwtB)"

# Decode sub (user id) from JWT
function UserIdFromJwt($jwt) {
    $seg = $jwt.Split(".")[1].Replace('-','+').Replace('_','/')
    $mod = $seg.Length % 4
    if ($mod -gt 0) { $seg += "=" * (4 - $mod) }
    return ([System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($seg)) | ConvertFrom-Json).sub
}
$idA = UserIdFromJwt $jwtA
$idB = UserIdFromJwt $jwtB
Log "User A id" 0 $idA
Log "User B id" 0 $idB

Write-Host "`n=== 7. Profile returns phone ==="
$pA = Invoke-Api "GET" "/api/v1/profile" $hA $null
$pAraw = $pA.Body | ConvertTo-Json -Depth 4 -Compress
Log "GET /profile A phone" $pA.Status "phoneInBody=$($pAraw.Contains($phoneA))"

Write-Host "`n=== 8. Admin GET /admin/events (SSE, expect 200 + text/event-stream) ==="
try {
    $resp = Invoke-WebRequest -Uri "$base/api/v1/admin/events" -Headers $adminH -TimeoutSec 8 -UseBasicParsing
    Log "Admin /admin/events" $resp.StatusCode "contentType=$($resp.Headers['Content-Type'])"
} catch {
    $code = $null; $ct = $null
    if ($_.Exception.Response) { $code = [int]$_.Exception.Response.StatusCode; $ct = $_.Exception.Response.ContentType }
    Log "Admin /admin/events" $(if($code){"$code"}else{"-1"}) "contentType=$ct"
}

Write-Host "`n=== 9. Customer A /admin/events (expect 403) ==="
$r9 = Invoke-Api "GET" "/api/v1/admin/events" $hA $null
Log "Customer /admin/events" $r9.Status "is403=$($r9.Status -eq 403)"

Write-Host "`n=== 10. Customer A admin funding (expect 403) ==="
$r10 = Invoke-Api "POST" "/api/v1/admin/accounts/71414a34-5bb7-424c-a6e5-dd17d1901e83/fund" $hA '{"amountCents":1000}'
Log "Customer admin/fund" $r10.Status "is403=$($r10.Status -eq 403)"

Write-Host "`n=== 11. Create+fund accounts for A and B via admin ==="
$accA = Invoke-Api "POST" "/api/v1/admin/accounts" $adminH ('{"customerId":"'+$idA+'","accountType":"SAVINGS","currency":"USD"}')
$accAid = $accA.Body.data.id
Log "Create account A" $accA.Status "accId=$accAid"
$accA2 = Invoke-Api "POST" "/api/v1/admin/accounts/$accAid/fund" $adminH '{"amountCents":1000000,"description":"fund A"}'
Log "Fund A (1000000c)" $accA2.Status "ok=$($accA2.Status -eq 200)"

$accB = Invoke-Api "POST" "/api/v1/admin/accounts" $adminH ('{"customerId":"'+$idB+'","accountType":"SAVINGS","currency":"USD"}')
$accBid = $accB.Body.data.id
Log "Create account B" $accB.Status "accId=$accBid"
$accB2 = Invoke-Api "POST" "/api/v1/admin/accounts/$accBid/fund" $adminH '{"amountCents":100000,"description":"fund B"}'
Log "Fund B (100000c)" $accB2.Status "ok=$($accB2.Status -eq 200)"

function BalanceOf($h, $accId) {
    $d = Invoke-Api "GET" "/api/v1/accounts/$accId" $h $null
    if ($d.Status -eq 200 -and $d.Body.data) { return [long]$d.Body.data.availableBalanceCents }
    return -1
}
$balA0 = BalanceOf $hA $accAid
$balB0 = BalanceOf $hB $accBid
Log "A balance before" 0 $balA0
Log "B balance before" 0 $balB0

Write-Host "`n=== 12. Pay by mobile: happy path A->B (10.00) ==="
$payBody = '{"sourceAccountId":"'+$accAid+'","recipientMobile":"'+$phoneB+'","amountCents":1000,"currency":"USD","description":"live test payment"}'
$payH = @{ "Authorization" = "Bearer $jwtA" }
$pay = Invoke-Api "POST" "/api/v1/transactions/pay" $payH $payBody
Log "Pay A->B" $pay.Status "created=$($pay.Status -eq 201)"
$balA1 = BalanceOf $hA $accAid
$balB1 = BalanceOf $hB $accBid
Log "A balance after" 0 $balA1
Log "B balance after" 0 $balB1
Log "A debited 1000" 0 "delta=$($balA0 - $balA1)"
Log "B credited 1000" 0 "delta=$($balB1 - $balB0)"

Write-Host "`n=== 13. Self-payment (expect error) ==="
$selfBody = '{"sourceAccountId":"'+$accAid+'","recipientMobile":"'+$phoneA+'","amountCents":100,"currency":"USD"}'
$self = Invoke-Api "POST" "/api/v1/transactions/pay" $payH $selfBody
Log "Self-payment" $self.Status "isError=$($self.Status -ge 400)"

Write-Host "`n=== 14. Unknown recipient mobile (expect error) ==="
$unkBody = '{"sourceAccountId":"'+$accAid+'","recipientMobile":"+74999999999","amountCents":100,"currency":"USD"}'
$unk = Invoke-Api "POST" "/api/v1/transactions/pay" $payH $unkBody
Log "Unknown mobile" $unk.Status "isError=$($unk.Status -ge 400)"

Write-Host "`n=== 15. Insufficient balance (expect error) ==="
$balAnow = BalanceOf $hA $accAid
$huge = $balAnow + 500000000
$bigBody = '{"sourceAccountId":"' + "$accAid" + '","recipientMobile":"' + "$phoneB" + '","amountCents":' + "$huge" + ',"currency":"USD"}'
$big = Invoke-Api "POST" "/api/v1/transactions/pay" $payH $bigBody
Log "Insufficient funds ($huge)" $big.Status "isError=$($big.Status -ge 400)"

Write-Host "`n=== 16. Customer B cannot pay from A's account (ownership) ==="
$ownBody = '{"sourceAccountId":"'+$accAid+'","recipientMobile":"'+$phoneB+'","amountCents":50,"currency":"USD"}'
$own = Invoke-Api "POST" "/api/v1/transactions/pay" $hB $ownBody
Log "B pays from A account" $own.Status "isError=$($own.Status -ge 400)"

Write-Host "`n=== 17. Transaction record created for A ==="
$txnA = Invoke-Api "GET" "/api/v1/transactions?page=0&size=5" $payH $null
$txnAraw = $txnA.Body | ConvertTo-Json -Depth 5 -Compress
Log "A transactions list" $txnA.Status "hasTransfer=$($txnAraw -match 'TRANSFER')"

Write-Host "`n=== DONE ==="
Write-Host "Cleanup note: A=$emailA B=$emailB"
Write-Host "A id=$idA B id=$idB"
Write-Host "A acc=$accAid B acc=$accBid"