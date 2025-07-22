# E-Commerce Storefront

A full-stack e-commerce application built with Django REST Framework backend and Next.js frontend, featuring secure authentication, shopping cart functionality, and Stripe payment integration.

## Tech Stack

**Backend:**
- Django + Django REST Framework
- PostgreSQL
- JWT Authentication (simplejwt)
- Stripe Payments
- SendGrid Email

**Frontend:**
- Next.js 13+ (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui Components
- Zustand (State Management)
- Stripe.js

## Prerequisites

- Python 3.8+
- Node.js 18+
- PostgreSQL
- Stripe Account
- SendGrid Account (optional)

## Setup Instructions

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install django djangorestframework django-cors-headers psycopg2-binary djangorestframework-simplejwt stripe python-decouple pillow sendgrid

# Create database
createdb ecommerce_db

# Configure environment
cp .env.example .env

# Run migrations
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser

# Start server
python manage.py runserver
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local

# Start development server
npm run dev
```

## Environment Variables

### Backend (.env)
```env
SECRET_KEY=your-secret-key
DEBUG=True
DB_NAME=ecommerce_db
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
SENDGRID_API_KEY=your-sendgrid-key
EMAIL_FROM=your-email@example.com
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Project Structure

```
ecommerce-storefront/
├── backend/
│   ├── ecommerce_backend/
│   ├── store/          # Product and cart models/views
│   ├── orders/         # Order management
│   └── accounts/       # User authentication
└── frontend/
    ├── src/
    │   ├── app/        # Next.js pages
    │   ├── components/ # UI components
    │   ├── store/      # State management
    │   ├── lib/        # API utilities
    │   └── types/      # TypeScript interfaces
    └── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/login/` - User login
- `POST /api/auth/register/` - User registration
- `POST /api/auth/token/refresh/` - Refresh JWT token

### Products
- `GET /api/products/` - List products (with search & pagination)
- `GET /api/products/{id}/` - Product details

### Cart
- `GET /api/cart/` - Get user's cart
- `POST /api/cart/add/` - Add item to cart
- `PUT /api/cart/{id}/` - Update cart item
- `DELETE /api/cart/{id}/delete/` - Remove cart item

### Orders
- `GET /api/orders/` - Get user's orders
- `POST /api/orders/create/` - Create new order with payment

## Features

- Product browsing with search and filters
- User authentication (login/register)
- Shopping cart management
- Secure checkout with Stripe
- Order history and tracking
- Responsive design
- Email notifications
- JWT token authentication

## Running the Application

1. Start the Django backend server: `python manage.py runserver`
2. Start the Next.js frontend server: `npm run dev`
3. Access the application at `http://localhost:3000`
4. Admin panel available at `http://localhost:8000/admin`

## Payment Integration

Uses Stripe test mode for payment processing. Order confirmation emails are sent via SendGrid after successful purchases.

## Development Notes

- Frontend uses TypeScript for type safety
- State management handled by Zustand
- UI components from shadcn/ui library
- API calls include JWT token authentication
- Error handling and loading states implemented
- Responsive design with Tailwind CSS

This project demonstrates a modern e-commerce architecture with separate frontend and backend services, secure payment processing, and professional UI components.