# Figma MCP Server Testing Guide

## Connection Status ✅
- **Server URL**: http://127.0.0.1:3845/sse
- **Protocol**: Server-Sent Events (SSE)
- **Status**: Active (confirmed via `/mcp` command)

## Testing Checklist

### Basic Connectivity Test
- [ ] Figma Desktop app is running
- [ ] Dev Mode MCP server is enabled in Figma Preferences
- [ ] Port 3845 is accessible locally
- [ ] Claude can connect to the Figma MCP server

### Design Access Test
To test if Claude can access your Figma designs, try these commands:

```
# Test 1: List available Figma files
"Can you see any Figma files through the MCP server?"

# Test 2: Access specific design
"Show me the components from my boxing website design in Figma"

# Test 3: Extract design tokens
"What colors and typography are defined in my Figma design system?"
```

### Boxing Website Specific Tests
- [ ] Access to boxing poster/promotional designs
- [ ] Fighter profile card components
- [ ] Event layout designs
- [ ] Brand colors and typography
- [ ] UI component library

## Common Issues & Solutions

### Issue: "Cannot connect to Figma MCP server"
**Solution**: 
1. Ensure Figma Desktop app is running
2. Check Preferences → Enable Dev Mode MCP Server
3. Restart Figma Desktop app
4. Verify you have the correct plan (Professional/Organization/Enterprise)

### Issue: "No designs accessible"
**Solution**:
1. Open the design file in Figma Desktop
2. Ensure you have edit or view access to the file
3. Try refreshing the MCP connection

### Issue: "Components not extractable"
**Solution**:
1. Ensure components are properly named in Figma
2. Check that components use auto-layout
3. Verify design system is set up with proper tokens

## Next Steps After Verification
1. Document accessible design files
2. Set up component extraction workflow
3. Configure design-to-code automation
4. Create boxing-specific component templates