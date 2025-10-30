# Contributing to AuraFlow POS

Thank you for your interest in contributing to AuraFlow POS! 🎉

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Plugin Development](#plugin-development)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Documentation](#documentation)

---

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Follow best practices

---

## Getting Started

1. **Fork the repository**
2. **Clone your fork:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/auraflow-pos.git
   cd auraflow-pos
   ```
3. **Add upstream remote:**
   ```bash
   git remote add upstream https://github.com/ORIGINAL/auraflow-pos.git
   ```
4. **Install dependencies:**
   ```bash
   npm install
   ```
5. **Start development:**
   ```bash
   npm run dev
   ```

---

## Development Setup

### Prerequisites
- Node.js 18+ and npm
- Git
- Code editor (VS Code recommended)

### Recommended VS Code Extensions
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features

### Environment
No environment variables needed for development - everything works out of the box!

---

## Project Structure

```
auraflow-pos/
├── components/          # React components
│   ├── admin/          # Admin dashboard modules
│   ├── animated/       # Animated UI components
│   ├── ui/             # shadcn/ui library
│   └── *.tsx           # Core POS components
├── plugins/            # Plugin modules
│   ├── _registry.ts    # Plugin registry
│   └── [plugin-name]/  # Individual plugins
├── core/               # Plugin system core
│   ├── lib/           # Plugin manager
│   ├── contexts/      # React contexts
│   └── hooks/         # Hooks
├── lib/                # Utilities & state
│   ├── store.ts       # Zustand global state
│   ├── types.ts       # TypeScript definitions
│   └── api/           # API clients
├── presets/            # Business profiles
├── docs/               # Documentation
└── backend/            # Print server
```

---

## Coding Standards

### TypeScript

**Always use TypeScript:**
```typescript
// ✅ Good
interface Product {
  id: string;
  name: string;
  price: number;
}

function addProduct(product: Product): void {
  // ...
}

// ❌ Bad
function addProduct(product) {
  // ...
}
```

**Use proper types:**
```typescript
// ✅ Good
import { Product } from '@/lib/types';

// ❌ Bad
const product: any = { ... };
```

### React Components

**Use functional components:**
```typescript
// ✅ Good
export function MyComponent({ prop1, prop2 }: Props) {
  return <div>...</div>;
}

// ❌ Bad
export class MyComponent extends React.Component {
  // ...
}
```

**Use hooks properly:**
```typescript
// ✅ Good
const [state, setState] = useState<string>('');
const store = useStore(state => state.products);

// ❌ Bad
const [state, setState] = useState(); // No type
```

### Naming Conventions

- **Components:** PascalCase (`ProductGrid.tsx`)
- **Functions:** camelCase (`addToCart`)
- **Constants:** UPPER_SNAKE_CASE (`MAX_ITEMS`)
- **Files:** kebab-case for utilities (`receipt-utils.ts`)
- **Plugins:** kebab-case folder, PascalCase id (`table-management`)

### File Organization

**Component files:**
```typescript
// Imports
import { useState } from 'react';
import { Button } from './ui/button';
import { useStore } from '@/lib/store';

// Types
interface Props {
  // ...
}

// Component
export function MyComponent({ ... }: Props) {
  // Hooks
  const [state, setState] = useState();
  const store = useStore();
  
  // Handlers
  const handleClick = () => { ... };
  
  // Render
  return (
    <div>...</div>
  );
}
```

### Tailwind CSS

**Follow the semantic token system:**
```typescript
// ✅ Good - Use semantic tokens
<div className="bg-background text-foreground border-border">

// ❌ Bad - Don't use raw colors
<div className="bg-gray-900 text-white border-gray-800">
```

**Don't override typography unless necessary:**
```typescript
// ✅ Good - Let globals.css handle it
<h1>My Title</h1>

// ❌ Bad - Don't override font sizes
<h1 className="text-4xl font-bold">My Title</h1>
```

---

## Plugin Development

### Creating a New Plugin

1. **Create plugin folder:**
   ```bash
   mkdir -p plugins/my-plugin/components
   ```

2. **Create manifest** (`plugins/my-plugin/index.ts`):
   ```typescript
   import { Plugin } from '@/core/lib/types/plugin.types';
   
   export const myPlugin: Plugin = {
     id: 'my-plugin',
     name: 'My Plugin',
     version: '1.0.0',
     description: 'What it does',
     category: 'retail', // or 'restaurant', 'healthcare', 'services'
     tier: 'professional', // or 'starter', 'ultimate'
     dependencies: [], // Other plugin IDs it needs
     
     components: {
       SettingsPage: () => import('./components/SettingsPage'),
     }
   };
   ```

3. **Register plugin** (in `plugins/_registry.ts`):
   ```typescript
   import { myPlugin } from './my-plugin';
   
   export const pluginRegistry = {
     // ... existing plugins
     'my-plugin': myPlugin,
   };
   ```

4. **Add to package config** (`config/plugins.config.ts`):
   ```typescript
   export const packageConfig = {
     professional: {
       pluginIds: [
         // ... existing
         'my-plugin',
       ],
     },
   };
   ```

### Plugin Component Example

```typescript
// plugins/my-plugin/components/SettingsPage.tsx
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function SettingsPage() {
  return (
    <Card>
      <h2>My Plugin Settings</h2>
      {/* Your settings UI */}
    </Card>
  );
}
```

### Using Plugins in Components

```typescript
import { usePlugin } from '@/core/hooks/usePlugin';

export function MyComponent() {
  const plugin = usePlugin('my-plugin');
  
  // Don't render if plugin is not active
  if (!plugin?.isActive) return null;
  
  return <div>Plugin is active!</div>;
}
```

---

## Testing

### Manual Testing Checklist

Before submitting a PR, test:

**Core Functionality:**
- [ ] Add items to cart
- [ ] Apply discounts
- [ ] Complete checkout (all payment methods)
- [ ] Print receipt
- [ ] Process return
- [ ] Void item

**Plugin Functionality:**
- [ ] Plugin activates/deactivates correctly
- [ ] Settings page works
- [ ] No errors when plugin is inactive

**UI/UX:**
- [ ] No console errors
- [ ] Responsive on mobile
- [ ] Animations work smoothly
- [ ] Forms validate correctly

### Automated Testing (Coming Soon)

```bash
npm test           # Run unit tests
npm run test:e2e   # Run end-to-end tests
```

---

## Submitting Changes

### Workflow

1. **Create a branch:**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make changes:**
   - Write code
   - Test thoroughly
   - Update documentation

3. **Commit:**
   ```bash
   git add .
   git commit -m "feat: add my feature"
   ```

4. **Push:**
   ```bash
   git push origin feature/my-feature
   ```

5. **Create Pull Request:**
   - Go to GitHub
   - Click "New Pull Request"
   - Fill in description
   - Link related issues

### Commit Message Format

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

**Examples:**
```bash
feat(plugins): add inventory tracking plugin
fix(cart): calculate tax correctly for discounted items
docs(readme): update installation instructions
refactor(store): simplify state management
```

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested manually
- [ ] Added/updated tests
- [ ] All tests pass

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console warnings/errors
```

---

## Documentation

### When to Update Docs

**Always update documentation when:**
- Adding a new feature
- Changing existing behavior
- Adding a plugin
- Modifying configuration
- Fixing a documented bug

### Documentation Files

- **README.md** - Project overview
- **QUICK_START.md** - Quick start guide
- **docs/USER_GUIDE.md** - User manual
- **docs/ADMIN_GUIDE.md** - Admin guide
- **docs/ARCHITECTURE.md** - Technical architecture
- **Plugin READMEs** - Plugin-specific docs

### Documentation Style

**Be clear and concise:**
```markdown
✅ Good:
Click the **Checkout** button to process payment.

❌ Bad:
In order to complete the transaction, the user should
click on the button that says "Checkout" which can be
found at the bottom of the cart area.
```

**Use examples:**
```markdown
✅ Good:
Example: `addToCart(product, variation, modifiers)`

❌ Bad:
Call the function with appropriate parameters.
```

---

## Code Review Process

### What Reviewers Look For

1. **Functionality**
   - Does it work as intended?
   - Edge cases handled?
   - No regressions?

2. **Code Quality**
   - Follows style guide?
   - TypeScript types correct?
   - Clean and readable?

3. **Performance**
   - No unnecessary re-renders?
   - Efficient algorithms?
   - Bundle size impact?

4. **Documentation**
   - Code commented where needed?
   - Docs updated?
   - Examples provided?

### Addressing Feedback

- Respond to all comments
- Make requested changes
- Ask questions if unclear
- Thank reviewers

---

## Questions?

- **Documentation:** Check [docs/README.md](docs/README.md)
- **Discussions:** GitHub Discussions
- **Issues:** GitHub Issues

---

## Thank You! 🎉

Your contributions make AuraFlow POS better for everyone!

---

**Back to [README](README.md)**
