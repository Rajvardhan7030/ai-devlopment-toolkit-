
#!/bin/bash
# Scan for known vulnerabilities in dependencies

set -e

echo "🔒 Running vulnerability scan..."

if [ -f "package.json" ]; then
    if command -v npm &> /dev/null; then
        echo "📦 Scanning npm dependencies..."
        npm audit --audit-level=moderate
    fi

elif [ -f "pyproject.toml" ] || [ -f "requirements.txt" ]; then
    if command -v pip-audit &> /dev/null; then
        echo "🐍 Scanning Python dependencies..."
        pip-audit
    elif command -v safety &> /dev/null; then
        echo "🐍 Scanning Python dependencies (safety)..."
        safety check
    else
        echo "⚠️ Install pip-audit: pip install pip-audit"
    fi

elif [ -f "Cargo.toml" ]; then
    if command -v cargo-audit &> /dev/null; then
        echo "🦀 Scanning Rust dependencies..."
        cargo audit
    else
        echo "⚠️ Install cargo-audit: cargo install cargo-audit"
    fi

elif [ -f "go.mod" ]; then
    if command -v govulncheck &> /dev/null; then
        echo "🐹 Scanning Go dependencies..."
        govulncheck ./...
    else
        echo "⚠️ Install govulncheck: go install golang.org/x/vuln/cmd/govulncheck@latest"
    fi

else
    echo "❌ No recognized dependency file found."
    exit 1
fi

echo "✅ Vulnerability scan complete."

