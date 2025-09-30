# Contributing to Cosmic Legends RPG MultiversX

🚀 **Thank you for your interest in contributing to Cosmic Legends RPG!** 

We're excited to have you join our mission to build the most innovative AI-powered blockchain RPG on MultiversX. This document will guide you through the contribution process.

## 🌟 Ways to Contribute

- **🐛 Bug Reports**: Found a bug? Let us know!
- **💡 Feature Requests**: Have an idea? We'd love to hear it!
- **🔧 Code Contributions**: Fix bugs, implement features, improve performance
- **📚 Documentation**: Help improve our docs, tutorials, and guides
- **🎨 Design**: UI/UX improvements, game assets, visual enhancements
- **🧪 Testing**: Help test new features and report issues

## 🛠️ Development Setup

### Prerequisites

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- **Rust**: Latest stable version (for smart contracts)
- **Git**: For version control
- **Code Editor**: VS Code recommended with extensions:
  - TypeScript and JavaScript
  - Rust Analyzer
  - Tailwind CSS IntelliSense
  - Prettier
  - ESLint

### Getting Started

1. **Fork the repository**
   ```bash
   # Fork the repo on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/cosmic-legends-rpg-multiversx.git
   cd cosmic-legends-rpg-multiversx
   ```

2. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/Gzeu/cosmic-legends-rpg-multiversx.git
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Set up environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your development configuration
   ```

5. **Build smart contracts**
   ```bash
   npm run contracts:build
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

## 📋 Development Workflow

### Before You Start

1. **Check existing issues** to avoid duplicating work
2. **Create or comment on an issue** to discuss your contribution
3. **Wait for approval** on significant changes before starting work

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make your changes**
   - Write clean, readable code
   - Follow the existing code style
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**
   ```bash
   # Run all tests
   npm test
   
   # Type checking
   npm run type-check
   
   # Lint your code
   npm run lint
   
   # Test smart contracts
   npm run contracts:test
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing new feature"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Use the PR template
   - Provide a clear description
   - Link related issues
   - Request review from maintainers

## 📝 Coding Standards

### TypeScript/JavaScript

- **Strict TypeScript**: Use strict mode, avoid `any`
- **Functional Components**: Use React function components with hooks
- **Named Exports**: Prefer named exports over default exports
- **Descriptive Names**: Use clear, descriptive variable and function names

```typescript
// ✅ Good
interface HeroAttributes {
  strength: number;
  intelligence: number;
  agility: number;
}

const generateHero = (attributes: HeroAttributes): Hero => {
  // Implementation
};

// ❌ Avoid
const doStuff = (data: any) => {
  // Implementation
};
```

### React Components

- **Use TypeScript interfaces** for props
- **Implement error boundaries** for critical components
- **Optimize performance** with memo, useMemo, useCallback when needed
- **Follow component composition** patterns

```tsx
// ✅ Good
interface HeroCardProps {
  hero: Hero;
  onSelect: (heroId: string) => void;
  isSelected?: boolean;
}

const HeroCard: React.FC<HeroCardProps> = ({ 
  hero, 
  onSelect, 
  isSelected = false 
}) => {
  // Implementation
};

