# How to Run Supabase Migration

## 📋 What This Migration Does

This SQL script will:
- ✅ Create the `blacklist` table
- ✅ Add indexes for performance
- ✅ Set up security policies
- ✅ Verify your existing `profiles` table
- ✅ **NOT change or delete any existing data**
- ✅ Safe to run multiple times

## 🚀 Step-by-Step Instructions

### Method 1: Using Supabase Dashboard (Recommended)

1. **Go to Your Supabase Project**
   - Open [https://supabase.com](https://supabase.com)
   - Select your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Or go to: `https://supabase.com/dashboard/project/YOUR-PROJECT-ID/sql/new`

3. **Create New Query**
   - Click "New Query" button
   - Or click the `+` icon

4. **Copy and Paste the SQL**
   - Open the file: `supabase_migration_blacklist.sql`
   - Copy ALL the content (Ctrl+A, Ctrl+C)
   - Paste into the SQL Editor (Ctrl+V)

5. **Run the Migration**
   - Click the "Run" button (or press Ctrl+Enter)
   - Wait for execution (takes 2-5 seconds)

6. **Check Results**
   - Look at the bottom panel for messages
   - You should see "✓" checkmarks for success
   - Should say "MIGRATION COMPLETED SUCCESSFULLY!"

### Method 2: Using Supabase CLI (Advanced)

```bash
# Install Supabase CLI if not installed
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref YOUR-PROJECT-REF

# Run the migration
supabase db push --db-url YOUR-DATABASE-URL
```

## ✅ Verification Steps

After running the migration, verify it worked:

### 1. Check if Table Exists

Go to "Table Editor" in Supabase dashboard and look for:
- **Table Name**: `blacklist`
- **Columns**: `id`, `email`, `blocked_at`, `created_at`

### 2. Check in SQL Editor

Run this query:
```sql
SELECT * FROM blacklist;
```

Should return: Empty table (no rows) ✅

### 3. Test Helper Function

Run this query:
```sql
SELECT is_email_blacklisted('test@example.com');
```

Should return: `false` ✅

### 4. Check Your Profiles Table

Run this query:
```sql
SELECT full_name, college_email 
FROM profiles 
LIMIT 5;
```

Should show your users ✅

## 🎯 What the Migration Creates

### New Table: `blacklist`

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Unique identifier (auto-generated) |
| `email` | TEXT | Email address of blacklisted user |
| `blocked_at` | TIMESTAMP | When user was blacklisted |
| `created_at` | TIMESTAMP | Record creation time |

### Indexes Created:
- `idx_blacklist_email` - Fast lookup by email

### Security Policies:
1. Service role can manage all blacklist entries
2. Users can check if their own email is blacklisted

### Helper Function:
- `is_email_blacklisted(email)` - Returns true/false

## ⚠️ Important Notes

### This Script is SAFE because:
- ✅ Uses `IF NOT EXISTS` - Won't fail if table exists
- ✅ Uses `DROP POLICY IF EXISTS` - Safe to re-run
- ✅ Only creates NEW tables - Doesn't modify existing ones
- ✅ Only checks profiles table - Doesn't change it
- ✅ Idempotent - Can run multiple times safely

### This Script Will NOT:
- ❌ Delete any existing data
- ❌ Modify the `profiles` table
- ❌ Change existing tables
- ❌ Remove any users
- ❌ Affect your application while running

## 🔍 Troubleshooting

### Error: "relation already exists"
**Solution**: This is OK! It means the table was already created. The script handles this.

### Error: "permission denied"
**Solution**: Make sure you're running as the project owner or have proper permissions.

### Error: "profiles table not found"
**Solution**: 
1. Check if your table is named differently
2. Make sure you're in the correct project
3. Verify in Table Editor

### No errors but no messages appear
**Solution**: Look at the bottom panel. Messages appear in the "Messages" tab.

## 📱 After Running Migration

### Test the Blacklist System:

1. **Open Admin Panel**
   ```
   Go to: http://localhost:3000/admin/users
   ```

2. **Check if Users Load**
   - Should see list of registered users
   - Shows full_name and college_email
   - No errors in console

3. **Test Blacklist**
   - Click "Blacklist" on any user
   - User should appear in "Blacklist" tab
   - Verify in Supabase:
     ```sql
     SELECT * FROM blacklist;
     ```

4. **Test Remove from Blacklist**
   - Click "Remove from Blacklist"
   - User should disappear from blacklist
   - Verify in Supabase again

## 🎉 Success Indicators

You'll know it worked when:
- ✅ No errors in SQL execution
- ✅ See success messages with checkmarks
- ✅ `blacklist` table appears in Table Editor
- ✅ Admin users page loads without errors
- ✅ Can blacklist/unblacklist users
- ✅ Build completes without errors

## 📞 Need Help?

If something goes wrong:
1. Check the error message carefully
2. Make sure you copied the ENTIRE SQL file
3. Verify you're in the correct Supabase project
4. Try running the script again (it's safe!)
5. Check that your `profiles` table has `full_name` and `college_email` columns

## 🔗 File Location

The migration file is located at:
```
/GEEKSFORGEEKS-SRMIST/supabase_migration_blacklist.sql
```

Just open it, copy all content, and paste into Supabase SQL Editor!

---

**That's it! Your database will be ready for the new user management system.** 🚀
