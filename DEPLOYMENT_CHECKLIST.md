# Deployment Checklist

Use this checklist before deploying to Vercel.

## Pre-Deployment

### 1. Code & Dependencies
- [ ] All changes committed to git
- [ ] No uncommitted `.env.local` or `.env` files
- [ ] Dependencies up to date (`npm install`)
- [ ] No TypeScript errors (`npm run build` locally)
- [ ] `.gitignore` properly configured

### 2. Environment Variables Ready
- [ ] `DATABASE_URL` (Neon connection string)
- [ ] `AWS_ACCESS_KEY_ID`
- [ ] `AWS_SECRET_ACCESS_KEY`
- [ ] `AWS_S3_BUCKET_NAME`
- [ ] `AWS_REGION`
- [ ] `NEXT_PUBLIC_ADMIN_WALLETS` (your wallet addresses)
- [ ] `NEXT_PUBLIC_BASE_URL` (will update after first deploy)
- [ ] `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` (optional)
- [ ] `NEXT_PUBLIC_NFT_CONTRACT_ADDRESS` (optional, use `0x0...` to disable)

### 3. AWS S3 Configuration
- [ ] Bucket created
- [ ] Block Public Access: OFF (or configured for public reads)
- [ ] Bucket Policy allows public `s3:GetObject`
- [ ] CORS configured (will add Vercel domain after deploy)

### 4. Database Setup
- [ ] Neon database created
- [ ] Connection string copied
- [ ] Schema pushed (`npx prisma db push`)
- [ ] Test connection works locally

## During Deployment

### 1. Import to Vercel
- [ ] Repository connected to Vercel
- [ ] Build settings verified (Next.js preset)
- [ ] Environment variables added in Vercel dashboard

### 2. First Deployment
- [ ] Deploy triggered
- [ ] Build succeeds (check logs if fails)
- [ ] Site accessible at Vercel URL

### 3. Post-Deploy Configuration
- [ ] Update `NEXT_PUBLIC_BASE_URL` in Vercel to actual URL
- [ ] Redeploy to apply new base URL
- [ ] Update S3 CORS to include Vercel domain

## Post-Deployment Testing

### Functionality Tests
- [ ] Site loads correctly
- [ ] Wallet connection works
- [ ] Can view gallery (after connecting wallet)
- [ ] Images load from S3
- [ ] Admin can access `/upload` page
- [ ] File upload works (as admin)
- [ ] Uploaded stickers appear in gallery
- [ ] Download button works
- [ ] Copy link button works
- [ ] Detail page shows images correctly

### Performance & SEO
- [ ] Discord preview works (share a link)
- [ ] Twitter preview works (share a link)
- [ ] Mobile responsive
- [ ] Images load quickly

### Security
- [ ] `.env.local` not committed to git
- [ ] Admin wallets configured correctly
- [ ] Only admins can upload
- [ ] S3 bucket properly secured

## Maintenance

### Regular Updates
```bash
# Pull latest
git pull origin main

# Install dependencies
npm install

# Test locally
npm run dev

# Commit and push (auto-deploys to Vercel)
git add .
git commit -m "Your commit message"
git push origin main
```

### Database Schema Updates
```bash
# Update schema in prisma/schema.prisma
# Then:
npx prisma generate
npx prisma db push

# Commit
git add .
git commit -m "Update database schema"
git push
```

## Troubleshooting

### Build Fails
- Check Vercel build logs
- Verify all environment variables are set
- Try `npm run build` locally to reproduce

### Database Connection Error
- Verify `DATABASE_URL` is correct
- Check Neon dashboard for connection issues
- Ensure database is not paused (Neon free tier)

### S3 Upload Fails
- Check S3 CORS configuration
- Verify AWS credentials are correct
- Ensure bucket policy allows uploads

### Wallet Connection Issues
- Check browser console for errors
- Verify WalletConnect Project ID
- Try different wallet (MetaMask, Coinbase, etc.)

## Rollback Procedure

If deployment breaks something:

1. Go to Vercel Dashboard → Deployments
2. Find the last working deployment
3. Click "..." → "Promote to Production"
4. Site instantly reverts

## Support

See `VERCEL_DEPLOYMENT.md` for detailed deployment instructions.

