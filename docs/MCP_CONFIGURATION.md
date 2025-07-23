# MCP Server Configuration Guide

## Overview
This document outlines the Model Context Protocol (MCP) server configuration for the Kumar Prescod Boxing website. MCP servers provide AI assistants with secure access to external tools, APIs, and resources.

## Current Configuration

### Global MCP Servers (`~/.claude/settings.json`)

#### Core Framework Servers
- **sequential-thinking**: Complex multi-step analysis and problem solving
- **context7**: Library documentation and research capabilities  
- **magic**: UI component generation and design system integration
- **playwright**: Browser automation and cross-browser testing

#### Development Servers
- **github**: GitHub API integration for repository management
- **filesystem**: Local file system access with project-specific scope
- **fetch**: HTTP request capabilities for API testing
- **puppeteer**: Browser automation for testing and scraping
- **sqlite**: Database operations for local data storage
- **memory**: Session memory management for context retention

### Claude Desktop Servers (`claude_desktop_config.json`)

#### Business Integration
- **hubspot**: CRM and marketing automation (token secured)
- **figma**: Design collaboration and asset management

### Project-Specific Configuration (`.claude.json`)

#### React/TypeScript Optimizations
- Framework-aware development assistance
- TypeScript-specific code generation
- Tailwind CSS integration
- Testing framework support (Jest)

#### Boxing Domain Features
- Fight record management
- Training progress tracking
- Media asset organization
- E-commerce integration (Stripe, Firebase)

## Security Enhancements

### Environment Variables (`.env.local`)
- `HUBSPOT_PRIVATE_APP_ACCESS_TOKEN`: HubSpot API access
- `GITHUB_PERSONAL_ACCESS_TOKEN`: GitHub API access
- `STRIPE_SECRET_KEY`: Payment processing
- `FIREBASE_PRIVATE_KEY`: Authentication and database

### Permission System
- Explicit allow/deny rules for bash commands
- Domain-restricted WebFetch access
- Development tool permissions (npm, git, node)
- Security safeguards against destructive operations

## Asset Management (`.mcp-assets.json`)

### Media Optimization
- **Images**: WebP/AVIF conversion, responsive sizing, progressive loading
- **Videos**: Multi-format encoding, thumbnail generation, compression
- **CDN Integration**: Cloudflare optimization, caching strategies

### Boxing-Specific Features
- Fight media categorization and metadata
- Training progression tracking
- Before/after comparison tools
- Auto-tagging and organization

## Development Workflow (`.mcp-workflow.json`)

### Testing Infrastructure
- **Unit Tests**: Jest with React Testing Library
- **E2E Tests**: Playwright across multiple browsers
- **Accessibility**: WCAG compliance scanning
- **Performance**: Lighthouse CI integration

### Deployment Pipeline
- **Environments**: Development, staging, production
- **Providers**: Vercel (primary), Netlify (backup)
- **Validation**: Automated smoke tests and performance monitoring

### Boxing Workflow
- **Content Pipeline**: Fight updates, training logs, media processing
- **Fan Engagement**: Ticket sales, merchandise inventory
- **Automation**: Git hooks, CI/CD, content publishing

## Usage Examples

### Development Tasks
```bash
# Start development with MCP assistance
claude --mcp sequential-thinking,magic,context7

# Run comprehensive testing
claude --mcp playwright "test all user flows"

# Optimize media assets
claude --mcp filesystem "optimize images in public/images/"
```

### Content Management
```bash
# Update fight information
claude --mcp hubspot,github "publish fight results"

# Generate promotional content
claude --mcp magic,figma "create fight poster components"
```

### Performance Optimization
```bash
# Analyze bundle size
claude --mcp puppeteer "audit performance metrics"

# Optimize images
claude --mcp filesystem "compress training photos"
```

## Best Practices

### Security
1. Never commit `.env.local` to version control
2. Use environment variables for all sensitive tokens
3. Regularly rotate API keys and access tokens
4. Monitor MCP server access logs

### Performance
1. Enable only necessary MCP servers for each task
2. Use asset optimization servers for media-heavy operations
3. Leverage caching strategies for repeated operations
4. Monitor token usage and optimize queries

### Development
1. Use project-specific configurations for domain expertise
2. Combine multiple servers for complex workflows
3. Test MCP integrations in staging environments
4. Document custom server configurations

## Troubleshooting

### Common Issues
- **Server Connection**: Check network connectivity and server status
- **Authentication**: Verify environment variables and token validity
- **Permissions**: Review allow/deny rules in settings
- **Performance**: Monitor resource usage and optimize queries

### Debug Commands
```bash
# Test MCP server connectivity
claude mcp list

# Validate configuration
claude mcp test [server-name]

# Check permissions
claude --debug permissions
```

## Future Enhancements

### Planned Additions
- Sports analytics MCP server for fight statistics
- Social media integration for automated posting
- Video processing server for highlight reels
- Inventory management for merchandise

### Boxing Domain Servers
- Fight scheduling and venue management
- Training partner and sparring management  
- Nutrition and weight tracking
- Fan engagement and community features

---

For more information, see the official MCP documentation at https://docs.anthropic.com/en/docs/claude-code/mcp