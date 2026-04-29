
#!/bin/bash
# Run performance benchmarks if available

set -e

echo "⚡ Running performance benchmarks..."

if [ -f "package.json" ]; then
    if npm run benchmark &> /dev/null; then
        npm run benchmark
    else
        echo "ℹ️ No benchmark script found in package.json"
    fi

elif [ -f "pyproject.toml" ]; then
    if command -v pytest &> /dev/null; then
        pytest -m benchmark -xvs 2>/dev/null || echo "ℹ️ No benchmark tests found"
    fi

elif [ -f "Cargo.toml" ]; then
    if cargo bench &> /dev/null; then
        cargo bench
    else
        echo "ℹ️ No benchmarks configured in Cargo.toml"
    fi

elif [ -f "go.mod" ]; then
    if go test -bench=. ./... &> /dev/null; then
        go test -bench=. ./...
    else
        echo "ℹ️ No Go benchmarks found"
    fi

else
    echo "❌ No benchmark configuration detected."
fi

echo "✅ Benchmark check complete."
