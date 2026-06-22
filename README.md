# OJAM Frontend

Next.js 16 + TypeScript + Tailwind CSS eCommerce storefront for OJAM protein supplements.

## Tech Stack

- **Framework** — Next.js 16 (App Router)
- **Language** — TypeScript
- **Styling** — Tailwind CSS v4
- **State** — Zustand (cart + auth)
- **Data Fetching** — TanStack React Query
- **Payments** — Razorpay

## Prerequisites

- Node.js 18+
- Backend API running on port 5000 (see [ojam-backend](https://github.com/yogeshparmar14/ojam-backend))

## Setup

### 1. Clone the repo

```bash
git clone git@github.com:yogeshparmar14/ojam-frontend.git
cd ojam-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id_here
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── page.tsx          # Home page
│   ├── shop/             # Product listing
│   ├── product/[slug]/   # Product detail
│   ├── cart/             # Shopping cart
│   ├── checkout/         # Checkout flow
│   ├── login/            # Authentication
│   ├── register/
│   ├── account/orders/   # Order history
│   ├── order-success/    # Post-payment confirmation
│   └── admin/            # Admin dashboard
├── components/           # Reusable UI components
├── store/                # Zustand stores (auth, cart)
├── lib/                  # API client, utilities
└── types/                # TypeScript interfaces
```

## Pages

| Route | Description |
|---|---|
| `/` | Home — Hero, categories, featured products |
| `/shop` | All products with filter & sort |
| `/product/[slug]` | Product detail, variants, reviews |
| `/cart` | Cart with coupon support |
| `/checkout` | Address + Razorpay / COD payment |
| `/account/orders` | User order history |
| `/admin` | Admin dashboard (admin only) |
| `/admin/products` | Manage products |
| `/admin/orders` | Manage & update orders |
| `/admin/users` | Manage users |
