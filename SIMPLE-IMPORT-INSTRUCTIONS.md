# Simple Import Instructions for Westminster Tour

## What You Need
- File: `C:\__Ian\tour\westminister\westminister.json`
- Browser: Google Chrome
- URL: `http://localhost:4200/admin/tours`

## Steps

### 1. Open Admin Tours Page
1. Open Google Chrome
2. Navigate to: `http://localhost:4200/admin/tours`
3. You should already be logged in as `julianshaw2000@gmail.com`

### 2. Select Westminster Tour
1. Click on **"Westminster: Power, Crown, and Ceremony"** in the list
2. The tour details will load on the right side
3. Verify the Tour ID shows: `westminster-classic-walk`

### 3. Import JSON File
1. Scroll down to find **"Import JSON"** button
2. Click the **"Import JSON"** button
3. Select file: `C:\__Ian\tour\westminister\westminister.json`
4. Wait for import to complete (should take 2-3 seconds)

### 4. Verify Import Success
1. Click **"Manage stops"** for Westminster tour
2. You should now see **9 POIs** listed:
   - Westminster Abbey
   - Houses of Parliament & Big Ben
   - Parliament Square
   - Whitehall & Downing Street
   - Horse Guards Parade
   - St James's Park
   - Buckingham Palace
   - The Mall
   - Trafalgar Square

## If It Doesn't Work

### Option A: Browser Console Method
1. On the admin tours page, select Westminster tour
2. Press **F12** to open DevTools
3. Go to **Console** tab
4. Copy this entire code and paste it in the console:

```javascript
fetch('file:///C:/__Ian/tour/westminister/westminister.json')
  .then(r => r.text())
  .then(jsonContent => {
    if (window.adminToursComponent) {
      return window.adminToursComponent.importJsonFromString(jsonContent);
    }
  })
  .then(() => {
    console.log('✅ Import completed!');
    alert('Import completed! Check Manage stops.');
  })
  .catch(err => {
    console.error('❌ Import failed:', err);
    alert('Import failed. Try manual import.');
  });
```

### Option B: Manual Entry
If both methods fail, you'll need to manually create each POI:
1. Go to "Manage stops" for Westminster tour
2. Click "New stop" 9 times (once for each POI)
3. Copy the data from the JSON file for each POI

## What Gets Imported
- **Tour details**: Updated with price (£12.99), duration (120 min)
- **9 POIs**: All Westminster stops with coordinates, descriptions, addresses
- **Note**: Images and route GeoJSON still need to be uploaded separately

## Next Steps After Import
1. **Upload Route**: Go back to tour, upload `westminister.geojson`
2. **Upload Images**: For each POI, go to media page and upload corresponding image
3. **Test**: Click "Start tour" on home page to verify

## Expected Result
After successful import, the Westminster tour will have all 9 stops visible in the stops manager, ready for image uploads.
