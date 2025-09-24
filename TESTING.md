# Testing Guide

This project includes a comprehensive testing suite that validates CMS integration, build output, and code quality.

## Test Categories

### 1. **Static Checks** (Fast - No Build Required)
- **Sanity CMS Tests**: Validates schema configuration and GROQ queries
- **Stackbit Tests**: Validates Stackbit model integration
- **Legacy Tests**: Ensures no starter template artifacts remain

### 2. **Render Checks** (Requires Build)
- **Annotation Tests**: Validates Stackbit data attributes in HTML
- **CTA Tests**: Ensures checkout links are properly configured

## Available Commands

### Quick Commands
```bash
# Run all tests (requires build)
pnpm test

# Run static checks only (fast)
pnpm test:static

# Run render checks (requires build)
pnpm test:render
```

### Specific Test Types
```bash
# Test specific CMS integration
pnpm test:sanity      # Sanity CMS only
pnpm test:stackbit    # Stackbit only
pnpm test:legacy      # Legacy cleanup only

# Test specific section
SECTION=heroCarouselSection pnpm test:section
```

### CI/CD Commands
```bash
# Complete Astro pipeline
pnpm ci:astro

# Full pipeline (includes Next.js)
pnpm ci:full

# Validation (all checks)
pnpm validate
```

## Environment Variables

### Testing Configuration
- `SECTION`: Test specific section only (e.g., `heroCarouselSection`)
- `DIST_DIR`: Custom build directory for render tests

### Example Usage
```bash
# Test only hero carousel section
SECTION=heroCarouselSection pnpm test:static

# Test with custom build directory
DIST_DIR=./custom-dist pnpm test:render
```

## Pre-commit Hooks

The project includes Husky pre-commit hooks:

- **Pre-commit**: Runs static checks (fast)
- **Pre-push**: Runs full Astro pipeline

### Setup Hooks
```bash
# Install dependencies
pnpm install

# Initialize Husky
npx husky init

# Hooks are already configured in .husky/
```

## CI/CD Pipeline

### GitHub Actions
The `.github/workflows/ci.yml` includes:

1. **Static Checks**: Validates CMS configuration
2. **Astro Build**: Builds and tests Astro site
3. **Next.js Build**: Builds checkout application
4. **Full Pipeline**: Complete integration test
5. **Deploy Preview**: Deploys PR previews to Netlify

### Required Secrets
Add these to your GitHub repository secrets:

- `NETLIFY_AUTH_TOKEN`: Netlify authentication token
- `NETLIFY_SITE_ID`: Your Netlify site ID

## Test Structure

```
tests/
├── run.mts              # Main test runner
└── checks/
    ├── annotations.mts  # HTML output validation
    ├── cta.mts         # Checkout link validation
    ├── legacy.mts      # Legacy cleanup checks
    ├── sanity.mts      # Sanity CMS validation
    └── stackbit.mts    # Stackbit integration checks
```

## Troubleshooting

### Common Issues

1. **Render tests fail**: Ensure you've built the site first
   ```bash
   pnpm build:astro
   pnpm test:render
   ```

2. **Sanity tests fail**: Check your Sanity configuration
   ```bash
   # Test with fallback data
   SANITY_PROJECT_ID="" pnpm test:sanity
   ```

3. **Stackbit tests fail**: Verify Stackbit model files exist
   ```bash
   ls .stackbit/models/
   ```

### Debug Mode
```bash
# Run with verbose output
DEBUG=1 pnpm test:static

# Test specific section with debug
DEBUG=1 SECTION=heroCarouselSection pnpm test:section
```

## Adding New Tests

### 1. Create Test File
```typescript
// tests/checks/myTest.mts
export async function checkMyFeature(distDir?: string) {
    // Your test logic here
    if (condition) {
        throw new Error('Test failed: reason');
    }
}
```

### 2. Add to Test Runner
```typescript
// tests/run.mts
import { checkMyFeature } from './checks/myTest.mts';

async function runMyChecks() {
    await checkMyFeature(distDir);
}
```

### 3. Add to Package Scripts
```json
{
  "scripts": {
    "test:my": "node --loader ts-node/esm tests/run.mts my"
  }
}
```

## Best Practices

1. **Run static checks frequently** during development
2. **Run full pipeline** before pushing to main
3. **Test specific sections** when making targeted changes
4. **Use pre-commit hooks** to catch issues early
5. **Monitor CI/CD pipeline** for build failures

## Performance Tips

- Static checks are fast (~5-10 seconds)
- Render checks require build (~30-60 seconds)
- Use `SECTION` environment variable for targeted testing
- Cache dependencies in CI/CD for faster builds
