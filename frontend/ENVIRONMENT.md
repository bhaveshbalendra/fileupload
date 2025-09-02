# Environment Configuration Guide

This document explains how to configure environment variables for the frontend application.

## Overview

The frontend uses a centralized environment configuration system located in `src/configs/envConfig.ts`. This provides:

- ✅ Type-safe environment variable access
- ✅ Default value fallbacks
- ✅ Environment validation
- ✅ Centralized API endpoint configuration
- ✅ Debug logging capabilities

## Quick Start

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your configuration:

   ```bash
   VITE_API_BASE_URL=http://localhost:8000
   ```

3. The configuration is automatically loaded and validated on application startup.

## Environment Variables

### API Configuration

| Variable            | Default                 | Description                  |
| ------------------- | ----------------------- | ---------------------------- |
| `VITE_API_BASE_URL` | `http://localhost:8000` | Base URL for the backend API |

### Application Configuration

| Variable           | Default      | Description         |
| ------------------ | ------------ | ------------------- |
| `VITE_APP_NAME`    | `FileUpload` | Application name    |
| `VITE_APP_VERSION` | `1.0.0`      | Application version |

### Security Configuration

| Variable                        | Default     | Description                                        |
| ------------------------------- | ----------- | -------------------------------------------------- |
| `VITE_REDUX_PERSIST_SECRET_KEY` | `undefined` | Secret key for Redux Persist encryption (optional) |

### Feature Flags

| Variable                | Default | Description                  |
| ----------------------- | ------- | ---------------------------- |
| `VITE_ENABLE_ANALYTICS` | `true`  | Enable analytics tracking    |
| `VITE_ENABLE_DEBUG`     | `false` | Enable debug console logging |
| `VITE_ENABLE_DEV_TOOLS` | `true`  | Enable development tools     |

## Usage in Code

### Using Environment Configuration

```typescript
import { env, api } from "@/configs/envConfig";

// Access environment variables
console.log(env.API_BASE_URL);
console.log(env.APP_NAME);

// Access pre-configured API endpoints
console.log(api.auth.login);
console.log(api.files.upload);
```

### Using API Endpoints

```typescript
import { api } from "@/configs/envConfig";

// Authentication endpoints
const loginUrl = api.auth.login; // http://localhost:8000/api/auth/login
const registerUrl = api.auth.register; // http://localhost:8000/api/auth/register

// File management endpoints
const uploadUrl = api.files.upload; // http://localhost:8000/api/files/upload
const filesUrl = api.files.list; // http://localhost:8000/api/files
```

### Using Helper Functions

```typescript
import { getApiUrl } from "@/configs/envConfig";

// Build custom API URLs
const customEndpoint = getApiUrl("/api/custom/endpoint");
// Result: http://localhost:8000/api/custom/endpoint
```

## Environment-Specific Configurations

### Development

```bash
VITE_API_BASE_URL=http://localhost:8000
VITE_ENABLE_DEBUG=true
VITE_ENABLE_DEV_TOOLS=true
```

### Staging

```bash
VITE_API_BASE_URL=https://api-staging.yourapp.com
VITE_ENABLE_DEBUG=false
VITE_ENABLE_DEV_TOOLS=false
VITE_ENABLE_ANALYTICS=true
```

### Production

```bash
VITE_API_BASE_URL=https://api.yourapp.com
VITE_ENABLE_DEBUG=false
VITE_ENABLE_DEV_TOOLS=false
VITE_ENABLE_ANALYTICS=true
```

## Available API Endpoints

The configuration provides pre-built endpoint URLs for:

### Authentication

- `api.auth.login` - User login
- `api.auth.register` - User registration
- `api.auth.logout` - User logout
- `api.auth.users` - User management
- `api.auth.profile` - User profile

### File Management

- `api.files.upload` - File upload
- `api.files.list` - List files
- `api.files.delete` - Delete files
- `api.files.download` - Download files

### Analytics

- `api.analytics.storage` - Storage analytics
- `api.analytics.files` - File analytics

### API Keys

- `api.apiKeys.list` - List API keys
- `api.apiKeys.create` - Create API key
- `api.apiKeys.delete` - Delete API key

### Health Check

- `api.health` - Health check endpoint

## Validation and Debugging

### Environment Validation

The system automatically validates required environment variables on startup and warns about missing values.

### Debug Mode

Enable debug logging by setting `VITE_ENABLE_DEBUG=true` to see the loaded configuration:

```javascript
// Console output when debug is enabled
Environment Configuration: {
  API_BASE_URL: \"http://localhost:8000\",
  NODE_ENV: \"development\",
  APP_NAME: \"FileUpload\",
  APP_VERSION: \"1.0.0\",
  ENABLE_ANALYTICS: true,
  ENABLE_DEV_TOOLS: true
}
```

## Best Practices

1. **Never commit `.env` files** - Only commit `.env.example`
2. **Use descriptive variable names** - Follow the `VITE_CATEGORY_NAME` pattern
3. **Provide default values** - For non-sensitive configuration
4. **Validate required variables** - Add validation for critical environment variables
5. **Use the centralized config** - Always import from `configs/envConfig.ts` instead of using `import.meta.env` directly

## Troubleshooting

### Missing Environment Variables

If you see warnings about missing environment variables:

1. Check if `.env` file exists
2. Verify variable names match exactly (case-sensitive)
3. Restart the development server after changes

### API Connection Issues

1. Verify `VITE_API_BASE_URL` points to the correct backend
2. Check if the backend server is running
3. Enable debug mode to see the loaded configuration

### Environment Variables Not Loading

1. Ensure variables start with `VITE_` prefix
2. Restart the development server
3. Check for syntax errors in `.env` file
