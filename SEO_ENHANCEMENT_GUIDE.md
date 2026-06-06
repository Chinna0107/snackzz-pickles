# Snakzee Foods SEO Enhancement Guide

## 📋 Overview
Comprehensive SEO optimization for Snakzee Foods website (snakzee.com) with proper verification, sitemap, robots.txt, and schema markup.

---

## 🔍 Updates Made

### 1. **Google Site Verification**
- **File**: `src/app/layout.tsx`
- **Update**: Added Google Site Verification code
  ```
  verification: {
    google: "QBbxueHPe1FQTz0MUuAFdjhdukoPj-qqKHLAaGJJVhU",
  }
  ```
- **Location**: Metadata verification object
- **Impact**: Enables Google Search Console access for crawling, indexing, and performance monitoring

### 2. **Enhanced robots.txt**
- **File**: `public/robots.txt`
- **Updates**:
  - Corrected sitemap URL from old domain to `https://snakzee.com/sitemap.xml`
  - Updated host to `https://snakzee.com`
  - Maintained proper disallow rules for admin, dashboard, api, checkout
- **Purpose**: Guides search engine crawlers on indexing rules

### 3. **Comprehensive Sitemap**
- **File**: `src/app/sitemap.ts`
- **Added Pages**:
  - Home (priority: 1.0, daily)
  - Shop (priority: 0.95, daily)
  - About (priority: 0.8, monthly)
  - How It's Made (priority: 0.8, monthly)
  - Contact (priority: 0.7, monthly)
  - Cook with Snakzee (priority: 0.7, monthly)
  - Products (priority: 0.85, weekly)
  - Cart (priority: 0.5, weekly)
  - Checkout (priority: 0.5, weekly)
  - Login/Register (priority: 0.3, monthly)
  - Legal Pages (priority: 0.3, yearly)
- **Purpose**: Helps search engines discover and crawl all pages efficiently

### 4. **SEO Index HTML**
- **File**: `public/index.html`
- **Includes**:
  - Complete meta tags (charset, viewport, description, keywords)
  - Google Site Verification meta tag
  - Open Graph tags for social sharing
  - Twitter Card tags
  - Comprehensive JSON-LD schema markup
  - Canonical URL
  - Icon links
  - Theme color specification
  - Proper redirect to app
- **Purpose**: Backup SEO page for search engines and fallback

---

## 📊 SEO Metadata Structure

### Title & Description
```
Title: Snakzee Foods — Authentic Homemade Telangana Snacks, Sweets & Podis
Description: Snakzee Foods brings you 100% homemade Telangana snacks, sweets, podis, 
vadiyalu & papads. No preservatives. Made fresh after every order. Free delivery 
above ₹1000 across Telangana.
```

### Keywords
Primary: Snakzee, Snakzee Foods, Telangana snacks, homemade snacks online, authentic Telangana food

Secondary: murukulu, chakodilu, kaju katli, palli podi, vadiyalu, rice papads, avakaya pickle, podis powders, sun-dried vadiyalu, Hyderabad snacks, no preservatives

### JSON-LD Schema
- **Type**: FoodEstablishment
- **Includes**: Business info, address, contact, cuisine type, offers catalog
- **Benefits**: Rich snippets in search results, better SERP appearance

### Open Graph & Twitter Cards
- Optimized for social media sharing
- Custom preview titles and descriptions
- Brand image links

---

## 🔗 Search Console Setup

### Next Steps:
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property: `https://snakzee.com`
3. Verify using the meta tag: `QBbxueHPe1FQTz0MUuAFdjhdukoPj-qqKHLAaGJJVhU`
4. Submit sitemap: `https://snakzee.com/sitemap.xml`
5. Monitor coverage, performance, and indexing

---

## 📱 Mobile & Core Web Vitals

Current optimizations:
- Responsive viewport configuration
- Proper theme color for mobile UI
- Fast Next.js build (Turbopack)
- Image optimization with Next.js Image component
- Font optimization (Google Fonts with display: swap)

---

## 🎯 Ranking Keywords Strategy

### Tier 1 (High Volume, High Intent)
- "Snakzee" / "Snakzee Foods" - branded
- "Telangana snacks online"
- "homemade snacks India"

### Tier 2 (Medium Volume)
- Product specific: "murukulu online", "vadiyalu online", "podis online"
- Regional: "Hyderabad snacks", "Jagtial snacks"

### Tier 3 (Long Tail)
- "homemade sweets Telangana without preservatives"
- "authentic Telangana food delivery"
- "sun-dried snacks online"

---

## 📈 SEO Performance Checklist

- ✅ Google Site Verification
- ✅ XML Sitemap (14 pages)
- ✅ robots.txt with proper rules
- ✅ Canonical URLs
- ✅ Schema markup (JSON-LD)
- ✅ Open Graph tags
- ✅ Twitter Card tags
- ✅ Meta descriptions
- ✅ Keywords optimization
- ✅ Mobile responsive
- ✅ Structured data
- ✅ SSL/HTTPS enabled
- ✅ Fast page load (Next.js optimization)
- ✅ Proper heading hierarchy
- ✅ Alt text for images (in components)

---

## 🚀 Future SEO Enhancements

1. **Blog Section**: Create SEO blog for recipe ideas, snack guides
2. **Product Schema**: Add individual product schema for each item
3. **Reviews Schema**: Implement customer review schema
4. **FAQ Schema**: Add FAQ section with schema markup
5. **Video Schema**: Add product demonstration videos
6. **Local SEO**: Google My Business optimization
7. **Link Building**: Backlinks from food blogs, directories
8. **Content Expansion**: Detailed guides on Telangana cuisine

---

## 📞 Support & Monitoring

**Monitor these metrics:**
- Search impressions and clicks
- Average position in search results
- Click-through rate (CTR)
- Core Web Vitals scores
- Mobile usability issues
- Coverage errors in Google Search Console

**Tools to use:**
- Google Search Console
- Google Analytics 4
- Lighthouse (PageSpeed Insights)
- Screaming Frog SEO Spider (optional)

---

**Last Updated**: 2024
**Domain**: https://snakzee.com
**Status**: Active SEO Optimization
