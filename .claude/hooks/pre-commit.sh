#!/usr/bin/env bash

# Truco4AR Pre-Commit Hook
# This hook runs before commits to validate changes and ensure quality standards

set -e  # Exit on any error

echo "🎴 Truco4AR Pre-Commit Hook"
echo "=========================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo "ℹ️  $1"
}

# Track if any checks fail
CHECKS_FAILED=0

# ========================================
# 1. Validate Commit Message Format
# ========================================
echo ""
print_info "Validating commit message format..."

# Read commit message from file (passed as argument)
COMMIT_MSG_FILE="$1"
if [ -f "$COMMIT_MSG_FILE" ]; then
    COMMIT_MSG=$(cat "$COMMIT_MSG_FILE")

    # Check for Conventional Commits format
    # Pattern: type(scope): subject
    if echo "$COMMIT_MSG" | grep -qE '^(feat|fix|docs|style|refactor|perf|test|chore|ci)(\(.+\))?: .+'; then
        print_success "Commit message format is valid"
    else
        print_error "Commit message does not follow Conventional Commits format"
        print_info "Expected format: type(scope): subject"
        print_info "Valid types: feat, fix, docs, style, refactor, perf, test, chore, ci"
        print_info "Example: feat(game): add Envido betting logic"
        print_info ""
        print_info "See .claude/commands/commit.md for detailed guidelines"
        CHECKS_FAILED=1
    fi
else
    print_warning "Commit message file not found, skipping validation"
fi

# ========================================
# 2. Check for Debug Code
# ========================================
echo ""
print_info "Checking for debug code..."

# Get list of staged files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM)

if [ -z "$STAGED_FILES" ]; then
    print_warning "No files staged for commit"
else
    # Check for common debug patterns
    DEBUG_FOUND=0

    # Check for console.log (JavaScript/TypeScript)
    if echo "$STAGED_FILES" | grep -E '\.(js|jsx|ts|tsx)$' > /dev/null; then
        if git diff --cached | grep -E '^\+.*console\.(log|debug|info|warn|error)' > /dev/null; then
            print_warning "Found console.log statements in staged files"
            print_info "Consider removing debug logging before committing"
            DEBUG_FOUND=1
        fi
    fi

    # Check for debugger statements
    if git diff --cached | grep -E '^\+.*debugger' > /dev/null; then
        print_error "Found debugger statements in staged files"
        print_info "Remove debugger statements before committing"
        CHECKS_FAILED=1
    fi

    # Check for Python debug prints
    if echo "$STAGED_FILES" | grep -E '\.py$' > /dev/null; then
        if git diff --cached | grep -E '^\+.*print\(' > /dev/null; then
            print_warning "Found print() statements in Python files"
            print_info "Consider using proper logging instead of print()"
            DEBUG_FOUND=1
        fi
    fi

    if [ $DEBUG_FOUND -eq 0 ]; then
        print_success "No debug code found"
    fi
fi

# ========================================
# 3. Check for Common Security Issues
# ========================================
echo ""
print_info "Checking for common security issues..."

SECURITY_ISSUES=0

# Check for hardcoded secrets/credentials
if git diff --cached | grep -iE '^\+.*(password|secret|api[_-]?key|token|credential|private[_-]?key).*=.*["\x27]' > /dev/null; then
    print_error "Potential hardcoded secrets detected"
    print_info "Never commit passwords, API keys, or other secrets"
    print_info "Use environment variables or secure credential management"
    CHECKS_FAILED=1
    SECURITY_ISSUES=1
fi

# Check for .env files
if echo "$STAGED_FILES" | grep -E '\.env' > /dev/null; then
    print_error "Attempting to commit .env file"
    print_info ".env files should never be committed (should be in .gitignore)"
    CHECKS_FAILED=1
    SECURITY_ISSUES=1
fi

# Check for private key files
if echo "$STAGED_FILES" | grep -E '\.(pem|key|p12|pfx)$' > /dev/null; then
    print_error "Attempting to commit private key files"
    print_info "Private keys should never be committed to version control"
    CHECKS_FAILED=1
    SECURITY_ISSUES=1
fi

if [ $SECURITY_ISSUES -eq 0 ]; then
    print_success "No obvious security issues found"
fi

# ========================================
# 4. Run Unit Tests (if available)
# ========================================
echo ""
print_info "Running unit tests..."

# Check if test command exists (varies by stack)
if [ -f "package.json" ] && command -v npm > /dev/null; then
    # Node.js project
    if npm run test:unit > /dev/null 2>&1; then
        print_success "Unit tests passed"
    elif npm test > /dev/null 2>&1; then
        print_success "Tests passed"
    else
        print_error "Tests failed"
        print_info "Fix failing tests before committing"
        CHECKS_FAILED=1
    fi
elif [ -f "requirements.txt" ] && command -v pytest > /dev/null; then
    # Python project
    if pytest tests/unit/ > /dev/null 2>&1; then
        print_success "Unit tests passed"
    else
        print_error "Tests failed"
        print_info "Fix failing tests before committing"
        CHECKS_FAILED=1
    fi
elif [ -f "go.mod" ] && command -v go > /dev/null; then
    # Go project
    if go test ./... -short > /dev/null 2>&1; then
        print_success "Unit tests passed"
    else
        print_error "Tests failed"
        print_info "Fix failing tests before committing"
        CHECKS_FAILED=1
    fi
else
    print_warning "No test framework detected, skipping tests"
    print_info "Tests will be required once tech stack is chosen"
fi

# ========================================
# 5. Check Documentation Updates
# ========================================
echo ""
print_info "Checking documentation requirements..."

# Check if code changes affect public APIs
CODE_CHANGED=0
DOCS_CHANGED=0

if echo "$STAGED_FILES" | grep -vE '\.(md|txt)$' > /dev/null; then
    CODE_CHANGED=1
fi

if echo "$STAGED_FILES" | grep -E '\.(md|txt)$' > /dev/null; then
    DOCS_CHANGED=1
fi

# If code changed but no docs, warn (not blocking)
if [ $CODE_CHANGED -eq 1 ] && [ $DOCS_CHANGED -eq 0 ]; then
    print_warning "Code changed but no documentation updates"
    print_info "Consider updating documentation if public APIs or features changed"
    print_info "Relevant docs: README.md, docs/ARCHITECTURE.md, docs/USER_FLOWS.md"
else
    print_success "Documentation check passed"
fi

# ========================================
# Summary
# ========================================
echo ""
echo "=========================="

if [ $CHECKS_FAILED -eq 0 ]; then
    print_success "All pre-commit checks passed!"
    echo ""
    print_info "Proceeding with commit..."
    exit 0
else
    print_error "Pre-commit checks failed!"
    echo ""
    print_info "Please fix the issues above and try again"
    print_info ""
    print_info "To skip these checks (NOT recommended):"
    print_info "  git commit --no-verify"
    echo ""
    exit 1
fi
