Set-Location 'C:\Users\akshi\Downloads\churn-radar'

# Copy ML notebook from EDA if present
$ml = Get-ChildItem -Path .\EDA -Filter '05_Machine_Learning_Model*' -ErrorAction SilentlyContinue | Select-Object -First 1
if ($ml -ne $null) {
    Copy-Item -Path $ml.FullName -Destination .\notebooks\04_Model_Training.ipynb -Force
    Write-Output "copied ML: $($ml.Name)"
} else {
    Write-Output 'no ML notebook in EDA'
}

# Copy WebApp folder into web-app
if (Test-Path .\WebApp) {
    Copy-Item -Path .\WebApp\* -Destination .\web-app\ -Recurse -Force
    Write-Output 'copied WebApp'
} else {
    Write-Output 'no WebApp present'
}

# Copy any model artifacts
if (Test-Path .\ml\artifacts) {
    Copy-Item -Path .\ml\artifacts\* -Destination .\models\ -Force
    Write-Output 'copied ml artifacts'
} else {
    Write-Output 'no ml artifacts'
}

Write-Output 'script done'