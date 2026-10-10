/*
  Fallback copy of products.json for when you open the HTML files directly
  (file://), where browsers block fetch() of local files.
  Keep it in sync with products.json, or just serve the folder (see README).
*/
window.PRODUCTS = [
  {
    "id": "canvas-tote",
    "name": "Canvas Tote",
    "category": "Bags",
    "price": 34,
    "rating": 4.8,
    "reviews": 214,
    "shape": "tote",
    "color": "yellow",
    "colors": [
      "yellow",
      "blue",
      "green",
      "coral"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "description": "Durable 16oz cotton canvas with box-stitched handles and an inner zip pocket. Built for daily geometric utility."
  },
  {
    "id": "orb-speaker",
    "name": "Orb Speaker",
    "category": "Tech",
    "price": 59,
    "rating": 4.6,
    "reviews": 132,
    "shape": "orb",
    "color": "blue",
    "colors": [
      "blue",
      "coral",
      "green"
    ],
    "sizes": [],
    "description": "A round Bluetooth speaker with 360\u00b0 sound and a 12-hour battery. Small enough for a backpack pocket."
  },
  {
    "id": "peak-lamp",
    "name": "Peak Lamp",
    "category": "Home",
    "price": 42,
    "rating": 4.7,
    "reviews": 88,
    "shape": "lamp",
    "color": "green",
    "colors": [
      "green",
      "yellow",
      "blue"
    ],
    "sizes": [],
    "description": "Triangle desk lamp with a warm dimmable LED. Clean lines for a clean desk."
  },
  {
    "id": "cube-clock",
    "name": "Cube Clock",
    "category": "Home",
    "price": 27,
    "rating": 4.5,
    "reviews": 61,
    "shape": "clock",
    "color": "coral",
    "colors": [
      "coral",
      "yellow",
      "green"
    ],
    "sizes": [],
    "description": "A silent-sweep wall clock in a tilted-square frame. No ticking while you code."
  },
  {
    "id": "arc-headphones",
    "name": "Arc Headphones",
    "category": "Tech",
    "price": 79,
    "rating": 4.9,
    "reviews": 305,
    "shape": "arc",
    "color": "yellow",
    "colors": [
      "yellow",
      "blue",
      "coral"
    ],
    "sizes": [],
    "description": "Over-ear wireless headphones with soft cushions and 30 hours of playback."
  },
  {
    "id": "ring-mug",
    "name": "Ring Mug",
    "category": "Home",
    "price": 18,
    "rating": 4.4,
    "reviews": 47,
    "shape": "mug",
    "color": "blue",
    "colors": [
      "blue",
      "green",
      "coral",
      "yellow"
    ],
    "sizes": [
      "8oz",
      "12oz"
    ],
    "description": "Ceramic mug with a perfectly round handle. Holds enough coffee for one bug fix."
  }
];
