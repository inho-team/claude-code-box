#!/bin/bash
# Create wrapper script so CLI launch works with spaces in path
cat > /usr/local/bin/claude-code-box << 'WRAPPER'
#!/bin/bash
exec "/opt/Claude Code Box/claude-code-box" --no-sandbox "$@"
WRAPPER
chmod +x /usr/local/bin/claude-code-box
