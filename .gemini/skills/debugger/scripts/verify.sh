
#!/bin/bash
# Auto-detect and run appropriate verification for the project

set -e

echo "🔍 Detecting project type and running verification..."

if [ -f "package.json" ]; then
    echo "📦 Node.js project detected"
    if [ -f "package-lock.json" ]; then
        npm ci
    else
        npm install
    fi
    npm test

elif [ -f "pyproject.toml" ] || [ -f "setup.py" ] || [ -f "pytest.ini" ]; then
    echo "🐍 Python project detected"
    if [ -f "poetry.lock" ]; then
        poetry run pytest -xvs
    elif [ -f "Pipfile" ]; then
        pipenv run pytest -xvs
    else
        pytest -xvs
    fi

elif [ -f "Cargo.toml" ]; then
    echo "🦀 Rust project detected"
    cargo test

elif [ -f "go.mod" ]; then
    echo "🐹 Go project detected"
    go test -race ./...

elif [ -f "pom.xml" ]; then
    echo "☕ Maven project detected"
    mvn test

elif [ -f "build.gradle" ] || [ -f "build.gradle.kts" ]; then
    echo "☕ Gradle project detected"
    ./gradlew test

elif [ -f "composer.json" ]; then
    echo "🐘 PHP project detected"
    composer install
    ./vendor/bin/phpunit

elif [ -f "Gemfile" ]; then
    echo "💎 Ruby project detected"
    bundle install
    bundle exec rspec

else
    echo "❌ No recognizable test configuration found."
    echo "Please add a test command to your GEMINI.md or AGENTS.md file."
    exit 1
fi

echo "✅ Verification passed!"
