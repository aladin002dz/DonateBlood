# Database Migration Guide

## Overview
This guide will help you safely migrate your database to support the new phone number requirements without losing existing data.

## Changes Made
- `email` field is now optional (nullable)
- `phone` field is now required (not null)
- Added `phone_verified` field (boolean, default false)

## Migration Steps

### 1. Backup Your Database
```bash
# Create a backup before making any changes
pg_dump your_database_name > backup_before_migration.sql
```

### 2. Run the Migration
Execute the migration script in your database:

```bash
# Using psql
psql your_database_name -f migrations/complete-migration.sql

# Or using your preferred database client
```

### 3. Verify Migration
Check that the migration was successful:

```bash
# Check the API endpoint (if running locally)
curl http://localhost:3000/api/admin/migration-stats
```

### 4. Handle Users with Temporary Phone Numbers
After migration, some users will have temporary phone numbers starting with `temp_`. You need to:

1. **Identify affected users:**
   ```sql
   SELECT id, name, email, phone FROM "user" WHERE "phone" LIKE 'temp_%';
   ```

2. **Notify users to update their phone numbers** through your application

3. **Provide a way for users to update their phone numbers** (you can use the existing update-user API)

### 5. Update Your Application Code
The application code has been updated to handle the new schema requirements:
- Sign-up now requires phone numbers
- Sign-in supports both email and phone number
- Email is now optional during sign-up

## Rollback Plan
If you need to rollback the changes:

```sql
-- Remove the new constraints
ALTER TABLE "user" ALTER COLUMN "phone" DROP NOT NULL;
ALTER TABLE "user" DROP CONSTRAINT "user_phone_unique";
ALTER TABLE "user" ALTER COLUMN "email" SET NOT NULL;

-- Drop the new column (optional)
ALTER TABLE "user" DROP COLUMN "phone_verified";
```

## Testing
1. Test sign-up with phone number only
2. Test sign-up with both email and phone
3. Test sign-in with email
4. Test sign-in with phone number
5. Verify existing users can still sign in

## Monitoring
Use the migration stats API to monitor progress:
- `GET /api/admin/migration-stats` - Shows migration progress
- Check for users with temporary phone numbers
- Monitor user complaints about authentication issues

## Next Steps
1. Run the migration during low-traffic period
2. Monitor the application for any issues
3. Send notifications to users with temporary phone numbers
4. Consider implementing phone number verification in the future
