# Shopify Preact + Volt + TypeScript Demo

A comprehensive demonstration of building modern Shopify theme app extensions using Preact, Volt (Vite plugin for Shopify), and TypeScript. This project showcases how to create interactive, performant theme extensions that integrate seamlessly with Shopify themes.

## 🚀 Features

- **Modern Stack**: Preact components with TypeScript for type safety
- **Hot Reload**: Lightning-fast development with Volt/Vite
- **CSS Modules**: BEM methodology for maintainable styles
- **Custom Elements**: Seamless Liquid integration via Web Components
- **Responsive Design**: Mobile-first approach with AirDatepicker
- **Cart Integration**: Interactive cart widget with delivery/pickup options
- **Performance Optimized**: Efficient rendering and minimal bundle size

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20.10 or >=21.0.0)
- **npm** or **yarn**
- **Shopify CLI** (v3.77.0 or later)
- **Git**

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd poc-preact-volt-ts
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install extension-specific dependencies
npm install --workspace=theme-preact-demo
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
# Copy the example environment file
cp .env.example .env
```

Configure your Shopify app credentials:

```env
SHOPIFY_API_KEY=your_api_key_here
SHOPIFY_API_SECRET=your_api_secret_here
SHOPIFY_APP_URL=https://your-app-url.com
SHOPIFY_APP_NAME="Your App Name"
```

### 4. Database Setup

This project uses Prisma for database management:

```bash
# Generate Prisma client
npm run prisma generate

# Run database migrations
npm run prisma migrate deploy
```

## 🚀 Development

### Starting the Development Server

```bash
# Start both app and theme extension in development mode
npm run dev

# Or start them separately:
npm run dev:app      # Start Shopify app only
npm run dev:theme    # Start theme extension only
```

### Development Workflow

1. **App Development**: The main Shopify app runs on `http://localhost:3000`
2. **Theme Extension**: The Preact extension builds and watches for changes
3. **Hot Reload**: Changes to Preact components automatically rebuild and refresh

## 📁 Project Structure

```
poc-preact-volt-ts/
├── app/                          # Main Shopify app (Remix)
│   ├── routes/                   # App routes and API endpoints
│   ├── components/               # App-specific components
│   └── models/                   # Database models and business logic
├── extensions/
│   └── theme-preact-demo/        # Theme app extension
│       ├── blocks/               # Liquid templates
│       │   └── cart-widget.liquid
│       ├── frontend/             # Preact application
│       │   ├── components/       # React components
│       │   ├── contexts/         # React contexts
│       │   ├── hooks/            # Custom hooks
│       │   ├── services/         # API services
│       │   ├── styles/           # CSS modules
│       │   └── entrypoints/      # Entry points
│       ├── snippets/             # Liquid snippets
│       └── locales/              # Translation files
├── prisma/                       # Database schema and migrations
├── shared/                       # Shared utilities and types
└── tests/                        # Test files
```

## 🎯 Key Components

### Cart Widget Extension

The main demonstration component is a cart widget that provides:

- **Delivery Options**: Date/time selection with delivery verification
- **Pickup Options**: Store pickup with time slots
- **Location Management**: Integration with Shopify metaobjects
- **Responsive Design**: Mobile-optimized interface

### Integration Points

1. **Liquid Integration**: Custom elements bridge Preact and Liquid
2. **Shopify Data**: Access to cart, products, and shop settings
3. **Metaobjects**: Dynamic content from Shopify's metaobject system
4. **App Settings**: Configuration via app metafields

## 🔧 Configuration

### Theme Extension Settings

The cart widget can be configured through the theme editor:

- **Delivery Settings**: Time ranges, verification options
- **Pickup Options**: Store locations and availability
- **Display Options**: Show/hide various features
- **Customization**: Messages and branding

### App Configuration

Configure the app through Shopify admin:

1. Navigate to your app in Shopify admin
2. Go to App Settings
3. Configure delivery locations and business rules
4. Set up metaobjects for dynamic content

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test suite
npm run test:unit
```

## 📦 Building for Production

```bash
# Build the main app
npm run build

# Build the theme extension
npm run build --workspace=theme-preact-demo

# Deploy to Shopify
npm run deploy
```

## 🚀 Deployment

### 1. Prepare for Production

```bash
# Build all assets
npm run build

# Run database migrations
npm run setup
```

### 2. Deploy to Shopify

```bash
# Deploy the app
npm run deploy
```

### 3. Install in Theme

1. Go to your Shopify theme editor
2. Add the "Cart Widget v2" block to your cart template
3. Configure the widget settings
4. Save and publish your theme

## 🔍 Troubleshooting

### Common Issues

**Extension not loading:**
- Check that the extension is properly installed in your theme
- Verify the Vite build completed successfully
- Check browser console for JavaScript errors

**Styles not applying:**
- Ensure CSS modules are properly imported
- Check for CSS specificity conflicts
- Verify the vite-tag snippet is included

**Database connection issues:**
- Run `npm run prisma generate` to regenerate the client
- Check your database connection string
- Ensure migrations are up to date

### Development Tips

1. **Use Browser DevTools**: Monitor network requests and console errors
2. **Check Shopify Logs**: Review app logs in Shopify admin
3. **Validate Liquid**: Use Shopify's theme check for Liquid syntax
4. **TypeScript**: Leverage TypeScript for better development experience

## 📚 Additional Resources

- [Shopify Theme App Extensions Documentation](https://shopify.dev/docs/apps/online-store/theme-app-extensions)
- [Preact Documentation](https://preactjs.com/guide/v10/getting-started/)
- [Volt Documentation](https://volt.build/)
- [Shopify CLI Documentation](https://shopify.dev/docs/apps/tools/cli)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Review the Shopify documentation
3. Open an issue in this repository
4. Contact the development team

---

**Note**: This is a demonstration project. For production use, ensure you implement proper error handling, security measures, and follow Shopify's best practices.