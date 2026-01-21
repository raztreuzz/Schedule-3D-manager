# Script de Build para Horario 3D (PowerShell)
# Uso: .\build.ps1 [windows|linux|arch|all]

param(
    [Parameter(Position=0)]
    [ValidateSet('windows','linux','arch','all','help')]
    [string]$BuildType = 'help'
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Horario 3D - Build Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

function Check-Icons {
    param([string]$Type)
    
    Write-Host "📋 Verificando íconos..." -ForegroundColor Blue
    
    if (!(Test-Path "build\icon.png")) {
        Write-Host "❌ Error: build\icon.png no encontrado" -ForegroundColor Red
        Write-Host "   Coloca un ícono PNG de 512x512 en build\icon.png" -ForegroundColor Yellow
        exit 1
    }
    
    if (($Type -eq "windows") -or ($Type -eq "all")) {
        if (!(Test-Path "build\icon.ico")) {
            Write-Host "⚠️  Advertencia: build\icon.ico no encontrado" -ForegroundColor Yellow
            Write-Host "   Se recomienda tener un ícono .ico para Windows" -ForegroundColor Yellow
        }
    }
    
    Write-Host "✅ Íconos verificados" -ForegroundColor Green
    Write-Host ""
}

function Install-Dependencies {
    if (!(Test-Path "node_modules")) {
        Write-Host "📦 Instalando dependencias..." -ForegroundColor Blue
        npm install
        Write-Host "✅ Dependencias instaladas" -ForegroundColor Green
        Write-Host ""
    }
}

function Clean-Release {
    if (Test-Path "release") {
        Write-Host "🧹 Limpiando builds anteriores..." -ForegroundColor Blue
        Remove-Item -Recurse -Force "release"
        Write-Host "✅ Limpieza completada" -ForegroundColor Green
        Write-Host ""
    }
}

function Build-Windows {
    Write-Host "🪟 Building Windows Portable..." -ForegroundColor Blue
    npm run electron:build:win
    Write-Host "✅ Build Windows completado" -ForegroundColor Green
    Write-Host ""
    
    $exe = Get-ChildItem -Path "release" -Filter "*.exe" -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($exe) {
        $size = [math]::Round($exe.Length / 1MB, 2)
        Write-Host "   Tamaño: $size MB" -ForegroundColor Green
        Write-Host "   Archivo: $($exe.Name)" -ForegroundColor Green
    }
    Write-Host ""
}

function Build-Linux {
    Write-Host "🐧 Building Linux AppImage..." -ForegroundColor Blue
    npm run electron:build:linux
    Write-Host "✅ Build Linux completado" -ForegroundColor Green
    Write-Host ""
    
    $appimage = Get-ChildItem -Path "release" -Filter "*.AppImage" -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($appimage) {
        $size = [math]::Round($appimage.Length / 1MB, 2)
        Write-Host "   Tamaño: $size MB" -ForegroundColor Green
        Write-Host "   Archivo: $($appimage.Name)" -ForegroundColor Green
    }
    Write-Host ""
}

function Build-Arch {
    Write-Host "🔷 Building Arch Linux packages..." -ForegroundColor Blue
    npm run electron:build:arch
    Write-Host "✅ Build Arch completado" -ForegroundColor Green
    Write-Host ""
    
    $pacman = Get-ChildItem -Path "release" -Filter "*.pacman" -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($pacman) {
        $size = [math]::Round($pacman.Length / 1MB, 2)
        Write-Host "   Tamaño pacman: $size MB" -ForegroundColor Green
    }
    
    $targz = Get-ChildItem -Path "release" -Filter "*.tar.gz" -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($targz) {
        $size = [math]::Round($targz.Length / 1MB, 2)
        Write-Host "   Tamaño tar.gz: $size MB" -ForegroundColor Green
    }
    Write-Host ""
}

function Build-All {
    Write-Host "🌍 Building para todas las plataformas..." -ForegroundColor Blue
    npm run electron:build:all
    Write-Host "✅ Build completo" -ForegroundColor Green
    Write-Host ""
}

function Show-Results {
    Write-Host ""
    Write-Host "================================" -ForegroundColor Green
    Write-Host "✨ Build completado exitosamente!" -ForegroundColor Green
    Write-Host "================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "📂 Archivos generados en release/:" -ForegroundColor Blue
    Write-Host ""
    
    if (Test-Path "release") {
        Get-ChildItem -Path "release" | ForEach-Object {
            $size = if ($_.Length) { 
                [math]::Round($_.Length / 1MB, 2).ToString() + " MB" 
            } else { 
                "N/A" 
            }
            Write-Host "   📦 $($_.Name) - $size" -ForegroundColor Cyan
        }
    } else {
        Write-Host "   No se encontraron archivos" -ForegroundColor Yellow
    }
    Write-Host ""
}

function Show-Help {
    Write-Host "Uso: .\build.ps1 [windows|linux|arch|all]" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Opciones:" -ForegroundColor Cyan
    Write-Host "  windows  - Build portable para Windows (.exe)"
    Write-Host "  linux    - Build AppImage portable para Linux"
    Write-Host "  arch     - Build pacman y tar.gz para Arch Linux"
    Write-Host "  all      - Build para todas las plataformas"
    Write-Host ""
    Write-Host "Ejemplos:" -ForegroundColor Cyan
    Write-Host "  .\build.ps1 windows"
    Write-Host "  .\build.ps1 linux"
    Write-Host "  .\build.ps1 arch"
    Write-Host "  .\build.ps1 all"
    Write-Host ""
}

# Main
switch ($BuildType) {
    'windows' {
        Check-Icons "windows"
        Install-Dependencies
        Clean-Release
        Build-Windows
        Show-Results
    }
    'linux' {
        Check-Icons "linux"
        Install-Dependencies
        Clean-Release
        Build-Linux
        Show-Results
    }
    'arch' {
        Check-Icons "linux"
        Install-Dependencies
        Clean-Release
        Build-Arch
        Show-Results
    }
    'all' {
        Check-Icons "all"
        Install-Dependencies
        Clean-Release
        Build-All
        Show-Results
    }
    'help' {
        Show-Help
    }
}
