#!/usr/bin/env bash

# Truco4AR Pre-Push Hook
# This hook runs before pushing to remote to ensure code quality

set -e  # Exit on any error

echo "🎴 Truco4AR Pre-Push Hook"
echo "========================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Track if any checks fail
CHECKS_FAILED=0

# Get current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
print_info "Current branch: $CURRENT_BRANCH"

# ========================================
# 1. Check for WIP Commits
# ========================================
echo ""
print_info "Checking for WIP commits..."

WIP_COMMITS=$(git log @{u}.. --oneline | grep -iE 'wip|work in progress|temp|tmp|fixup' || true)

if [ -n "$WIP_COMMITS" ]; then
    print_error "Found WIP commits that should not be pushed:"
    echo "$WIP_COMMITS"
    print_info "Please squash or reword WIP commits before pushing"
    print_info "Use: git rebase -i @{u}"
    CHECKS_FAILED=1
else
    print_success "No WIP commits found"
fi

# ========================================
# 2. Run Formatter Check
# ========================================
echo ""
print_info "Checking code formatting..."

FORMAT_PASSED=0

# Check if format check command exists (varies by stack)
if [ -f "package.json" ] && command -v npm > /dev/null; then
    # Node.js project with Prettier
    print_info "Running prettier check..."
    if npm run format:check; then
        FORMAT_PASSED=1
    fi
elif [ -f "pyproject.toml" ] && command -v black > /dev/null; then
    # Python project with Black
    print_info "Running black check..."
    if black --check .; then
        FORMAT_PASSED=1
    fi
elif [ -f "go.mod" ] && command -v gofmt > /dev/null; then
    # Go project
    print_info "Running gofmt check..."
    if [ -z "$(gofmt -l .)" ]; then
        FORMAT_PASSED=1
    fi
elif [ -f "Cargo.toml" ] && command -v cargo > /dev/null; then
    # Rust project
    print_info "Running cargo fmt check..."
    if cargo fmt -- --check; then
        FORMAT_PASSED=1
    fi
else
    print_warning "No formatter detected"
    print_info "Code formatting will be required once tech stack is chosen"
    FORMAT_PASSED=1  # Don't block push if no formatter yet
fi

if [ $FORMAT_PASSED -eq 1 ]; then
    print_success "Code formatting passed"
else
    print_error "Code formatting failed"
    print_info "Run 'npm run format' to fix formatting issues"
    CHECKS_FAILED=1
fi

# ========================================
# 3. Run Linter
# ========================================
echo ""
print_info "Running linter..."

LINT_PASSED=0

# Check if lint command exists (varies by stack)
if [ -f "package.json" ] && command -v npm > /dev/null; then
    # Node.js project
    print_info "Running npm lint..."
    if npm run lint; then
        LINT_PASSED=1
    fi
