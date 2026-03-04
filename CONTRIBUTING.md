# Contributing to Cypress Enterprise Framework

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## Code of Conduct
- Be respectful and inclusive
- Focus on the code, not the person
- Help others learn and grow

## Development Workflow

### 1. Create a Feature Branch
```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

### 2. Make Changes
- Follow the existing code style
- Keep commits small and focused
- Write descriptive commit messages
- Use signed commits: `git commit -S -m "message"`

### 3. Push and Create PR
```bash
git push -u origin feature/your-feature-name
```
Create a Pull Request to `develop` branch

### 4. Code Review
- Address all feedback
- Keep PRs focused and reasonably sized
- Ensure all CI checks pass
- Wait for required approvals

### 5. Merge Process
- At least 1 approval required for `develop`
- At least 2 approvals required for `main`
- All CI checks must pass
- Branch must be up to date

## Commit Message Format

```
type(scope): subject

body

footer
```

Types: feat, fix, docs, style, refactor, test, chore

Example:
```
feat(selectors): add data-test attributes for login form

Updated the login form component to include data-test attributes
for improved test reliability.

Closes #123
```

## Security Policy

### Reporting Security Issues
**DO NOT** open a public issue for security vulnerabilities.
Email: [security contact needed]

### Security Considerations
- Don't commit secrets or credentials
- Review code for hardcoded URLs
- Ensure tests don't expose sensitive data
- Keep dependencies updated

## Testing Requirements

All PRs must:
- ✅ Pass all existing tests
- ✅ Include new tests for new features
- ✅ Have > 80% code coverage (where applicable)
- ✅ Run against the CI pipeline successfully

## Before Submitting

- [ ] Read this guide
- [ ] Create feature branch from `develop`
- [ ] Make atomic commits with clear messages
- [ ] Push to your fork
- [ ] Create PR with clear description
- [ ] Ensure all CI checks pass
- [ ] Address review feedback

## Questions?

- Check existing issues and discussions
- Review the README.md for architecture details
- Ask in PRs if you need clarification

Thank you for contributing! 🎉
