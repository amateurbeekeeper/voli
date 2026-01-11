# Repository Rules & Guidelines

This document outlines the rules and guidelines for contributing to the Voli project.

## 1. Commit Workflow

**Guideline: Commit changes after every meaningful change.**

### When to Commit

Make a commit when you've completed:
- ✅ A feature or task
- ✅ A bug fix
- ✅ Documentation updates
- ✅ Configuration changes
- ✅ A logical unit of work

### Benefits of Incremental Commits

- **Clean history**: Each commit represents a single logical change
- **Easier review**: Small, focused commits are easier to review
- **Better debugging**: Can easily identify which commit introduced a change
- **Easier rollback**: Can revert specific changes without affecting others
- **Clearer progress**: Git history shows incremental progress

### Important Notes

- This is a **guideline**, not automatically enforced (commit frequency depends on context)
- Avoid accumulating large batches of unrelated changes
- Use your judgment - some changes naturally go together
- The goal is **incremental, logical commits**, not necessarily one commit per file edit

---

## 2. Commit Messages

**REQUIRED: All commits MUST follow the standardized format below.**

This is mandatory - commits that don't follow this format will be rejected or asked to be amended.

### Commit Message Format (REQUIRED)

Every commit message MUST follow this exact format:

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Rules

1. **Type and scope are REQUIRED** - Every commit must have both
2. **Subject is REQUIRED** - Must be a clear, concise description
3. **Format MUST match exactly** - No deviations allowed

### Commit Types (REQUIRED - choose exactly one)

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Code style changes (formatting, whitespace, etc.)
- `refactor`: Code refactoring (no feature change or bug fix)
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system or dependency changes
- `ci`: CI/CD configuration changes
- `chore`: Other changes (maintenance, config, etc.)

### Scopes (REQUIRED - choose one or more, comma-separated)

Common scopes:
- `api`: Backend API changes
- `web`: Frontend web app changes
- `ui`: UI component library changes
- `docs`: Documentation changes
- `vercel`: Vercel deployment/config
- `azure`: Azure deployment/config
- `deps`: Dependencies
- `config`: Configuration files
- `scripts`: Script files
- `types`: TypeScript types

**Examples:**
- `feat(api):` - API feature
- `fix(web,ui):` - Fix affecting both web and UI
- `docs:` - Documentation (scope can be omitted if obvious)

### Subject Line Rules (REQUIRED)

1. **Use imperative mood**: "Add feature" ✅, NOT "Added feature" ❌ or "Adds feature" ❌
2. **50 characters or less**
3. **Capitalize first letter**
4. **No period at end**
5. **Lowercase after the colon** (unless proper noun)

### Body (Optional but Recommended)

- Explain *what* and *why*, not just *how*
- Wrap at 72 characters
- Use bullet points (`-`) for multiple changes
- Separate from subject with blank line

### Footer (Optional)

- Reference issues: `Closes #123`, `Fixes #456`
- Breaking changes: `BREAKING CHANGE: <description>`

### Examples

**✅ GOOD - Simple fix:**
```
fix(vercel): correct output directory for web root
```

**✅ GOOD - Feature with body:**
```
feat(api): add user authentication endpoint

- Implement POST /api/auth/login endpoint
- Add JWT token generation
- Include refresh token support
- Add error handling for invalid credentials

Closes #123
```

**✅ GOOD - Fix with scope:**
```
fix(web): resolve Tailwind CSS v4 compatibility

- Update PostCSS config to use @tailwindcss/postcss
- Fix CSS import paths in Next.js layout
- Replace @apply directives with direct CSS

Fixes #456
```

**✅ GOOD - Docs:**
```
docs: add Azure AD authentication setup guide

- Document Azure AD registration steps
- Include configuration examples
- Add deployment instructions
```

**✅ GOOD - Multiple scopes:**
```
refactor(api,web): standardize error handling

- Create shared error response format
- Update API controllers to use new format
- Update web app error handling
```

**❌ BAD - Missing type:**
```
Update vercel config
```

**❌ BAD - Missing scope:**
```
fix: build error
```

**❌ BAD - Wrong mood:**
```
feat(api): Added new endpoint
```

**❌ BAD - Too long:**
```
fix(web): resolve issue with very long subject line that exceeds the character limit
```

**❌ BAD - No format:**
```
wip
changes
update
```

### Quick Reference Template

```
<type>(<scope>): <subject>

- What changed
- Why it changed
- Impact/notes

Refs #123
```

### Enforcement ✅

**Commit message enforcement is ACTIVE and REQUIRED.**

All commits are automatically validated using commitlint via git hooks. Invalid commit messages will be rejected.

**What's enforced:**
- ✅ Commit type must be valid (`feat`, `fix`, `docs`, etc.)
- ✅ Scope must be valid (`api`, `web`, `ui`, etc.)
- ✅ Format must match: `<type>(<scope>): <subject>`
- ✅ Subject must follow rules (imperative mood, length, etc.)
- ✅ Type and scope must be lowercase

**If your commit is rejected:**
- You'll see helpful error messages
- Fix the format and try again
- See examples above for correct format

**Setup details:**
- Git commit template: `.gitmessage` (already configured)
- Commitlint: `commitlint.config.js` (already configured)
- Git hooks: `.husky/commit-msg` (automatically runs)

See [COMMIT_MESSAGE_SETUP.md](./COMMIT_MESSAGE_SETUP.md) for more details.

### Why This Standard Matters

- **Consistency**: All commits look professional and uniform
- **History**: Easy to search and understand commit history
- **Automation**: Can generate changelogs automatically
- **Debugging**: Quickly identify what changed and why
- **Team Collaboration**: Clear communication about changes

## Future Rules

More rules will be added here as needed.
