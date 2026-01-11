# Commit Message Setup Guide

## Automatic Setup (For New Developers)

When you clone this repository and run `pnpm install`, commit message enforcement is **automatically set up** via husky hooks.

### What Happens Automatically

1. **Husky hooks are installed** - The `prepare` script in `package.json` runs `husky` which sets up git hooks
2. **Commitlint is installed** - Part of dev dependencies
3. **Hooks are activated** - The `.husky/commit-msg` hook validates every commit

### Optional: Configure Git Commit Template

For a better commit experience, configure the git commit template:

```bash
# Configure git to use the template
git config commit.template .gitmessage

# Verify it's set
git config commit.template
# Should show: .gitmessage
```

Or run the setup script:
```bash
bash scripts/setup-commit-enforcement.sh
```

Now when you run `git commit` (without `-m`), your editor will open with the template.

### Verify Setup

Try making a commit:
```bash
# ✅ Good commit (will pass)
git commit -m "feat(api): add authentication endpoint"

# ❌ Bad commit (will fail)
git commit -m "fix: bug"
# Error: scope may not be empty
```

## Commitlint Enforcement ✅ (Already Set Up)

Commitlint is **already configured and enforced** via git hooks. All commits are automatically validated when you commit.

**What's installed:**
- ✅ `@commitlint/cli` - Commit message linter
- ✅ `@commitlint/config-conventional` - Conventional commits config
- ✅ `husky` - Git hooks manager
- ✅ `commitlint.config.js` - Custom configuration
- ✅ `.husky/commit-msg` - Git hook that enforces commit format

**How it works:**
- Every time you commit, the `commit-msg` hook runs automatically
- Commitlint validates your commit message against the rules
- Invalid commit messages are rejected
- You'll see helpful error messages showing what's wrong

**Try it now:**
```bash
# This will PASS ✅
git commit -m "feat(api): add authentication endpoint"

# This will FAIL ❌ (missing scope)
git commit -m "fix: bug"
```

### Install Commitlint

```bash
pnpm add -D @commitlint/cli @commitlint/config-conventional
```

### Create Commitlint Config

Create `commitlint.config.js` in the project root:

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
      ],
    ],
    'scope-enum': [
      2,
      'always',
      [
        'api',
        'web',
        'ui',
        'docs',
        'vercel',
        'azure',
        'deps',
        'config',
        'scripts',
        'types',
      ],
    ],
    'subject-case': [2, 'never', ['upper-case', 'pascal-case', 'start-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'scope-case': [2, 'always', 'lower-case'],
  },
};
```

### Add to package.json

Add a commitlint script:

```json
{
  "scripts": {
    "commitlint": "commitlint --edit"
  }
}
```

### Set Up Git Hook (Optional)

Install husky (if not already installed):

```bash
pnpm add -D husky
npx husky init
```

Create commit-msg hook:

```bash
echo "pnpm commitlint --edit \$1" > .husky/commit-msg
chmod +x .husky/commit-msg
```

### Test Commitlint

Test a commit message:

```bash
# Good message (should pass)
echo "feat(api): add authentication" | pnpm commitlint

# Bad message (should fail)
echo "fix: bug" | pnpm commitlint
```

## Commit Message Template

The template (`.gitmessage`) is included in the repository. It provides:

1. **Format guide** at the top
2. **Type and scope lists** for reference
3. **Rules reminder** for subject line
4. **Example** showing proper format

When you run `git commit`, delete the template text and write your message following the format.

## VS Code Integration

If using VS Code, you can:

1. **Install "Conventional Commits" extension**
   - Provides autocomplete for types/scopes
   - Validates commit messages
   - Shows format hints

2. **Configure git editor**:
   ```json
   {
     "git.useEditorAsCommitInput": true
   }
   ```

## Common Scenarios

### Simple Fix

```
fix(web): resolve build error
```

### Feature with Details

```
feat(api): add user authentication

- Implement login endpoint
- Add JWT token generation
- Include refresh tokens

Closes #123
```

### Multiple Changes

```
refactor(api,web): standardize error handling

- Create shared error format
- Update API controllers
- Update web error handling
```

### Documentation

```
docs: add Azure AD setup guide

- Document registration steps
- Include configuration examples
- Add deployment instructions
```

## Troubleshooting

### Template Not Showing

1. Check git config:
   ```bash
   git config commit.template
   ```

2. Make sure `.gitmessage` exists in repo root:
   ```bash
   ls -la .gitmessage
   ```

3. Set it again:
   ```bash
   git config commit.template .gitmessage
   ```

### Commitlint Not Working

1. Verify installation:
   ```bash
   pnpm list @commitlint/cli
   ```

2. Check config file exists:
   ```bash
   ls -la commitlint.config.js
   ```

3. Test manually:
   ```bash
   echo "feat(api): test" | pnpm commitlint
   ```

### Git Hook Not Running

1. Check husky is installed:
   ```bash
   pnpm list husky
   ```

2. Verify hook exists:
   ```bash
   ls -la .husky/commit-msg
   ```

3. Make hook executable:
   ```bash
   chmod +x .husky/commit-msg
   ```

## Reminders

- ✅ Always use format: `<type>(<scope>): <subject>`
- ✅ Use imperative mood for subject
- ✅ Keep subject under 50 characters
- ✅ Add body for complex changes
- ✅ Reference issues in footer when applicable

## Need Help?

See [CONTRIBUTING.md](./CONTRIBUTING.md) for:
- Detailed format rules
- More examples
- Type/scope definitions
- Why this standard matters
