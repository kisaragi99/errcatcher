# errcatcher - Error Monitoring Solution

[![Website](https://img.shields.io/badge/website-strongmonke.ru-blue?style=flat-square)](https://strongmonke.ru/)

## Overview

errcatcher is a simple yet powerful error monitoring and tracking solution that helps developers identify, track, and resolve issues in their applications. With real-time error reporting and detailed error context, you can quickly understand and fix issues affecting your users.

> **Note**: This is an example deployment for demonstration purposes. All routes are exposed and accessible without authentication. In the production version, access is protected by IP whitelisting.

## Getting Started

### How to Use

1. Send error data to our API endpoint using the URL below
2. Include your project's `project_id` and error details in the request body
3. View and manage errors in your dashboard for quick resolution

## API Reference

### Report an Error

**Endpoint**: `POST https://api.strongmonke.ru/api/errors`

> **Note**: This API endpoint is publicly accessible. All other endpoints, including the web interface, are not exposed and require VPN access.

#### Request Body

```json
{
    "project_id": "f0f1bb39-7fe2-4336-a834-3f8afa66bb60",
    "error_message": "[failed to load data, Internal Server Error, critical]",
    "custom_fields": {
        "environment": "production",
        "severity": "critical",
        "status": 500,
        "component": "user-profile",
        "timestamp": "2025-06-29T15:42:24Z",
        "browser": "Chrome 114.0.5735.199",
        "os": "Windows 10",
        "url": "https://app.example.com/user/12345/profile",
        "user_id": "550e8400-e29b-41d4-a716-446655440000"
    }
}
```

#### Required Fields
- `project_id`: UUID of your project
- `error_message`: Description of the error

#### Custom Fields (not required)
Custom fields can include any additional metadata you want to track with the error. Common fields include:
- `environment`: The deployment environment (e.g., production, staging)
- `severity`: Error severity level (e.g., critical, error, warning)
- `status`: HTTP status code (if applicable)
- `component`: Application component where the error occurred
- `timestamp`: When the error occurred (ISO 8601 format)
- `browser`: User's browser information
- `os`: User's operating system
- `url`: URL where the error occurred
- `user_id`: ID of the affected user

Note: The project_id should be a valid UUID of your project. Custom fields can be any additional metadata you want to include with the error.