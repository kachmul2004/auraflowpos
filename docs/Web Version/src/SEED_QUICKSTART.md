# 🚀 Database Seeding - Quick Start

**Time: 3 minutes** | **Skill: Beginner** | **Prerequisites: Supabase project + schema deployed**

---

## Three Commands

```bash
# 1. Install (one time)
pip install -r requirements.txt

# 2. Configure (one time)
cp .env.example .env
# Edit .env and add your SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY

# 3. Seed (run anytime)
python seed_database.py
```

---

## What You Get

- ✅ **55 Products** - All grocery + bar items from mockData.ts
- ✅ **5 Customers** - With loyalty points and purchase history
- ✅ **3 Sample Orders** - With line items and transactions
- ✅ **Clean Database** - Old data removed automatically

---

## Where to Get Credentials

**Supabase Dashboard** → **Settings** → **API**

Copy these two values:
1. `Project URL` → Put in `.env` as `SUPABASE_URL`
2. `service_role` (secret) → Put in `.env` as `SUPABASE_SERVICE_ROLE_KEY`

⚠️ Use **service_role**, NOT anon key!

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `pip: command not found` | Use `pip3` instead |
| `Table doesn't exist` | Run `supabase/schema.sql` first |
| `Permission denied` | Wrong API key - use service_role |
| Need more help? | See `SEEDING_GUIDE.md` |

---

## Next Steps

1. Run the seeding script ✅
2. Check Supabase → Table Editor ✅
3. Update your frontend `.env.local` ✅
4. Start your app and see real data! 🎉

---

**Full docs:** `SEEDING_GUIDE.md`  
**Summary:** `DATABASE_SEEDING_SUMMARY.md`
