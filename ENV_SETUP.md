# R2 Environment Variables Setup

Add these to your `.env.local` file:

```bash
# R2 Configuration (from Cloudflare Dashboard)
R2_ACCOUNT_ID=your-r2-account-id
R2_ACCESS_KEY_ID=your-r2-access-key-id
R2_SECRET_ACCESS_KEY=your-r2-secret-access-key
R2_BUCKET_NAME=your-bucket-name

# Public URL for R2 bucket (set this after configuring public access)
# Option 1: Cloudflare-managed public URL (e.g., https://pub-xxxxx.r2.dev)
# Option 2: Custom domain (e.g., https://videos.yourdomain.com)
NEXT_PUBLIC_R2_PUBLIC_URL=https://your-r2-public-url.r2.dev
```

## Steps to get your public URL:

1. Go to Cloudflare Dashboard → R2 → Your Bucket
2. Click "Settings" → "Public Access"
3. Either:
   - **Enable R2.dev subdomain** (instant, gives you `pub-xxxxx.r2.dev`)
   - **Connect custom domain** (recommended, e.g., `videos.seeme.xyz`)

Once you have the public URL, update `NEXT_PUBLIC_R2_PUBLIC_URL` in your `.env.local`

Never commit credential values. Configure production values in Cloudflare Pages and keep local values in ignored environment files.
