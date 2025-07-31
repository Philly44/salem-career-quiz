# How to Fix "Push Blocked: Secret Detected"

GitHub is blocking your push because commit `7d998d9` contains an API key. Here's how to fix it:

## Option 1: Using Git Desktop (Easiest)

1. In Git Desktop, go to **Repository** → **Repository Settings**
2. Click **Fork** or **Clone** your repository to a new location
3. Copy all your current files (except .git folder) to the new repository
4. Commit and push the clean version

## Option 2: Reset and Recreate (Recommended)

Run these commands in order:

```bash
# 1. Save your current work
cp -r . ../Email-Quiz-Backup

# 2. Reset to before the problematic commit
git reset --hard 74c48b4

# 3. Copy back the latest files
cp ../Email-Quiz-Backup/*.js .
cp ../Email-Quiz-Backup/*.html .
cp ../Email-Quiz-Backup/*.css .
cp ../Email-Quiz-Backup/*.json .
cp ../Email-Quiz-Backup/*.md .

# 4. Commit everything fresh
git add -A
git commit -m "Add LLM features with secure configuration"

# 5. Force push (this will overwrite remote history)
git push --force origin main
```

## Option 3: Interactive Rebase (Advanced)

If you want to keep your commit history but remove just the secret:

```bash
# Start interactive rebase
git rebase -i 74c48b4^

# In the editor, change "pick" to "drop" for commit 7d998d9
# Save and close the editor

# Force push
git push --force origin main
```

## Important Notes

- The API key is now stored in Vercel environment variables (not in code)
- Never commit API keys, even temporarily
- GitHub's secret scanning prevents accidental exposure
- After fixing, your Vercel deployment will still work with the environment variable

Choose Option 1 if you're not comfortable with command line.
Choose Option 2 if you want a clean, simple fix.
Choose Option 3 if you want to preserve most of your history.