
#!/bin/bash
# Setup script for the debugger skill
# Run this once after cloning the skill

set -e

echo "🛠️ Setting up Debugger Skill..."

# Check for required tools
check_tool() {
    if ! command -v "$1" &> /dev/null; then
        echo "⚠️ Warning: $1 is not installed. Some features may not work."
    else
        echo "✅ $1 found"
    fi
}

echo "Checking dependencies..."
check_tool git
check_tool grep
check_tool find

# Make scripts executable
chmod +x "$(dirname "$0")/verify.sh"

echo "🎉 Debugger skill setup complete!"
echo ""
echo "Usage:"
echo "  gemini skills install ./.gemini/skills/debugger"
echo "  gemini @debugger 'fix the login bug'"

