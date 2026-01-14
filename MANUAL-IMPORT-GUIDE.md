# Manual Import Guide for Westminster Tour

Since file selectors are not working, follow these steps to manually import the data:

## Step 1: Prepare the JSON Content

Copy the entire content from `C:\__Ian\tour\westminister\westminister.json` and minify it (remove newlines and spaces) or use it as-is.

## Step 2: Navigate to Admin Tours Page

1. Go to `http://localhost:4200/admin/tours`
2. Click on **Westminster: Power, Crown, and Ceremony** tour to select it
3. Open browser DevTools console (F12)

## Step 3: Run Import via Console

Paste this code into the console:

```javascript
// Define the JSON content (paste your full JSON here)
const jsonContent = `{
  "tour": {
    "id": "westminster-classic-walk",
    "title": "Westminster: Power, Crown, and Ceremony",
    "location": "Westminster, London",
    "distance_km": 2.5,
    "duration_minutes": 120,
    "price_pence": 1299,
    "currency": "GBP",
    "published": false,
    "cover_image_url": "/media/westminster-hero.jpg",
    "route": {
      "name": "Westminster Classic Walk",
      "geojson_url": "/routes/westminster-classic-walk.geojson"
    }
  },
  "pois": [
    {
      "id": "west-01-abbey",
      "tour_id": "westminster-classic-walk",
      "title": "Westminster Abbey",
      "address": "20 Deans Yard, London SW1P 3PA",
      "order_index": 1,
      "latitude": 51.4993,
      "longitude": -0.1273,
      "description": "Coronations since 1066. Royal tombs. Poets' Corner.",
      "published": true
    },
    {
      "id": "west-02-parliament",
      "tour_id": "westminster-classic-walk",
      "title": "Houses of Parliament & Big Ben",
      "address": "Westminster, London SW1A 0AA",
      "order_index": 2,
      "latitude": 51.5007,
      "longitude": -0.1246,
      "description": "Seat of UK government. Clock tower history and reform.",
      "published": true
    },
    {
      "id": "west-03-parliament-square",
      "tour_id": "westminster-classic-walk",
      "title": "Parliament Square",
      "address": "Parliament Square, London",
      "order_index": 3,
      "latitude": 51.5009,
      "longitude": -0.1261,
      "description": "Political statues and protest ground.",
      "published": true
    },
    {
      "id": "west-04-whitehall",
      "tour_id": "westminster-classic-walk",
      "title": "Whitehall & Downing Street",
      "address": "Whitehall, London SW1A 2HB",
      "order_index": 4,
      "latitude": 51.5034,
      "longitude": -0.1276,
      "description": "Executive power, memorials, and state security.",
      "published": true
    },
    {
      "id": "west-05-horse-guards",
      "tour_id": "westminster-classic-walk",
      "title": "Horse Guards Parade",
      "address": "Whitehall, London SW1A 2ET",
      "order_index": 5,
      "latitude": 51.5039,
      "longitude": -0.1319,
      "description": "Ceremonial parade ground and mounted guards.",
      "published": true
    },
    {
      "id": "west-06-st-james-park",
      "tour_id": "westminster-classic-walk",
      "title": "St James's Park",
      "address": "London SW1A 2BJ",
      "order_index": 6,
      "latitude": 51.5027,
      "longitude": -0.1346,
      "description": "Royal park with palace sightlines.",
      "published": true
    },
    {
      "id": "west-07-buckingham",
      "tour_id": "westminster-classic-walk",
      "title": "Buckingham Palace",
      "address": "London SW1A 1AA",
      "order_index": 7,
      "latitude": 51.5014,
      "longitude": -0.1419,
      "description": "Monarch's residence and guard ceremony.",
      "published": true
    },
    {
      "id": "west-08-the-mall",
      "tour_id": "westminster-classic-walk",
      "title": "The Mall",
      "address": "The Mall, London",
      "order_index": 8,
      "latitude": 51.5063,
      "longitude": -0.141,
      "description": "Processional route for state events.",
      "published": true
    },
    {
      "id": "west-09-trafalgar",
      "tour_id": "westminster-classic-walk",
      "title": "Trafalgar Square",
      "address": "Trafalgar Square, London WC2N 5DN",
      "order_index": 9,
      "latitude": 51.508,
      "longitude": -0.1281,
      "description": "Nelson's Column and national gatherings.",
      "published": true
    }
  ]
}`;

// Execute the import
if (window.adminToursComponent) {
  window.adminToursComponent.importJsonFromString(jsonContent)
    .then(() => {
      console.log('✅ Import completed successfully!');
      console.log('Refresh the page to see the POIs in the stops manager.');
    })
    .catch(err => {
      console.error('❌ Import failed:', err);
    });
} else {
  console.error('❌ Component not found. Make sure you are on /admin/tours page.');
}
```

## Step 4: Verify Import

1. Check the console for success message
2. Navigate to "Manage stops" for Westminster tour
3. Verify all 9 POIs are listed

## Alternative: Manual Entry

If the console method doesn't work, you'll need to manually enter each POI:

1. Go to Manage stops for Westminster tour
2. Click "New stop" for each POI
3. Fill in the details from the JSON file

## Next Steps After Import

Once POIs are imported, you still need to:

1. **Upload Route GeoJSON**: Manually select `westminister.geojson` file
2. **Upload Images**: For each POI, go to media page and upload the corresponding image
3. **Upload Cover Image**: Upload `westminster-hero.jpg` as tour cover

## Image Upload Mapping

| POI ID | Image File |
|--------|-----------|
| west-01-abbey | westminster-abbey.jpg |
| west-02-parliament | houses-of-parliament.jpg |
| west-03-parliament-square | parliament-square.jpg |
| west-04-whitehall | whitehall.jpg |
| west-05-horse-guards | horse-guards-parade.jpg |
| west-06-st-james-park | st-jamess-park.jpg |
| west-07-buckingham | buckingham-palace.jpg |
| west-08-the-mall | the-mall.jpg |
| west-09-trafalgar | trafalgar-square.jpg |
