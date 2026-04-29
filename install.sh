#!/bin/bash
# AI DevTools Toolkit — One-Command Installer
# Usage: curl -fsSL ... | bash   OR   bash .gemini/install.sh

set -euo pipefail

REPO_URL="https://github.com/Rajvardhan7030/ai-devlopment-toolkit-.git"
INSTALL_MODE=""
TARGET_ROOT="$PWD"
SOURCE_DIR=""
TEMP_SOURCE_DIR=""

echo "🤖 AI DevTools Toolkit Installer"
echo "================================="
echo ""

cleanup() {
    if [ -n "${TEMP_SOURCE_DIR:-}" ] && [ -d "$TEMP_SOURCE_DIR" ]; then
        rm -rf "$TEMP_SOURCE_DIR"
    fi
}

trap cleanup EXIT

detect_cli() {
    GEMINI_INSTALLED=false
    CODEX_INSTALLED=false

    if command -v gemini >/dev/null 2>&1; then
        GEMINI_INSTALLED=true
        echo "✅ Gemini CLI detected ($(gemini --version 2>/dev/null || echo 'unknown version'))"
    fi

    if command -v codex >/dev/null 2>&1; then
        CODEX_INSTALLED=true
        echo "✅ Codex CLI detected ($(codex --version 2>/dev/null || echo 'unknown version'))"
    fi

    if [ "$GEMINI_INSTALLED" = false ] && [ "$CODEX_INSTALLED" = false ]; then
        echo "❌ Neither Gemini CLI nor Codex CLI found."
        echo ""
        echo "Install one of them first:"
        echo "  Gemini CLI: https://github.com/google-gemini/gemini-cli"
        echo "  Codex CLI:  https://github.com/openai/codex"
        exit 1
    fi
}

choose_mode() {
    echo ""
    echo "Choose installation mode:"
    echo "  1) Project-level (current directory only)"
    echo "  2) Global (available in all projects)"
    echo ""
    read -r -p "Enter choice [1-2]: " choice

    case "$choice" in
        1) INSTALL_MODE="project" ;;
        2) INSTALL_MODE="global" ;;
        *)
            echo "Invalid choice. Exiting."
            exit 1
            ;;
    esac
}

resolve_source_dir() {
    local script_dir
    script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

    if [ -d "$script_dir/.gemini" ] || [ -d "$script_dir/.codex" ]; then
        SOURCE_DIR="$script_dir"
        return
    fi

    if ! command -v git >/dev/null 2>&1; then
        echo "❌ git is required for automated installation."
        exit 1
    fi

    TEMP_SOURCE_DIR="$(mktemp -d)"
    echo "📥 Downloading toolkit assets..."
    git clone --depth 1 "$REPO_URL" "$TEMP_SOURCE_DIR" >/dev/null 2>&1
    SOURCE_DIR="$TEMP_SOURCE_DIR"
}

copy_dir_contents() {
    local src="$1"
    local dest="$2"

    mkdir -p "$dest"
    cp -R "$src"/. "$dest"/
}

install_gemini() {
    local gemini_dir

    echo ""
    echo "📦 Installing Gemini CLI components..."

    if [ "$INSTALL_MODE" = "project" ]; then
        gemini_dir="$TARGET_ROOT/.gemini"
    else
        gemini_dir="$HOME/.gemini"
    fi

    if [ -d "$SOURCE_DIR/.gemini/commands" ]; then
        copy_dir_contents "$SOURCE_DIR/.gemini/commands" "$gemini_dir/commands"
        echo "  ✅ Commands installed ($(find "$SOURCE_DIR/.gemini/commands" -maxdepth 1 -name '*.toml' | wc -l) files)"
    fi

    if [ -d "$SOURCE_DIR/.gemini/skills" ]; then
        copy_dir_contents "$SOURCE_DIR/.gemini/skills" "$gemini_dir/skills"
        echo "  ✅ Skills installed ($(find "$SOURCE_DIR/.gemini/skills" -name 'SKILL.md' | wc -l) skills)"
    fi

    if [ -d "$SOURCE_DIR/.gemini/agent" ]; then
        copy_dir_contents "$SOURCE_DIR/.gemini/agent" "$gemini_dir/agent"
        echo "  ✅ Agents installed ($(find "$SOURCE_DIR/.gemini/agent" -maxdepth 1 -name '*.md' | wc -l) agents)"
    fi

    find "$gemini_dir" -name "*.sh" -exec chmod +x {} \; 2>/dev/null || true
    echo "  📍 Location: $gemini_dir"
}

install_codex() {
    local codex_dir="$HOME/.codex"

    echo ""
    echo "📦 Installing Codex CLI components..."

    mkdir -p "$codex_dir"

    if [ -f "$SOURCE_DIR/.codex/config.toml" ]; then
        if [ -f "$codex_dir/config.toml" ]; then
            cp "$codex_dir/config.toml" "$codex_dir/config.toml.backup.$(date +%s)"
            echo "  💾 Existing config backed up"
        fi

        cp "$SOURCE_DIR/.codex/config.toml" "$codex_dir/config.toml"
        echo "  ✅ Codex config installed"
    else
        echo "  ⚠️ No Codex config found in toolkit source"
    fi

    echo "  📍 Location: $codex_dir/config.toml"
}

copy_templates() {
    echo ""
    echo "📋 Copying context templates..."

    if [ -f "$SOURCE_DIR/GEMINI.md" ] && [ ! -f "$TARGET_ROOT/GEMINI.md" ]; then
        cp "$SOURCE_DIR/GEMINI.md" "$TARGET_ROOT/GEMINI.md"
        echo "  ✅ GEMINI.md copied to $TARGET_ROOT"
    fi

    if [ -f "$SOURCE_DIR/AGENTS.md" ] && [ ! -f "$TARGET_ROOT/AGENTS.md" ]; then
        cp "$SOURCE_DIR/AGENTS.md" "$TARGET_ROOT/AGENTS.md"
        echo "  ✅ AGENTS.md copied to $TARGET_ROOT"
    fi
}

verify() {
    echo ""
    echo "🔍 Verifying installation..."

    if command -v gemini >/dev/null 2>&1; then
        echo "  Gemini CLI detected and ready"
    fi

    if command -v codex >/dev/null 2>&1; then
        echo "  Codex CLI detected and ready"
    fi
}

main() {
    detect_cli
    choose_mode
    resolve_source_dir

    if [ "$GEMINI_INSTALLED" = true ]; then
        install_gemini
    fi

    if [ "$CODEX_INSTALLED" = true ]; then
        install_codex
    fi

    if [ "$INSTALL_MODE" = "project" ]; then
        copy_templates
    fi

    verify

    echo ""
    echo "🎉 Installation complete!"
    echo ""
    echo "Quick start:"
    echo "  gemini /debug-fix 'fix the auth bug'"
    echo "  gemini /review 'check login module'"
    echo "  codex --agent debugger 'race condition in worker.go'"
    echo ""
    echo "Edit GEMINI.md and AGENTS.md in your project root to customize context."
}

main "$@"
