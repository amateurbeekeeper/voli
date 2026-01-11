# Repository Rules & Guidelines

This document outlines the rules and guidelines for contributing to the Voli project.

## 1. Commit Messages

**Always write detailed, meaningful commit messages.**

### Commit Message Format

Follow this format for all commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Commit Types

Use one of the following types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `build`: Changes that affect the build system or external dependencies (example scopes: npm, pnpm, dotnet)
- `ci`: Changes to CI configuration files and scripts
- `chore`: Other changes that don't modify src or test files

### Examples

**Good commit messages:**
```
feat(api): Add user authentication endpoint

- Implement POST /api/auth/login endpoint
- Add JWT token generation
- Include refresh token support
- Add error handling for invalid credentials

Closes #123
```

```
fix(web): Resolve Tailwind CSS v4 compatibility issue

- Update PostCSS config to use @tailwindcss/postcss
- Fix CSS import paths in Next.js layout
- Replace @apply directives with direct CSS for v4 compatibility

Fixes #456
```

```
docs: Add Storybook setup instructions

- Document how to run Storybook locally
- Add troubleshooting section for common issues
- Include examples of component stories
```

**Bad commit messages:**
```
fix: bug
update
changes
wip
```

### Commit Message Guidelines

1. **Subject line:**
   - Use imperative mood ("Add feature" not "Added feature" or "Adds feature")
   - First line should be 50 characters or less
   - Capitalize the first letter
   - No period at the end

2. **Body (if needed):**
   - Explain *what* and *why* vs. *how*
   - Wrap at 72 characters
   - Use bullet points for multiple changes
   - Reference issues/PRs when applicable

3. **Footer (optional):**
   - Reference issue numbers: `Closes #123`, `Fixes #456`
   - Breaking changes: `BREAKING CHANGE: description of what broke`

### Why Detailed Commit Messages Matter

- **History**: Makes it easy to understand why changes were made
- **Debugging**: Helps identify when and why bugs were introduced
- **Review**: Makes code reviews more efficient
- **Documentation**: Serves as project documentation over time
- **Collaboration**: Helps team members understand changes without reading code

## Future Rules

More rules will be added here as needed.
