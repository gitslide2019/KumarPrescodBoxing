#!/bin/bash

# Format code with ESLint and Prettier
echo "Formatting code with ESLint and Prettier..."

# Fix ESLint issues
echo "Running ESLint fix..."
npx eslint --ext .js,.jsx,.ts,.tsx src --fix

# Format with Prettier
echo "Running Prettier format..."
npx prettier --write "src/**/*.{js,jsx,ts,tsx,json,css,scss,md}"

echo "Code formatting complete!"