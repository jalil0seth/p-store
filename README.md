# E-Commerce Store with PocketBase Backend

This is a modern e-commerce store built with React and PocketBase as the backend. This guide will help you set up and configure the application.

## 🚀 Quick Start

### Prerequisites

- Node.js 16 or higher
- npm or yarn package manager
- Access to a PocketBase server (external or self-hosted)

### External PocketBase Server Setup

The application is configured to use an external PocketBase server at `http://217.76.51.2:8090`. Here's how to set it up:

1. Access the PocketBase Admin UI:
```
http://217.76.51.2:8090/_/
```

2. Create an admin account or use the existing credentials:
```
Email: fc96b2ce-c8f9-4a77-a323-077f92f176ac@admin.com
Password: fc96b2ce-c8f9-4a77-a323-077f92f176ac
```

3. Configure CORS settings in the Admin UI:
   - Go to Settings > API
   - Add your frontend URL to allowed origins (e.g., `http://localhost:3000`)
   - Enable the necessary HTTP methods (GET, POST, PATCH, DELETE)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd store
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
# Copy the example env file
cp .env.example .env

# The PocketBase URL is already set to the external server
# No need to modify VITE_POCKETBASE_URL unless using a different server
```

4. Run the setup script to initialize the database:
```bash
node src/scripts/setup-direct.mjs
```

5. Start the development server:
```bash
npm run dev
```

## 🔧 PocketBase Configuration

### Collections Schema

The application uses the following collections:

#### 1. store_products
```javascript
{
  name: "store_products",
  type: "base",
  schema: [
    {
      name: "name",
      type: "text",
      required: true
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true
    },
    {
      name: "description",
      type: "text",
      required: true
    },
    {
      name: "price",
      type: "number",
      required: true,
      min: 0
    },
    {
      name: "originalPrice",
      type: "number",
      required: true,
      min: 0
    },
    {
      name: "discount",
      type: "number",
      required: true,
      min: 0,
      max: 100
    },
    {
      name: "stock",
      type: "number",
      required: true,
      min: 0
    },
    {
      name: "image",
      type: "text",
      required: true
    },
    {
      name: "images",
      type: "json",
      required: false
    },
    {
      name: "category",
      type: "text",
      required: true
    },
    {
      name: "rating",
      type: "number",
      required: true,
      min: 0,
      max: 5
    },
    {
      name: "reviews",
      type: "number",
      required: true,
      min: 0
    },
    {
      name: "reviewsList",
      type: "json",
      required: false
    },
    {
      name: "badge",
      type: "text",
      required: false
    },
    {
      name: "similarProducts",
      type: "json",
      required: false
    },
    {
      name: "specifications",
      type: "json",
      required: false
    }
  ]
}
```

### External Server Details

The application uses an external PocketBase server with the following configuration:

- Server URL: `http://217.76.51.2:8090`
- Admin UI: `http://217.76.51.2:8090/_/`
- API Base URL: `http://217.76.51.2:8090/api/`

### Authentication

Admin authentication is pre-configured with the following credentials:
```javascript
const adminEmail = "fc96b2ce-c8f9-4a77-a323-077f92f176ac@admin.com";
const adminPassword = "fc96b2ce-c8f9-4a77-a323-077f92f176ac";
```

### API Access

The external server provides the following endpoints:

- Admin UI: `http://217.76.51.2:8090/_/`
- API Root: `http://217.76.51.2:8090/api/`
- Collections: `http://217.76.51.2:8090/api/collections/`
- Files: `http://217.76.51.2:8090/api/files/`

### Security Considerations

When using an external PocketBase server:

1. **CORS Configuration**
   - Ensure your domain is added to the allowed origins
   - Configure appropriate HTTP methods
   - Set up proper headers

2. **Authentication**
   - Keep admin credentials secure
   - Use environment variables for sensitive data
   - Implement proper token management

3. **Data Security**
   - Use HTTPS for all communications
   - Implement proper access rules
   - Regular security audits

### Backup and Recovery

The external server handles backups automatically, but you can:

1. Export collections through the Admin UI
2. Use the API to create data snapshots
3. Implement your own backup strategy

### API Endpoints

The following API endpoints are available:

#### Products
- GET `/api/collections/store_products/records` - List all products
- GET `/api/collections/store_products/records/:id` - Get single product
- POST `/api/collections/store_products/records` - Create product (admin only)
- PATCH `/api/collections/store_products/records/:id` - Update product (admin only)
- DELETE `/api/collections/store_products/records/:id` - Delete product (admin only)

#### Authentication
- POST `/api/admins/auth-with-password` - Admin login
- POST `/api/collections/users/auth-with-password` - User login
- POST `/api/collections/users/records` - User registration

## 🔒 Security

### API Security Rules

Configure collection security rules in PocketBase Admin UI:

1. Navigate to Collections > store_products > Rules
2. Set up the following rules:
   - List/View: Authenticated users
   - Create/Update/Delete: Admins only

### CORS Configuration

Update CORS settings in PocketBase Admin UI:

1. Navigate to Settings > API
2. Add your frontend URL to allowed origins
3. Configure allowed methods and headers

## 🛠 Development

### Adding New Collections

1. Create collection schema in `src/scripts/setup-direct.mjs`
2. Add collection to setup function
3. Run setup script
4. Update TypeScript types in `src/types`

### Modifying Existing Collections

1. Update schema in setup script
2. Run update command:
```bash
node src/scripts/setup-direct.mjs --update
```

### Testing API

Use the included test script:
```bash
node src/scripts/test-api.mjs
```

## 📚 Additional Resources

- [PocketBase Documentation](https://pocketbase.io/docs/)
- [PocketBase API Reference](https://pocketbase.io/docs/api-records/)
- [PocketBase JavaScript SDK](https://github.com/pocketbase/js-sdk)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
