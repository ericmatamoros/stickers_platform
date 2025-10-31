# Vercel Deployment Instructions for MyStickers

This guide will help you deploy your MyStickers platform to Vercel with automatic deployments on every push to your repository.

## Prerequisites

- GitHub/GitLab/Bitbucket account with your repository
- Vercel account (free tier works fine)
- Neon Database account (already set up)
- AWS S3 bucket (already configured)

---

## Step 1: Prepare Your Repository

### 1.1 Create `.env.example` file

Create a template for environment variables that others can reference (but don't include actual values):

```bash
# Database
DATABASE_URL=

# AWS S3
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET_NAME=
AWS_REGION=

# Web3
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=
NEXT_PUBLIC_ADMIN_WALLETS=

# App Configuration
NEXT_PUBLIC_BASE_URL=
```

### 1.2 Commit and Push

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

---

## Step 2: Deploy to Vercel

### 2.1 Import Your Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your Git repository (GitHub/GitLab/Bitbucket)
4. Select your `stickers_platform` repository

### 2.2 Configure Build Settings

Vercel should auto-detect Next.js. Verify these settings:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (or `next build`)
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Node Version**: 18.x or higher

### 2.3 Add Environment Variables

Click **"Environment Variables"** and add the following:

#### Database
```
DATABASE_URL = your_neon_database_url_here
```
**Get from**: Your Neon Database console → Connection String

#### AWS S3
```
AWS_ACCESS_KEY_ID = AKIA...
AWS_SECRET_ACCESS_KEY = your_secret_key
AWS_S3_BUCKET_NAME = stickersfy
AWS_REGION = us-east-1
```
**Get from**: Your AWS IAM credentials

#### Web3 Configuration
```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID = your_project_id_or_leave_default
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS = 0x0000000000000000000000000000000000000000
NEXT_PUBLIC_ADMIN_WALLETS = 0x6c65705edB4D70E98A4d516911964744f822D16d,0x916f09e722c49862C673372B6aAB59b89168b2F0
```
**Notes**:
- Add your admin wallet addresses (comma-separated, no spaces)
- If you have a WalletConnect Project ID, use it; otherwise, the fallback works fine
- Set NFT contract address if you want to gate access (or use `0x0...` to disable)

#### App Configuration
```
NEXT_PUBLIC_BASE_URL = https://your-app-name.vercel.app
```
**Note**: You'll get this URL after the first deployment. You can update it later.

### 2.4 Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (2-5 minutes)
3. Once deployed, you'll get a URL like: `https://your-app-name.vercel.app`

---

## Step 3: Post-Deployment Setup

### 3.1 Update Base URL

1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Edit `NEXT_PUBLIC_BASE_URL` to your actual Vercel URL
3. Trigger a new deployment:
   - Go to **Deployments** tab
   - Click **"Redeploy"** on the latest deployment

### 3.2 Update S3 CORS Configuration

Your S3 bucket needs to allow requests from your Vercel domain.

1. Go to AWS S3 Console → Your bucket → **Permissions** → **CORS**
2. Update the CORS configuration:

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
        "AllowedOrigins": [
            "https://your-app-name.vercel.app",
            "http://localhost:3000"
        ],
        "ExposeHeaders": ["ETag"],
        "MaxAgeSeconds": 3600
    }
]
```

### 3.3 Test Database Connection

Your Neon database should work automatically. To verify:

1. Visit your deployed app
2. Try uploading a sticker (as admin)
3. Check if it appears in the gallery

If there are issues, check Vercel logs:
- Go to your project → **Deployments** → Click latest deployment → **Logs**

---

## Step 4: Automatic Deployments

### 4.1 How It Works

Vercel automatically:
- ✅ Deploys on every push to `main` branch
- ✅ Creates preview deployments for pull requests
- ✅ Rebuilds on environment variable changes (if you redeploy)

### 4.2 Branch Configuration (Optional)

To deploy from a different branch:
1. Go to **Settings** → **Git**
2. Change **Production Branch** to your preferred branch

### 4.3 Preview Deployments

Every pull request automatically gets its own preview URL:
- Create a PR → Vercel comments with preview link
- Test before merging to production

---

## Step 5: Domain Setup (Optional)

### 5.1 Add Custom Domain

1. Go to your project → **Settings** → **Domains**
2. Click **"Add"**
3. Enter your domain (e.g., `mystickers.com`)
4. Follow DNS configuration instructions

### 5.2 Update Environment Variables

After adding a custom domain:
1. Update `NEXT_PUBLIC_BASE_URL` to your custom domain
2. Update S3 CORS to include your custom domain
3. Redeploy

---

## Step 6: Monitoring & Troubleshooting

### 6.1 View Logs

Real-time logs:
1. Go to your project → **Deployments**
2. Click on a deployment
3. View **Build Logs** or **Function Logs**

### 6.2 Common Issues

#### Issue: Build Fails
- **Check**: Vercel build logs for errors
- **Fix**: Often missing environment variables or dependency issues

#### Issue: Database Connection Error
- **Check**: Is `DATABASE_URL` set correctly?
- **Fix**: Copy the connection string from Neon (it should start with `postgresql://`)

