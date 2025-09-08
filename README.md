# Daily Ironing Service Website

A modern, responsive website for a home-based ironing service with integrated Google Maps API for address autocomplete.

## Features

- **Interactive Price Calculator**: Real-time pricing with 24-hour express service options
- **Address Autocomplete**: Secure Google Maps API integration via Supabase Edge Functions
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Service Area Coverage**: South Surrey, Langley, and White Rock
- **Professional UI**: Clean, modern interface with smooth animations

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React
- **Backend**: Supabase Edge Functions
- **Maps**: Google Maps API (Places Autocomplete)

## Environment Setup

### Required Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase Edge Function Setup

The Google Maps API integration requires setting up a Supabase Edge Function:

1. **Install Supabase CLI**:
   ```bash
   npm install -g supabase
   ```

2. **Login and Link Project**:
   ```bash
   supabase login
   supabase link --project-ref your-project-ref
   ```

3. **Set Google Maps API Key as Secret**:
   ```bash
   supabase secrets set GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

4. **Deploy Edge Function**:
   ```bash
   supabase functions deploy google-maps-proxy
   ```

### Google Maps API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Places API
   - Geocoding API
4. Create credentials (API Key)
5. Restrict the API key to your domains for security

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/           # React components
│   ├── Header.tsx       # Site header with logo and contact
│   ├── Hero.tsx         # Hero section with value propositions
│   ├── Calculator.tsx   # Interactive pricing calculator
│   ├── ServiceAreas.tsx # Service coverage areas
│   ├── About.tsx        # About section with company values
│   ├── Contact.tsx      # Contact form and information
│   ├── Footer.tsx       # Site footer
│   └── SchedulePickupForm.tsx # Pickup scheduling modal
├── hooks/               # Custom React hooks
│   └── useAddressAutocomplete.ts # Address autocomplete logic
├── App.tsx             # Main app component
├── main.tsx            # App entry point
└── index.css           # Global styles and design system

supabase/
└── functions/
    └── google-maps-proxy/
        └── index.ts     # Edge function for Google Maps API
```

## Design System

### Colors
- **Primary Navy**: `#2C3E50` - Main text and headers
- **Accent Coral**: `#E87461` - Primary buttons and highlights
- **Background Cream**: `#FFF8F0` - Section backgrounds
- **Logo Orange**: `#F4A261` - Logo accent color
- **Logo Blue**: `#4285F4` - Logo accent color

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Components
- **Cards**: Rounded corners with hover animations
- **Buttons**: Consistent styling with hover states
- **Forms**: Clean inputs with focus states
- **Responsive**: Mobile-first breakpoints

## API Integration

### Google Maps Edge Function

The `google-maps-proxy` Edge Function provides two endpoints:

1. **Address Autocomplete**:
   ```typescript
   POST /functions/v1/google-maps-proxy/autocomplete
   {
     "input": "123 Main St",
     "types": "address",
     "componentRestrictions": { "country": "ca" }
   }
   ```

2. **Address Geocoding**:
   ```typescript
   POST /functions/v1/google-maps-proxy/geocode
   {
     "address": "123 Main Street, Surrey, BC"
   }
   ```

### Security Features

- API keys stored as Supabase secrets
- CORS headers properly configured
- Input validation and error handling
- Rate limiting through Supabase

## Deployment

### Frontend Deployment
The frontend can be deployed to any static hosting service:

- **Netlify**: Connect your GitHub repo for automatic deployments
- **Vercel**: Import project and configure environment variables
- **Supabase Hosting**: Use `supabase hosting` commands

### Edge Function Deployment
Edge Functions are deployed to Supabase:

```bash
# Deploy all functions
supabase functions deploy

# Deploy specific function
supabase functions deploy google-maps-proxy
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary software for Daily Ironing Service.