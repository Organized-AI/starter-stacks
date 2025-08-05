#!/bin/bash

# Claude Code Monitor Suite
# Complete automation suite for Claude Code action logging and token tracking
# Author: Claude Code Assistant
# Date: 2025-08-03

set -e

# Configuration
SCRIPT_DIR="/Users/jordaaan/starter-stacks/tools/stack-evaluator/web"
OUTPUT_DIR="/Users/jordaaan/Library/Mobile Documents/com~apple~CloudDocs/BHT Promo iCloud/Organized AI/Windsurf/Starter Stacks"
CLAUDE_DIR="$HOME/.claude"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logo
echo -e "${BLUE}"
cat << 'EOF'
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║   🎯 Claude Code Monitor Suite v1.0                            ║
║                                                                ║
║   Complete action logging and token tracking for Claude Code   ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_dependencies() {
    log_info "Checking dependencies..."
    
    # Check Python 3
    if ! command -v python3 &> /dev/null; then
        log_error "Python 3 is required but not installed"
        exit 1
    fi
    
    # Check bunx/npx for ccusage
    if ! command -v bunx &> /dev/null && ! command -v npx &> /dev/null; then
        log_error "bunx or npx is required for ccusage integration"
        exit 1
    fi
    
    # Check Claude directory
    if [ ! -d "$CLAUDE_DIR" ]; then
        log_error "Claude directory not found: $CLAUDE_DIR"
        exit 1
    fi
    
    log_success "All dependencies satisfied"
}

install_ccusage() {
    log_info "Installing/updating ccusage..."
    if command -v bunx &> /dev/null; then
        bunx ccusage --version > /dev/null 2>&1 || true
    else
        npx ccusage@latest --version > /dev/null 2>&1 || true
    fi
    log_success "ccusage ready"
}

setup_scripts() {
    log_info "Setting up monitoring scripts..."
    
    # Make all scripts executable
    chmod +x "$SCRIPT_DIR/claude_action_logger.py" 2>/dev/null || true
    chmod +x "$SCRIPT_DIR/claude_realtime_monitor.py" 2>/dev/null || true
    chmod +x "$SCRIPT_DIR/claude_report_generator.py" 2>/dev/null || true
    
    log_success "Scripts configured"
}

generate_reports() {
    log_info "Generating current reports..."
    
    cd "$SCRIPT_DIR"
    
    # Generate comprehensive reports
    if python3 claude_report_generator.py --output-dir "$OUTPUT_DIR"; then
        log_success "Reports generated successfully"
    else
        log_warning "Some reports may have failed to generate"
    fi
}

show_usage() {
    cat << EOF

📋 Usage: $0 [COMMAND]

Commands:
  setup     - Initial setup and dependency check
  monitor   - Start real-time monitoring (interactive)
  generate  - Generate current reports
  logs      - Generate detailed action logs
  dashboard - Generate token usage dashboard
  ccusage   - Run ccusage analysis
  status    - Show current status
  help      - Show this help message

Examples:
  $0 setup                    # Initial setup
  $0 monitor                  # Start real-time monitoring
  $0 generate                 # Generate all reports
  $0 ccusage daily           # Show daily token usage
  $0 status                  # Check system status

EOF
}

show_status() {
    log_info "Claude Code Monitor Status"
    echo
    
    # Check Claude directory
    if [ -d "$CLAUDE_DIR" ]; then
        echo -e "📁 Claude Directory: ${GREEN}✓${NC} $CLAUDE_DIR"
        
        # Count JSONL files
        JSONL_COUNT=$(find "$CLAUDE_DIR/projects" -name "*.jsonl" 2>/dev/null | wc -l)
        echo -e "📄 JSONL Files: ${GREEN}$JSONL_COUNT found${NC}"
    else
        echo -e "📁 Claude Directory: ${RED}✗${NC} Not found"
    fi
    
    # Check output directory
    if [ -d "$OUTPUT_DIR" ]; then
        echo -e "📂 Output Directory: ${GREEN}✓${NC} $OUTPUT_DIR"
        
        # List recent reports
        echo -e "📊 Recent Reports:"
        ls -la "$OUTPUT_DIR" | grep -E "(CLAUDE_CODE_|TOKEN_USAGE_)" | tail -3 | while read -r line; do
            echo -e "   ${BLUE}•${NC} $(echo "$line" | awk '{print $9, $6, $7, $8}')"
        done
    else
        echo -e "📂 Output Directory: ${RED}✗${NC} Not found"
    fi
    
    # Check scripts
    echo -e "🔧 Scripts Status:"
    for script in "claude_action_logger.py" "claude_realtime_monitor.py" "claude_report_generator.py"; do
        if [ -f "$SCRIPT_DIR/$script" ]; then
            echo -e "   ${GREEN}✓${NC} $script"
        else
            echo -e "   ${RED}✗${NC} $script (missing)"
        fi
    done
    
    # Check ccusage
    if command -v bunx &> /dev/null; then
        echo -e "💰 ccusage: ${GREEN}✓${NC} Available via bunx"
    elif command -v npx &> /dev/null; then
        echo -e "💰 ccusage: ${GREEN}✓${NC} Available via npx"
    else
        echo -e "💰 ccusage: ${RED}✗${NC} Not available"
    fi
    
    echo
}

run_ccusage() {
    local cmd="${2:-daily}"
    log_info "Running ccusage $cmd..."
    
    if command -v bunx &> /dev/null; then
        bunx ccusage "$cmd"
    else
        npx ccusage@latest "$cmd"
    fi
}

start_monitoring() {
    log_info "Starting real-time monitoring..."
    log_info "Press Ctrl+C to stop monitoring"
    echo
    
    cd "$SCRIPT_DIR"
    python3 claude_realtime_monitor.py --output-dir "$OUTPUT_DIR"
}

# Main command handling
case "${1:-help}" in
    "setup")
        log_info "🚀 Setting up Claude Code Monitor Suite..."
        check_dependencies
        install_ccusage
        setup_scripts
        generate_reports
        log_success "✅ Setup complete!"
        echo
        show_status
        ;;
    
    "monitor")
        check_dependencies
        start_monitoring
        ;;
    
    "generate")
        check_dependencies
        generate_reports
        ;;
    
    "logs")
        check_dependencies
        log_info "Generating detailed action logs..."
        cd "$SCRIPT_DIR"
        python3 claude_action_logger.py --output "$OUTPUT_DIR/CLAUDE_CODE_ACTION_LOG_$(date +%Y-%m-%d).md"
        ;;
    
    "dashboard")
        check_dependencies
        log_info "Generating token usage dashboard..."
        cd "$SCRIPT_DIR"
        python3 claude_report_generator.py --dashboard-only --output-dir "$OUTPUT_DIR"
        ;;
    
    "ccusage")
        run_ccusage "$@"
        ;;
    
    "status")
        show_status
        ;;
    
    "help"|*)
        show_usage
        ;;
esac

echo