#### Issue: S3 Upload Fails (403 Forbidden)
- **Check**: S3 CORS configuration
- **Fix**: Ensure your Vercel domain is in `AllowedOrigins`

#### Issue: Wallet Not Connecting
- **Check**: Browser console for errors
- **Fix**: Ensure `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is set

#### Issue: Images Not Loading
- **Check**: Network tab in browser DevTools
- **Fix**: 
  - Verify S3 bucket is publicly readable
  - Check bucket policy allows `s3:GetObject`

### 6.3 Performance Monitoring

Vercel provides:
- **Analytics**: Usage stats, page views
- **Speed Insights**: Core Web Vitals
- **Logs**: Function execution logs

Access these from your project dashboard.

---

## Step 7: Production Checklist

Before going live, verify:

- [ ] All environment variables are set
- [ ] Admin wallets are correctly configured
- [ ] S3 bucket CORS includes production domain
- [ ] Database connection works
- [ ] Upload functionality works (test as admin)
- [ ] Download functionality works
- [ ] Wallet connection works
- [ ] Images load correctly
- [ ] Discord/Twitter previews work (test by sharing a sticker link)
- [ ] Mobile responsiveness tested

---

## Step 8: Rollback (If Needed)

If a deployment breaks something:

1. Go to **Deployments** tab
2. Find the last working deployment
3. Click **"..."** → **"Promote to Production"**
4. Your site instantly reverts to that version

---

## Maintenance

### Regular Updates

```bash
# Pull latest changes
git pull origin main

# Update dependencies (if needed)
npm update

# Push to trigger deployment
git push origin main
```

### Database Migrations

If you update the Prisma schema:

```bash
# Generate new Prisma client
npx prisma generate

# Push schema changes to database
npx prisma db push

# Commit and push
git add .
git commit -m "Update database schema"
git push
```

Vercel will automatically run `prisma generate` during build (via the `postinstall` script).

---

## Security Best Practices

1. **Never commit** `.env.local` or `.env` files
2. **Rotate** AWS credentials periodically
3. **Use** separate AWS users for dev/production
4. **Enable** Vercel's password protection for staging deployments
5. **Review** admin wallet list regularly
6. **Monitor** S3 bucket access logs

---

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Neon Docs**: https://neon.tech/docs
- **AWS S3 Docs**: https://docs.aws.amazon.com/s3/

---

## Quick Reference: Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | Neon PostgreSQL connection string |
| `AWS_ACCESS_KEY_ID` | ✅ | AWS IAM access key |
| `AWS_SECRET_ACCESS_KEY` | ✅ | AWS IAM secret key |
| `AWS_S3_BUCKET_NAME` | ✅ | S3 bucket name |
| `AWS_REGION` | ✅ | AWS region (e.g., `us-east-1`) |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | ⚠️ | WalletConnect ID (has fallback) |
| `NEXT_PUBLIC_NFT_CONTRACT_ADDRESS` | ⚠️ | NFT contract for gating (optional) |
| `NEXT_PUBLIC_ADMIN_WALLETS` | ✅ | Comma-separated admin addresses |
| `NEXT_PUBLIC_BASE_URL` | ✅ | Your production URL |

✅ = Required | ⚠️ = Optional (has defaults)

---

**You're all set!** 🚀

Your MyStickers platform should now be live on Vercel with automatic deployments!

