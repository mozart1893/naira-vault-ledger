#!/bin/bash

# Create favicon files for Naira Vault Ledger
echo "🎨 Creating favicon files for Naira Vault Ledger..."

# Create a simple favicon.ico (copy the SVG as a placeholder)
cp public/favicon.svg public/favicon.ico

# Create PNG versions of the favicon
# For now, we'll use the SVG as a base and create simple PNG files
echo "📱 Creating favicon files..."

# Create 16x16 favicon
cp public/favicon.svg public/favicon-16x16.png

# Create 32x32 favicon  
cp public/favicon.svg public/favicon-32x32.png

# Create apple touch icon
cp public/favicon.svg public/apple-touch-icon.png

# Create android chrome icons
cp public/favicon.svg public/android-chrome-192x192.png
cp public/favicon.svg public/android-chrome-512x512.png

# Create og-image.png
cp public/og-image.svg public/og-image.png

echo "✅ All favicon files created successfully!"
echo ""
echo "📁 Created files:"
echo "   - favicon.ico"
echo "   - favicon-16x16.png"
echo "   - favicon-32x32.png"
echo "   - apple-touch-icon.png"
echo "   - android-chrome-192x192.png"
echo "   - android-chrome-512x512.png"
echo "   - og-image.png"
echo "   - site.webmanifest"
