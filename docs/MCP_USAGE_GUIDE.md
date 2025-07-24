# 🥊 MCP Usage Guide - Kumar Prescod Boxing Website

## 🎯 **Quick Start Guide**

With all MCP servers now operational, here's your guide to leveraging the complete design-to-code ecosystem.

---

## 🚀 **Available MCP Servers**

### **1. Magic MCP - UI Component Generation**
**Best for**: Creating new boxing-themed React components

```bash
# Generate new components
claude --with-magic "create FightCard component with responsive design and boxing colors"

# Enhance existing components  
claude --with-magic "improve TrainingGrid with animated progress bars"

# Create entire page sections
claude --with-magic "design ChampionshipPage with trophy gallery and achievement timeline"
```

**Capabilities**:
- Boxing-themed React TypeScript components
- Responsive design with mobile-first approach
- Accessibility compliance (WCAG 2.1 AA)
- Integration with existing design tokens

### **2. Sequential-Thinking MCP - Complex Analysis**
**Best for**: Architectural decisions and systematic problem solving

```bash
# Code analysis
claude --with-sequential "analyze FighterCard component for performance optimization"

# Architecture planning
claude --with-sequential "design scalable system for managing multiple fighter profiles"

# Debugging complex issues
claude --with-sequential "investigate performance bottlenecks in training data visualization"
```

**Capabilities**:
- Multi-step problem decomposition
- Systematic code quality analysis  
- Performance optimization strategies
- Architecture review and recommendations

### **3. Context7 MCP - Documentation & Research**
**Best for**: Finding best practices and framework documentation

```bash
# React patterns
claude --with-context7 "find React TypeScript component composition patterns"

# Boxing domain research
claude --with-context7 "research sports website accessibility standards"

# Framework documentation
claude --with-context7 "get Framer Motion animation best practices"
```

**Capabilities**:
- Official library documentation access
- Framework-specific patterns and examples
- Industry best practices research
- Code example extraction

### **4. Filesystem MCP - Project Operations**
**Best for**: File management and project-scoped operations

```bash
# File analysis
claude --with-filesystem "analyze component usage across the project"

# Bulk operations
claude --with-filesystem "update all components to use new design tokens"

# Project structure
claude --with-filesystem "organize media assets by fight date and category"
```

**Capabilities**:
- Project-scoped file access (/Users/revalue.io/KumarPrescodBoxing/KumarPrescodBoxing-1)
- Automated file operations and updates
- Asset organization and management
- Code pattern analysis across files

### **5. Figma MCP - Design Integration** 
**Best for**: Direct design file access (when Figma files are available)

```bash
# Design extraction
claude --with-figma "extract FighterCard component from boxing design file"

# Design token sync
claude --with-figma "sync color palette from Figma design system"

# Asset export
claude --with-figma "export fight poster designs as optimized images"
```

**Status**: Connected but requires design files and authentication setup

---

## 🎨 **Boxing Component Development Workflows**

### **Workflow 1: New Component Creation**
```bash
# Step 1: Research patterns
claude --with-context7 "find React component patterns for sports statistics"

# Step 2: Generate component
claude --with-magic "create BoxingStatsCard with win/loss visualization using championship gold and boxing red colors"

# Step 3: Analyze and optimize
claude --with-sequential "review BoxingStatsCard for performance and accessibility"

# Step 4: Integrate into project
claude --with-filesystem "add BoxingStatsCard to component exports and update index"
```

### **Workflow 2: Component Enhancement**
```bash
# Step 1: Analyze current state
claude --with-sequential "analyze FighterCard component for improvement opportunities"

# Step 2: Research improvements
claude --with-context7 "find advanced React animation patterns for sports cards"

# Step 3: Implement enhancements
claude --with-magic "enhance FighterCard with hover animations and improved accessibility"

# Step 4: Validate changes
claude --with-filesystem "test FighterCard integration across all usage locations"
```

### **Workflow 3: Design System Updates**
```bash
# Step 1: Extract design tokens (when Figma available)
claude --with-figma "extract updated color palette and typography from design system"

# Step 2: Update token file
claude --with-filesystem "update design-tokens.ts with new boxing color schemes"

# Step 3: Propagate changes
claude --with-sequential "analyze impact of design token changes across components"

# Step 4: Update components
claude --with-magic "update all boxing components to use new design token structure"
```

---

## 🏗️ **Advanced Development Patterns**

