# دليل النشر والإنتاج 🚀

## 📋 المحتويات

1. [Docker Deployment](#docker-deployment)
2. [Backup Strategy](#backup-strategy)
3. [CI/CD Pipeline](#cicd-pipeline)
4. [Testing](#testing)
5. [Environment Variables](#environment-variables)

---

## 🐳 Docker Deployment

### Prerequisites
- Docker
- Docker Compose

### Quick Start

```bash
# Clone repository
git clone <repository-url>
cd sidra

# Copy environment file
cp .env.example .env.local

# Edit environment variables
nano .env.local

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Services

- **app**: Next.js application (port 3000)
- **mongo**: MongoDB database (port 27017)
- **backup**: Automated backup service

---

## 💾 Backup Strategy

### Manual Backup

```bash
# Create backup
npm run backup

# Restore backup
npm run backup:restore <backup-path>
```

### Automated Backups

```bash
# Start scheduled backups (daily at 2 AM)
npm run backup:schedule
```

### Backup Configuration

Set environment variables:
- `BACKUP_DIR`: Backup directory (default: `./backups`)
- `BACKUP_SCHEDULE`: Cron schedule (default: `0 2 * * *`)
- `BACKUP_ENCRYPTION_KEY`: Encryption key (optional)

### Backup Retention

- Backups are kept for 30 days
- Old backups are automatically deleted

---

## 🔄 CI/CD Pipeline

### GitHub Actions

The CI/CD pipeline runs automatically on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`

### Pipeline Stages

1. **Test**: Run tests and linting
2. **Build**: Build application and Docker image
3. **Security**: Security scanning (npm audit, Snyk)
4. **Deploy**: Deploy to production (main branch only)

### Manual Trigger

```bash
# Push to trigger CI/CD
git push origin main
```

---

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Test Structure

```
__tests__/
  ├── lib/
  │   ├── security.test.ts
  │   └── cache.test.ts
  └── api/
      └── health.test.ts
```

---

## 🔐 Environment Variables

### Required Variables

```env
MONGODB_URI=mongodb://localhost:27017/medical-clinic
JWT_SECRET=your-secret-key
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Optional Variables

```env
BACKUP_DIR=./backups
BACKUP_SCHEDULE=0 2 * * *
BACKUP_ENCRYPTION_KEY=your-encryption-key
NODE_ENV=production
```

---

## 📊 Monitoring

### Health Check

```bash
# Check application health
curl http://localhost:3000/api/health
```

### Logs

```bash
# Application logs
docker-compose logs -f app

# Database logs
docker-compose logs -f mongo

# Backup logs
docker-compose logs -f backup
```

---

## 🔧 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Change ports in docker-compose.yml
   ports:
     - "3001:3000"  # Change 3000 to 3001
   ```

2. **MongoDB connection error**
   ```bash
   # Check MongoDB URI
   echo $MONGODB_URI
   ```

3. **Backup fails**
   ```bash
   # Check backup directory permissions
   ls -la backups/
   ```

---

## 📝 Production Checklist

- [ ] Set all environment variables
- [ ] Configure backup encryption
- [ ] Set up monitoring
- [ ] Configure SSL/TLS
- [ ] Set up firewall rules
- [ ] Configure rate limiting
- [ ] Set up error tracking (Sentry)
- [ ] Configure log aggregation
- [ ] Set up alerts
- [ ] Test backup restore

---

**آخر تحديث**: 2025-01-27

