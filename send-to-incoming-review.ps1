param(
    [Parameter(Mandatory = $true, ValueFromRemainingArguments = $true)]
    [string[]]$Paths
)

$ErrorActionPreference = "Stop"
$destinationRoot = "C:\Users\Admin\OneDrive\10-projects\11-The KPI Hub\incoming-review"

function Get-ConflictSafePath {
    param(
        [Parameter(Mandatory = $true)][string]$DesiredPath
    )

    if (-not (Test-Path -LiteralPath $DesiredPath)) {
        return $DesiredPath
    }

    $parent = Split-Path -Path $DesiredPath -Parent
    $leaf = Split-Path -Path $DesiredPath -Leaf
    $item = Get-Item -LiteralPath $DesiredPath -Force

    if ($item.PSIsContainer) {
        return (Join-Path $parent ($leaf + "-conflict-review"))
    }

    $base = [System.IO.Path]::GetFileNameWithoutExtension($leaf)
    $ext = [System.IO.Path]::GetExtension($leaf)
    return (Join-Path $parent ($base + "-conflict-review" + $ext))
}

foreach ($path in $Paths) {
    if (-not (Test-Path -LiteralPath $path)) {
        Write-Host "Skipped, not found: $path" -ForegroundColor Yellow
        continue
    }

    $item = Get-Item -LiteralPath $path -Force
    $target = Join-Path $destinationRoot $item.Name
    $resolvedTarget = Get-ConflictSafePath -DesiredPath $target

    Move-Item -LiteralPath $path -Destination $resolvedTarget
    Write-Host "Moved to incoming-review: $path -> $resolvedTarget" -ForegroundColor Green
}
