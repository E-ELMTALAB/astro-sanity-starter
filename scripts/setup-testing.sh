#!/bin/bash

echo "🚀 Setting up testing pipeline..."

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install pnpm first."
    echo "   npm install -g pnpm"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Initialize Husky
echo "🐕 Setting up Husky..."
npx husky init

# Make hooks executable
chmod +x .husky/pre-commit
chmod +x .husky/pre-push

# Copy environment example
if [ ! -f .env ]; then
    echo "📝 Creating .env file from example..."
    cp env.example .env
    echo "⚠️  Please update .env with your actual values"
fi

# Test the setup
echo "🧪 Testing the setup..."
pnpm test:static

if [ $? -eq 0 ]; then
    echo "✅ Testing pipeline setup complete!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Update .env with your actual values"
    echo "2. Run 'pnpm ci:astro' to test the full pipeline"
    echo "3. Configure GitHub secrets for CI/CD"
    echo ""
    echo "🔧 Available commands:"
    echo "  pnpm test:static    - Run static checks"
    echo "  pnpm test:render    - Run render checks (requires build)"
    echo "  pnpm ci:astro       - Full Astro pipeline"
    echo "  pnpm ci:full        - Complete pipeline"
else
    echo "❌ Setup test failed. Please check your configuration."
    exit 1
fi