### **Multi-Server Orchestration**
Combine multiple MCP servers for complex operations:

```bash
# Comprehensive component development
claude --with-sequential --with-magic --with-context7 "create complete FightResults component with data visualization, following React best practices, and implementing boxing design system"

# Full system analysis
claude --with-sequential --with-filesystem --with-context7 "analyze entire component library for consistency, performance, and best practice compliance"
```

### **Boxing-Specific Component Templates**

**Fighter Profile Components**:
```bash
claude --with-magic "create FighterProfile component with:
- Championship timeline visualization
- Fight record statistics with boxing red wins and gray losses  
- Training progress charts with intensity color coding
- Achievement gallery with championship gold highlights
- Social media integration with proper spacing"
```

**Event Management Components**:
```bash
claude --with-magic "create EventDashboard component with:
- Fight card lineup with fighter photos
- Ticket sales progress with animated counters
- Venue capacity visualization
- Countdown timer with boxing-themed styling
- Live streaming integration capabilities"
```

**Training Analytics Components**:
```bash
claude --with-magic "create TrainingAnalytics component with:
- Weekly/monthly training intensity heatmaps
- Performance progression charts
- Exercise type distribution with color coding
- Goal tracking with championship-themed progress bars
- Injury prevention recommendations display"
```

---

## 🎯 **Best Practices**

### **Design Token Usage**
Always use the boxing design tokens for consistency:

```typescript
// ✅ Correct - Use design tokens
style={{ color: designTokens.colors.primary.boxing_red }}
style={{ color: designTokens.colors.primary.championship_gold }}

// ❌ Incorrect - Hardcoded colors  
className="text-red-600"
className="text-yellow-400"
```

### **Component Development**
Follow the established patterns:

```typescript
// ✅ Proper TypeScript interface usage
interface FightPosterProps {
  event: Event;
  fighters: Fighter[];
  size?: ComponentSize;
  showCountdown?: boolean;
}

// ✅ Design token integration
import { designTokens } from '../../styles/design-tokens';

// ✅ Accessibility compliance
<button
  aria-label={`View ${fighter.name}'s profile`}
  className="focus:ring-2 focus:ring-boxing-red"
>
```

### **MCP Server Selection**
Choose the right server for each task:

- **Quick component generation**: Magic MCP
- **Complex architectural decisions**: Sequential-thinking MCP  
- **Research and documentation**: Context7 MCP
- **File operations and bulk changes**: Filesystem MCP
- **Design file access**: Figma MCP (when files available)

---

## 🚨 **Troubleshooting**

### **MCP Server Issues**
```bash
# Check server status
claude mcp list

# Restart specific server
claude mcp restart [server-name]

# Add missing server
claude mcp add [server-name] [command] --scope user
```

### **Component Issues**
```bash
# Validate TypeScript
npm run build

# Check component exports
claude --with-filesystem "verify all component exports in index.ts"

# Test component integration
claude --with-sequential "analyze component dependencies and potential conflicts"
```

### **Design Token Issues**
```bash
# Validate design token usage
claude --with-filesystem "find all hardcoded colors that should use design tokens"

# Update component styling
claude --with-magic "update [ComponentName] to use proper boxing design tokens"
```

---

## 📈 **Performance Optimization**

### **Component Performance**
```bash
# Analyze component performance
claude --with-sequential "analyze [ComponentName] for performance bottlenecks and optimization opportunities"

# Implement optimizations
claude --with-magic "optimize [ComponentName] with React.memo, useMemo, and proper animation performance"
```

### **Bundle Analysis**
```bash
# Check bundle size impact
npm run build

# Analyze component size
claude --with-filesystem "analyze component bundle impact and suggest code splitting opportunities"
```

---

## 🎊 **Success Examples**

### **Components Successfully Created**
1. **FightPosterCard** - Dynamic fight promotion with countdown timer
2. **TrainingStatsWidget** - Performance metrics with intensity visualization  
3. **EnhancedHeroSection** - Animated fighter spotlight with achievements
4. **Enhanced FighterCard** - Proper design token integration

### **Integration Achievements**
- ✅ All components use boxing design tokens
- ✅ TypeScript compilation successful
- ✅ Proper component export structure
- ✅ Responsive design implementation
- ✅ Accessibility compliance integrated

---

**This comprehensive MCP ecosystem provides everything needed for rapid, high-quality boxing website component development with automated design integration capabilities.** 🥊🏆