elif [ -f "requirements.txt" ] && command -v pylint > /dev/null; then
    # Python project
    print_info "Running pylint..."
    if pylint **/*.py; then
        LINT_PASSED=1
    fi
elif [ -f "go.mod" ] && command -v golint > /dev/null; then
    # Go project
    print_info "Running golint..."
    if golint ./...; then
        LINT_PASSED=1
    fi
elif [ -f "Cargo.toml" ] && command -v cargo > /dev/null; then
    # Rust project
    print_info "Running cargo clippy..."
    if cargo clippy -- -D warnings; then
        LINT_PASSED=1
    fi
else
    print_warning "No linter detected"
    print_info "Linting will be required once tech stack is chosen"
    LINT_PASSED=1  # Don't block push if no linter yet
fi

if [ $LINT_PASSED -eq 1 ]; then
    print_success "Linting passed"
else
    print_error "Linting failed"
    print_info "Fix linting errors before pushing"
    CHECKS_FAILED=1
fi

# ========================================
# 4. Run Full Test Suite
# ========================================
echo ""
print_info "Running full test suite (unit + integration)..."

TEST_PASSED=0

# Check if test command exists (varies by stack)
if [ -f "package.json" ] && command -v npm > /dev/null; then
    # Node.js project
    print_info "Running npm tests..."
    if npm test; then
        TEST_PASSED=1
    fi
elif [ -f "requirements.txt" ] && command -v pytest > /dev/null; then
    # Python project
    print_info "Running pytest..."
    if pytest; then
        TEST_PASSED=1
    fi
elif [ -f "go.mod" ] && command -v go > /dev/null; then
    # Go project
    print_info "Running go tests..."
    if go test ./...; then
        TEST_PASSED=1
    fi
elif [ -f "Cargo.toml" ] && command -v cargo > /dev/null; then
    # Rust project
    print_info "Running cargo tests..."
    if cargo test; then
        TEST_PASSED=1
    fi
else
    print_warning "No test framework detected"
    print_info "Tests will be required once tech stack is chosen"
    TEST_PASSED=1  # Don't block push if no tests yet
fi

if [ $TEST_PASSED -eq 1 ]; then
    print_success "All tests passed"
else
    print_error "Tests failed"
    print_info "Fix failing tests before pushing"
    CHECKS_FAILED=1
fi

# ========================================
# 5. Check Test Coverage
# ========================================
echo ""
print_info "Checking test coverage..."

COVERAGE_OK=1

# Try to run coverage check based on available tools
if [ -f "package.json" ] && command -v npm > /dev/null; then
    # Node.js - try to get coverage
    if npm run test:coverage > /dev/null 2>&1; then
        print_success "Coverage check passed"
    else
        print_warning "Could not verify coverage (test:coverage script not found)"
    fi
elif [ -f "requirements.txt" ] && command -v pytest > /dev/null; then
    # Python - check if coverage is configured
    if pytest --cov > /dev/null 2>&1; then
        print_success "Coverage check passed"
    else
        print_warning "Could not verify coverage (pytest-cov not installed?)"
    fi
else
    print_warning "Coverage check not available yet"
fi

# ========================================
# 6. Verify Commit Message Format
# ========================================
echo ""
print_info "Verifying all commit messages follow Conventional Commits..."

# Get commits that will be pushed
COMMITS_TO_PUSH=$(git log @{u}.. --pretty=format:"%s" 2>/dev/null || git log --pretty=format:"%s" -n 5)

if [ -z "$COMMITS_TO_PUSH" ]; then
    print_info "No new commits to push"
else
    INVALID_COMMITS=0
    while IFS= read -r commit_msg; do
        if ! echo "$commit_msg" | grep -qE '^(feat|fix|docs|style|refactor|perf|test|chore|ci)(\(.+\))?: .+'; then
            print_error "Invalid commit message: $commit_msg"
            INVALID_COMMITS=$((INVALID_COMMITS + 1))
        fi
    done <<< "$COMMITS_TO_PUSH"

    if [ $INVALID_COMMITS -gt 0 ]; then
        print_error "Found $INVALID_COMMITS commit(s) with invalid format"
        print_info "All commits must follow Conventional Commits format"
        print_info "Use: git rebase -i @{u} to reword commits"
        print_info "See .claude/commands/commit.md for guidelines"
        CHECKS_FAILED=1
    else
        print_success "All commit messages are properly formatted"
    fi
fi

# ========================================
# 7. Branch-Specific Checks
# ========================================
echo ""
print_info "Running branch-specific checks..."

# Protect main/master branch
if [[ "$CURRENT_BRANCH" == "main" || "$CURRENT_BRANCH" == "master" ]]; then
    print_warning "Pushing directly to $CURRENT_BRANCH"
    print_info "Consider using Git Flow: feature branches → develop → main"
    print_info "Direct pushes to main should be rare (hotfixes, releases)"

    # Extra confirmation for main/master
    read -p "Are you sure you want to push to $CURRENT_BRANCH? (yes/no) " -n 3 -r
    echo
    if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        print_error "Push to $CURRENT_BRANCH cancelled"
        exit 1
    fi
fi

# Check if pushing to develop from feature branch
if [[ "$CURRENT_BRANCH" == "feature/"* ]]; then
    print_warning "You're on a feature branch"
    print_info "Feature branches should be merged via Pull Request"
    print_info "Direct pushes are ok for backing up work"
fi

# ========================================
# 8. Check for Large Files
# ========================================
echo ""
print_info "Checking for large files..."

LARGE_FILES=$(git diff @{u}.. --stat | awk '{if ($3 > 500) print $1}' || true)

if [ -n "$LARGE_FILES" ]; then
    print_warning "Found files with >500 lines changed:"
    echo "$LARGE_FILES"
    print_info "Consider breaking large changes into smaller commits"
else
    print_success "No unusually large files"
fi

# Check for binary files
BINARY_FILES=$(git diff @{u}.. --numstat | awk '$1 == "-" {print $3}' || true)

if [ -n "$BINARY_FILES" ]; then
    print_warning "Found binary files being pushed:"
    echo "$BINARY_FILES"
    print_info "Verify these should be committed (images, etc.)"
fi

# ========================================
# 9. Verify No Uncommitted Changes
# ========================================
echo ""
print_info "Checking for uncommitted changes..."

if ! git diff-index --quiet HEAD --; then
    print_warning "You have uncommitted changes"
    print_info "Consider committing or stashing before pushing"
else
    print_success "No uncommitted changes"
fi

# ========================================
# 10. Check Remote Status
# ========================================
echo ""
print_info "Checking remote status..."

# Fetch latest from remote
git fetch origin --quiet

# Check if branch exists on remote
if git rev-parse --verify "origin/$CURRENT_BRANCH" > /dev/null 2>&1; then
    # Check if local is behind remote
    LOCAL=$(git rev-parse @)
    REMOTE=$(git rev-parse @{u})
    BASE=$(git merge-base @ @{u})

    if [ "$LOCAL" = "$REMOTE" ]; then
        print_info "Branch is up to date with remote"
    elif [ "$LOCAL" = "$BASE" ]; then
        print_warning "Your branch is behind origin/$CURRENT_BRANCH"
        print_info "Consider pulling latest changes first"
    elif [ "$REMOTE" = "$BASE" ]; then
        print_success "Your branch is ahead of remote"
    else
        print_warning "Your branch has diverged from origin/$CURRENT_BRANCH"
        print_info "You may need to rebase or merge"
    fi
else
    print_info "This is a new branch (will create on remote)"
fi

# ========================================
# Summary
# ========================================
echo ""
echo "========================"

if [ $CHECKS_FAILED -eq 0 ]; then
    print_success "All pre-push checks passed!"
    echo ""
    print_info "Proceeding with push..."
    exit 0
else
    print_error "Pre-push checks failed!"
    echo ""
    print_info "Please fix the issues above and try again"
    print_info ""
    print_info "To skip these checks (NOT recommended):"
    print_info "  git push --no-verify"
    echo ""
    exit 1
fi
