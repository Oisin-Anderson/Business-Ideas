# Manual Testing Guide for Supabase Integration

## ✅ What's Complete:
- Database connection to Supabase working
- Tables created successfully
- Server running with database integration

## 🧪 Manual Test Steps:

### 1. Start Your Server:
```bash
node index.js
```

You should see:
- ✅ Connected to Supabase PostgreSQL database
- ✅ Database schema initialized successfully
- Server running on port 5000

### 2. Test User Registration:
Open another terminal/PowerShell and run:
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -Body (@{email="test@example.com"; password="testpass123"} | ConvertTo-Json) -ContentType "application/json"
```

### 3. Test User Login:
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body (@{email="test@example.com"; password="testpass123"} | ConvertTo-Json) -ContentType "application/json"
```

### 4. Test Basic API:
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/stats" -Method GET
```

### 5. Check Database in Supabase:
- Go to Supabase Dashboard → Table Editor
- Look for `users` table
- You should see the registered user

## 🎯 What This Proves:
- User data is stored in Supabase PostgreSQL
- Authentication works with database
- Your migration from local files to Supabase is complete!

## 🚀 Ready for Production:
Your backend now uses:
- ✅ Supabase PostgreSQL database
- ✅ Secure user authentication
- ✅ Subscription management with Stripe
- ✅ Scalable cloud infrastructure
