#!/bin/bash

# MCP Server Troubleshooting Script for Kumar Prescod Boxing Website
# This script diagnoses and attempts to fix common MCP server issues

echo "🥊 MCP Server Troubleshooting for Kumar Prescod Boxing Website"
echo "=============================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

echo -e "\n${BLUE}1. Environment Diagnostics${NC}"
echo "-------------------------"

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_status 0 "Node.js installed: $NODE_VERSION"
else
    print_status 1 "Node.js not found"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_status 0 "npm installed: $NPM_VERSION"
else
    print_status 1 "npm not found"
fi

# Check npx
if command -v npx &> /dev/null; then
    NPX_PATH=$(which npx)
    print_status 0 "npx found at: $NPX_PATH"
else
    print_status 1 "npx not found"
fi

# Check if using NVM
if [[ "$NPX_PATH" == *"nvm"* ]]; then
    print_warning "Using NVM - this can cause MCP server issues"
    echo "  NVM Path: $NPX_PATH"
fi

# Check yarn
if command -v yarn &> /dev/null; then
    YARN_VERSION=$(yarn --version)
    print_status 0 "Yarn installed: $YARN_VERSION"
else
    print_warning "Yarn not available (optional)"
fi

echo -e "\n${BLUE}2. MCP Package Testing${NC}"
echo "---------------------"

# Test each MCP package
packages=(
    "@modelcontextprotocol/server-sequential-thinking"
    "@upstash/context7-mcp" 
    "@21st-dev/magic"
    "@playwright/mcp"
    "@modelcontextprotocol/server-github"
    "@modelcontextprotocol/server-filesystem"
    "@modelcontextprotocol/server-fetch"
    "@modelcontextprotocol/server-puppeteer"
    "@modelcontextprotocol/server-sqlite"
    "@modelcontextprotocol/server-memory"
)

for package in "${packages[@]}"; do
    echo -n "Testing $package... "
    if timeout 10s npx "$package" --help &>/dev/null; then
        print_status 0 ""
    else
        print_status 1 ""
    fi
done

echo -e "\n${BLUE}3. Environment Variables${NC}"
echo "----------------------"

# Check environment file
ENV_FILE="/Users/revalue.io/.claude/.env.local"
if [[ -f "$ENV_FILE" ]]; then
    print_status 0 "Environment file exists: $ENV_FILE"
    
    # Check for GitHub token
    if grep -q "GITHUB_PERSONAL_ACCESS_TOKEN=ghp_" "$ENV_FILE"; then
        print_warning "GitHub token appears to be placeholder - replace with real token"
    elif grep -q "GITHUB_PERSONAL_ACCESS_TOKEN=" "$ENV_FILE"; then
        print_status 0 "GitHub token configured"
    else
        print_status 1 "GitHub token not found"
    fi
else
    print_status 1 "Environment file not found: $ENV_FILE"
fi

echo -e "\n${BLUE}4. Boxing Website Setup${NC}"
echo "---------------------"

# Check project directory
PROJECT_DIR="/Users/revalue.io/KumarPrescodBoxing"
if [[ -d "$PROJECT_DIR" ]]; then
    print_status 0 "Project directory exists: $PROJECT_DIR"
else
    print_status 1 "Project directory not found: $PROJECT_DIR"
fi

# Check data directory for SQLite
DATA_DIR="$PROJECT_DIR/data"
if [[ -d "$DATA_DIR" ]]; then
    print_status 0 "Data directory exists: $DATA_DIR"
else
    print_warning "Data directory missing - creating..."
    mkdir -p "$DATA_DIR"
    print_status 0 "Data directory created: $DATA_DIR"
fi

echo -e "\n${BLUE}5. Configuration Files${NC}"
echo "--------------------"

# Check settings file
SETTINGS_FILE="/Users/revalue.io/.claude/settings.json"
if [[ -f "$SETTINGS_FILE" ]]; then
    print_status 0 "Settings file exists: $SETTINGS_FILE"
    
    # Check if using absolute paths
    if grep -q "/Users/revalue.io/.nvm" "$SETTINGS_FILE"; then
        print_status 0 "Using absolute NPX paths (good for NVM)"
    else
        print_warning "Using relative paths - may cause issues with NVM"
    fi
else
    print_status 1 "Settings file not found: $SETTINGS_FILE"
fi

# Check backup settings
BACKUP_FILE="/Users/revalue.io/.claude/settings-backup.json"
if [[ -f "$BACKUP_FILE" ]]; then
    print_status 0 "Backup settings file available: $BACKUP_FILE"
else
    print_warning "No backup settings file found"
fi

echo -e "\n${BLUE}6. Recommendations${NC}"
echo "----------------"

echo "💡 To fix MCP server issues:"
echo "   1. Replace GitHub token in .env.local with real token from https://github.com/settings/tokens"
echo "   2. Try running: claude mcp restart"
echo "   3. If still failing, copy settings-backup.json to settings.json to use Yarn instead"
echo "   4. Check Claude Code logs with: claude --debug"

echo -e "\n${GREEN}🏆 Troubleshooting complete!${NC}"
echo "For more help, check: /Users/revalue.io/KumarPrescodBoxing/docs/MCP_CONFIGURATION.md"