export { HeroCard };
```

### Rust Smart Contracts

- **Follow MultiversX conventions**
- **Write comprehensive tests**
- **Use descriptive error messages**
- **Optimize for gas efficiency**
- **Document complex functions**

```rust
// ✅ Good
#[endpoint]
fn create_hero(
    &self,
    hero_name: ManagedBuffer,
    hero_class: HeroClass,
) -> SCResult<TokenIdentifier> {
    require!(
        !hero_name.is_empty(), 
        "Hero name cannot be empty"
    );
    
    // Implementation
    Ok(token_id)
}
```

### CSS/Styling

- **Use Tailwind CSS** for styling
- **Follow mobile-first** approach
- **Use CSS custom properties** for theme values
- **Maintain consistent spacing** using Tailwind scale

```tsx
// ✅ Good
const HeroCard = () => (
  <div className="
    relative overflow-hidden rounded-lg 
    bg-gradient-to-br from-cosmic-purple to-cosmic-blue
    p-6 shadow-cosmic transition-transform
    hover:scale-105 hover:shadow-cosmic-lg
  ">
    {/* Content */}
  </div>
);
```

## 🧪 Testing Guidelines

### Frontend Tests

- **Unit tests** for utility functions
- **Component tests** for UI components
- **Integration tests** for complex workflows
- **E2E tests** for critical user journeys

```typescript
// ✅ Good test example
describe('HeroGenerator', () => {
  it('should generate hero with valid attributes', () => {
    const hero = generateHero({
      strength: 10,
      intelligence: 8,
      agility: 12
    });
    
    expect(hero).toBeDefined();
    expect(hero.totalPower).toBe(30);
  });
});
```

### Smart Contract Tests

- **Test all endpoints**
- **Test error conditions**
- **Test edge cases**
- **Test gas consumption**

```rust
#[test]
fn test_create_hero_success() {
    let mut setup = HeroesContractSetup::new(heroes_contract::contract_obj);
    
    setup.blockchain_wrapper.execute_tx(&setup.owner_address, &setup.contract_wrapper, &rust_biguint!(0), |sc| {
        let result = sc.create_hero(
            managed_buffer!(b"TestHero"),
            HeroClass::Warrior
        );
        assert!(result.is_ok());
    }).assert_ok();
}
```

## 📚 Documentation

### Code Documentation

- **Document complex functions** with JSDoc/RustDoc
- **Explain business logic** and algorithms
- **Provide usage examples**
- **Keep docs up to date** with code changes

```typescript
/**
 * Generates a new AI-powered hero with randomized attributes
 * 
 * @param aiPrompt - The AI prompt for hero generation
 * @param rarity - The desired rarity level (Common to Legendary)
 * @returns Promise resolving to the generated hero data
 * 
 * @example
 * ```typescript
 * const hero = await generateAIHero(
 *   "Create a fire-wielding warrior",
 *   HeroRarity.Rare
 * );
 * ```
 */
const generateAIHero = async (
  aiPrompt: string, 
  rarity: HeroRarity
): Promise<Hero> => {
  // Implementation
};
```

### README Updates

- **Update installation steps** if dependencies change
- **Document new features** with examples
- **Keep API references** current
- **Update roadmap** progress

## 🚀 Pull Request Guidelines

### PR Title Format

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### PR Description Template

```markdown
## 📝 Description
Brief description of what this PR does.

## 🔗 Related Issue
Closes #123

## 🧪 Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## 📸 Screenshots (if applicable)
[Add screenshots for UI changes]

## ✅ Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Tests pass locally
- [ ] Documentation updated
- [ ] No breaking changes (or clearly documented)
```

### Review Process

1. **Automated checks** must pass
2. **At least one maintainer** review required
3. **All conversations resolved**
4. **CI/CD pipeline** passes
5. **Squash and merge** preferred

## 🐛 Bug Reports

### Before Reporting

- **Search existing issues** to avoid duplicates
- **Use the latest version** of the project
- **Test in different browsers/environments**

### Bug Report Template

```markdown
## 🐛 Bug Description
Clear description of the bug.

## 🔄 Steps to Reproduce
1. Go to...
2. Click on...
3. See error...

## ✅ Expected Behavior
What should happen?

## ❌ Actual Behavior
What actually happens?

## 🌍 Environment
- OS: [e.g., macOS 12.0]
- Browser: [e.g., Chrome 95.0]
- Node.js: [e.g., 18.15.0]
- npm: [e.g., 9.5.0]

## 📎 Additional Context
Any other context, screenshots, or logs.
```

## 💡 Feature Requests

### Feature Request Template

```markdown
## 🚀 Feature Description
Clear description of the feature.

## 🎯 Problem Statement
What problem does this solve?

## 💭 Proposed Solution
How should this be implemented?

## 🔄 Alternatives Considered
Other solutions you considered.

## 📈 Additional Context
Any other context or mockups.
```

## 🏆 Recognition

We value all contributions! Contributors will be:

- **Listed in our README** contributors section
- **Mentioned in release notes** for significant contributions
- **Invited to our Discord** contributor channel
- **Given priority access** to beta features

## 📞 Getting Help

- **GitHub Discussions**: For questions and discussions
- **GitHub Issues**: For bugs and feature requests
- **Discord**: [Coming Soon] For real-time chat
- **Email**: pricopgeorge@gmail.com for sensitive issues

## 📄 License

By contributing, you agree that your contributions will be licensed under the same MIT License that covers the project.

---

<p align="center">
  <strong>🌟 Thank you for contributing to Cosmic Legends RPG! 🌟</strong>
</p>