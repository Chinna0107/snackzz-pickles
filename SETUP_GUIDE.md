# Snakzee Environment Setup Guide

## Google OAuth Setup (Fix for "OAuth client was not found" error)

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. Create OAuth 2.0 Credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add Authorized JavaScript origins:
     - `http://localhost:3000` (for local development)
     - `https://snakzee.com` (for production)
     - `https://www.snakzee.com` (for production)
   - Add Authorized redirect URIs:
     - `http://localhost:3000` (for local development)
     - `https://snakzee.com` (for production)
     - `https://www.snakzee.com` (for production)
   - Click "Create"
   - Copy the Client ID

5. Update your `.env.local` file:
   ```
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_ACTUAL_CLIENT_ID.apps.googleusercontent.com
   ```

### Step 2: Backend Environment Variables

Update `/Users/hemanthkancharla/snackzbe/.env`:

```env
# Database
DATABASE_URL=postgresql://neondb_owner:npg_0CknIQXPUj2a@ep-divine-unit-aqarvqac-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require

# Server
PORT=5000
JWT_SECRET=snackzee_super_secret_jwt_key_change_in_production

# Razorpay
RAZORPAY_KEY_ID=rzp_live_SpgbM9FMP5O1mK
RAZORPAY_KEY_SECRET=XGhyx69y41v6z5qroVrE3JhP

# Cloudinary
CLOUDINARY_CLOUD_NAME=dgyykbmt6
CLOUDINARY_API_KEY=595535426832241
CLOUDINARY_API_SECRET=J9mLIU16laiBYIVQuwD9ibRxq9k

# CORS
ALLOWED_ORIGINS=https://snackzz-pickles.vercel.app,https://snakzee.com,https://www.snakzee.com

# MSG91 (for OTP)
MSG91_AUTH_KEY=your_msg91_auth_key_here

# Delhivery (for delivery charges)
DELHIVERY_API_KEY=2028cea0bce2afd1dac8cdcc01dad8d41bcf6b19
DELHIVERY_TOKEN=2028cea0bce2afd1dac8cdcc01dad8d41bcf6b19
DELHIVERY_PICKUP_LOCATION=Warehouse
DELHIVERY_TEST_MODE=false

# WhatsApp
META_WA_TOKEN=your_whatsapp_cloud_api_token
META_WA_PHONE_ID=your_phone_number_id
ADMIN_WHATSAPP_NUMBER=91XXXXXXXXXX
```

## Loyalty Rewards System

The system automatically applies discounts based on order count:

- **Bronze** (0-4 orders): 5% OFF
- **Silver** (5-9 orders): 10% OFF + Free delivery
- **Gold** (10-19 orders): 15% OFF + Priority delivery + Free gift wrap
- **Platinum** (20+ orders): 20% OFF + All Gold perks + Exclusive products

## Delhivery Integration

Delivery charges are calculated based on:
- Customer's pincode
- Order weight
- Prepaid vs COD

## Deployment Checklist

- [ ] Update Google OAuth Client ID in production
- [ ] Add production URLs to Google Console
- [ ] Update all environment variables in Vercel
- [ ] Test Google Sign-in on production
- [ ] Verify Delhivery API integration
- [ ] Test loyalty rewards system



place the apply button and show if availablility otherwise show it like a blocked in coupons section

in cart page 
Order Summary
Subtotal (3 items)
₹597
Delivery
FREE
Total
₹597
remove Delivery and apply coupon section

in home page add some cystomer reviews and enhance properly