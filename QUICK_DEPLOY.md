# Quick Deploy to Vercel

## Step 1: Commit Your Code

```bash
# Check what will be committed
git status

# Add all changes
git add .

# Commit
git commit -m "Ready for Vercel deployment"

# Push to main branch (triggers Vercel deployment)
git push origin main
```

## Step 2: Set Up Vercel (First Time Only)

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New..." → "Project"**
3. Import your git repository
4. Configure build settings (should auto-detect Next.js)
5. Add environment variables (copy from `.env.local`):
   - `DATABASE_URL`
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_S3_BUCKET_NAME`
   - `AWS_REGION`
   - `NEXT_PUBLIC_ADMIN_WALLETS`
   - `NEXT_PUBLIC_BASE_URL` (use `https://your-app.vercel.app` initially)
6. Click **"Deploy"**

## Step 3: Post-Deployment

### Update Base URL
1. Copy your Vercel URL (e.g., `https://mystickers-abc123.vercel.app`)
2. Go to Vercel Settings → Environment Variables
3. Update `NEXT_PUBLIC_BASE_URL` to your Vercel URL
4. Redeploy (Deployments tab → "Redeploy")

### Update S3 CORS
1. Go to AWS S3 Console → Your bucket → Permissions → CORS
2. Add your Vercel domain to `AllowedOrigins`:
```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
        "AllowedOrigins": [
            "https://your-app.vercel.app",
            "http://localhost:3000"
        ],
        "ExposeHeaders": ["ETag"],
        "MaxAgeSeconds": 3600
    }
]
```

## Step 4: Test

- Visit your Vercel URL
- Connect wallet
- Try uploading a sticker (as admin)
- Verify images load correctly

## Future Deploys

Just push to git:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

Vercel automatically deploys on every push! 🚀

## Troubleshooting

**Build fails?** 
- Check Vercel logs: Deployments → Click deployment → View logs

**Images not loading?**
- Check S3 CORS configuration
- Verify bucket policy allows public reads

**Can't upload?**
- Verify you're logged in with an admin wallet
- Check browser console for errors

---

For detailed instructions, see `VERCEL_DEPLOYMENT.md`

