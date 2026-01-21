#!/bin/bash

# Script de Build para Horario 3D
# Uso: ./build.sh [windows|linux|arch|all]

set -e

echo "🚀 Horario 3D - Build Script"
echo "================================"

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para verificar si los íconos existen
check_icons() {
    echo -e "${BLUE}📋 Verificando íconos...${NC}"
    
    if [ ! -f "build/icon.png" ]; then
        echo -e "${RED}❌ Error: build/icon.png no encontrado${NC}"
        echo "   Coloca un ícono PNG de 512x512 en build/icon.png"
        exit 1
    fi
    
    if [ "$1" == "windows" ] || [ "$1" == "all" ]; then
        if [ ! -f "build/icon.ico" ]; then
            echo -e "${YELLOW}⚠️  Advertencia: build/icon.ico no encontrado${NC}"
            echo "   Generando desde PNG..."
            # Aquí podrías agregar conversión automática con ImageMagick
        fi
    fi
    
    echo -e "${GREEN}✅ Íconos verificados${NC}"
}

# Función para instalar dependencias
install_deps() {
    if [ ! -d "node_modules" ]; then
        echo -e "${BLUE}📦 Instalando dependencias...${NC}"
        npm install
        echo -e "${GREEN}✅ Dependencias instaladas${NC}"
    fi
}

# Función para limpiar builds anteriores
clean_release() {
    if [ -d "release" ]; then
        echo -e "${BLUE}🧹 Limpiando builds anteriores...${NC}"
        rm -rf release
        echo -e "${GREEN}✅ Limpieza completada${NC}"
    fi
}

# Build Windows Portable
build_windows() {
    echo -e "${BLUE}🪟 Building Windows Portable...${NC}"
    npm run electron:build:win
    echo -e "${GREEN}✅ Build Windows completado${NC}"
    
    if [ -f release/*.exe ]; then
        SIZE=$(du -h release/*.exe | cut -f1)
        echo -e "${GREEN}   Tamaño: ${SIZE}${NC}"
    fi
}

# Build Linux AppImage
build_linux() {
    echo -e "${BLUE}🐧 Building Linux AppImage...${NC}"
    npm run electron:build:linux
    echo -e "${GREEN}✅ Build Linux completado${NC}"
    
    if [ -f release/*.AppImage ]; then
        SIZE=$(du -h release/*.AppImage | cut -f1)
        echo -e "${GREEN}   Tamaño: ${SIZE}${NC}"
    fi
}

# Build Arch Linux
build_arch() {
    echo -e "${BLUE}🔷 Building Arch Linux packages...${NC}"
    npm run electron:build:arch
    echo -e "${GREEN}✅ Build Arch completado${NC}"
    
    if [ -f release/*.pacman ]; then
        SIZE=$(du -h release/*.pacman | cut -f1)
        echo -e "${GREEN}   Tamaño pacman: ${SIZE}${NC}"
    fi
    
    if [ -f release/*.tar.gz ]; then
        SIZE=$(du -h release/*.tar.gz | cut -f1)
        echo -e "${GREEN}   Tamaño tar.gz: ${SIZE}${NC}"
    fi
}

# Build todas las plataformas
build_all() {
    echo -e "${BLUE}🌍 Building para todas las plataformas...${NC}"
    npm run electron:build:all
    echo -e "${GREEN}✅ Build completo${NC}"
    
    echo -e "${BLUE}📦 Archivos generados:${NC}"
    ls -lh release/
}

# Mostrar resultados
show_results() {
    echo ""
    echo -e "${GREEN}================================${NC}"
    echo -e "${GREEN}✨ Build completado exitosamente!${NC}"
    echo -e "${GREEN}================================${NC}"
    echo ""
    echo -e "${BLUE}📂 Archivos en release/:${NC}"
    ls -lh release/ 2>/dev/null || echo "No se encontraron archivos"
    echo ""
}

# Main
main() {
    BUILD_TYPE=${1:-help}
    
    case $BUILD_TYPE in
        windows)
            check_icons "windows"
            install_deps
            clean_release
            build_windows
            show_results
            ;;
        linux)
            check_icons "linux"
            install_deps
            clean_release
            build_linux
            show_results
            ;;
        arch)
            check_icons "linux"
            install_deps
            clean_release
            build_arch
            show_results
            ;;
        all)
            check_icons "all"
            install_deps
            clean_release
            build_all
            show_results
            ;;
        help|*)
            echo "Uso: $0 [windows|linux|arch|all]"
            echo ""
            echo "Opciones:"
            echo "  windows  - Build portable para Windows (.exe)"
            echo "  linux    - Build AppImage portable para Linux"
            echo "  arch     - Build pacman y tar.gz para Arch Linux"
            echo "  all      - Build para todas las plataformas"
            echo ""
            echo "Ejemplos:"
            echo "  $0 windows"
            echo "  $0 linux"
            echo "  $0 arch"
            echo "  $0 all"
            ;;
    esac
}

main "$@"
