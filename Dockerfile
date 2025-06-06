# Generated by https://smithery.ai. See: https://smithery.ai/docs/build/project-config
FROM node:lts-alpine

# Create app directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json tsconfig.json index.ts figma_api.ts ./

# Install deps without running prepare/build scripts
RUN npm ci --ignore-scripts

# Build the project
RUN npm run build

# Copy only built files are already in place because build outputs to dist

# Expose no port needed for stdio

# Default command
CMD ["node", "dist/index.cjs"]
