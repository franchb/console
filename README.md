# Opens3 Console

![license](https://img.shields.io/badge/license-AGPL%20V3-blue)

Opens3 Console is a community-maintained fork of MinIO Console, preserving the full feature set that made the original console great. This fork exists to maintain and enhance the rich user interface capabilities that the community has come to rely on.

### **⚠️ Not affiliated with MinIO, Inc.**

## Quick Start

### Option 1: Using Docker (Recommended)

You can use our official multi-architecture image (supports both amd64 and arm64):

### Pull and run the official image

```bash
docker run -p 9090:9090 \
  -e CONSOLE_MINIO_SERVER="https://your-minio-server" \
  -e CONSOLE_PBKDF_PASSPHRASE="your-secure-passphrase" \
  -e CONSOLE_PBKDF_SALT="your-secure-salt" \
  opens3/console:latest
```

### Option 2: Build from Source

First, clone the repository:

```bash
git clone https://github.com/opens3/console.git
cd console
```

**Build Command:**

```bash
chmod +x build.sh
./build.sh
```

After the build is complete, set the required environment variables and start the console:

```bash
export CONSOLE_MINIO_SERVER="https://your-minio-server"
export CONSOLE_PBKDF_PASSPHRASE="your-secure-passphrase"
export CONSOLE_PBKDF_SALT="your-secure-salt"
./console server
```

The console will be available at `http://localhost:9090`.

## Features

- Complete bucket and object management
- Rich object browser with advanced upload capabilities
- Comprehensive user and policy management
- Monitoring and metrics dashboard
- Notification and event management
- Full server configuration interface

| Object Browser                     | Dashboard                     | Creating a bucket             |
| ---------------------------------- | ----------------------------- | ----------------------------- |
| ![Object Browser](images/pic3.png) | ![Dashboard](images/pic1.png) | ![Dashboard](images/pic2.png) |

## Why This Fork?

Recent changes to the official MinIO Console have removed several important features that many users depend on. The Opens3 Console fork maintains these features and ensures they remain available to the community. Our goals are to:

- Maintain compatibility with MinIO server
- Continue community-driven development and improvements
- Keep the console fully open source under AGPL v3
- Ensure users have access to a feature-rich, self-hosted management UI
