# Environment Variables Setup

Create a `.env.local` file in the root directory with the following variables:

```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@host/database

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_S3_BUCKET_NAME=your-bucket-name
AWS_REGION=us-east-1

# Web3 Configuration
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_or_leave_empty_for_default
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_ADMIN_WALLETS=0xYourWalletAddress1,0xYourWalletAddress2

# App Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Variable Descriptions

### DATABASE_URL
Your Neon PostgreSQL connection string. Get this from your Neon dashboard.

Format: `postgresql://[user]:[password]@[host]/[database]?sslmode=require`

### AWS Credentials
- **AWS_ACCESS_KEY_ID**: Your IAM user access key
- **AWS_SECRET_ACCESS_KEY**: Your IAM user secret key
- **AWS_S3_BUCKET_NAME**: The name of your S3 bucket
- **AWS_REGION**: AWS region where your bucket is located (e.g., `us-east-1`)

### Web3 Configuration
- **NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID**: Optional. WalletConnect project ID. If not provided, a fallback is used.
- **NEXT_PUBLIC_NFT_CONTRACT_ADDRESS**: Contract address for NFT gating (set to `0x0...` to disable)
- **NEXT_PUBLIC_ADMIN_WALLETS**: Comma-separated list of wallet addresses that can upload content

### App Configuration
- **NEXT_PUBLIC_BASE_URL**: Your app's base URL (use `http://localhost:3000` for local, update to Vercel URL for production)

## Important Notes

1. **Never commit `.env.local` to git** - it's already in `.gitignore`
2. **For Vercel deployment**, add these variables in the Vercel dashboard under Settings → Environment Variables
3. **Admin wallets** must be lowercase and comma-separated with no spaces
4. **S3 bucket** must have public read access and proper CORS configuration

