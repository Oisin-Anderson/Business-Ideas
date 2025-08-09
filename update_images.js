const fs = require('fs');

// Read the current business ideas file
const content = fs.readFileSync('businessIdeas.js', 'utf8');

// Define image mappings for different categories
const imageMappings = {
  // Technology/Business
  tech: [
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400"
  ],
  
  // Food/Restaurant
  food: [
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400",
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400",
    "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400",
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400"
  ],
  
  // Health/Fitness
  health: [
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400"
  ],
  
  // Creative/Design
  creative: [
    "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400",
    "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400",
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400"
  ],
  
  // E-commerce/Retail
  ecommerce: [
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
    "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400",
    "https://images.unsplash.com/photo-1544191696-102dbdaeeaa5?w=400",
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400"
  ],
  
  // Education
  education: [
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400",
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400",
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400"
  ],
  
  // Travel/Tourism
  travel: [
    "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=400",
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400"
  ],
  
  // Pets
  pets: [
    "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400",
    "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400",
    "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400"
  ],
  
  // Sports/Fitness
  sports: [
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400"
  ],
  
  // Fashion
  fashion: [
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400",
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400",
    "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400"
  ],
  
  // Automotive
  auto: [
    "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400",
    "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400",
    "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=400"
  ],
  
  // Construction/Home
  construction: [
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400",
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400",
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400"
  ],
  
  // Property/Real Estate
  property: [
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400",
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400",
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400"
  ],
  
  // Entertainment
  entertainment: [
    "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400",
    "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400",
    "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400"
  ],
  
  // Local/Services
  local: [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"
  ],
  
  // Marketplace
  marketplace: [
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400"
  ],
  
  // Subscription
  subscription: [
    "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400",
    "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400",
    "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400"
  ],
  
  // Security
  security: [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"
  ],
  
  // App
  app: [
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400"
  ],
  
  // Business
  business: [
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400"
  ],
  
  // Eco
  eco: [
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400"
  ],
  
  // Events
  events: [
    "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400",
    "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400",
    "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400"
  ],
  
  // Product
  product: [
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400"
  ],
  
  // Retail
  retail: [
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400"
  ],
  
  // Service
  service: [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"
  ],
  
  // Consulting
  consulting: [
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400"
  ],
  
  // Luxury
  luxury: [
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400"
  ],
  
  // Women
  women: [
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400"
  ],
  
  // Kitchen
  kitchen: [
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400",
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400",
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400"
  ],
  
  // Networking
  networking: [
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400"
  ]
};

// Function to get a random image for a category
function getRandomImage(category) {
  const images = imageMappings[category] || imageMappings.tech;
  return images[Math.floor(Math.random() * images.length)];
}

// Function to get the best image based on categories
function getBestImage(categories) {
  // Priority order for categories
  const priorityOrder = ['food', 'health', 'tech', 'fashion', 'pets', 'sports', 'auto', 'construction', 'property', 'entertainment', 'local', 'marketplace', 'subscription', 'security', 'app', 'business', 'eco', 'events', 'product', 'retail', 'service', 'consulting', 'luxury', 'women', 'kitchen', 'networking'];
  
  for (const priority of priorityOrder) {
    if (categories.includes(priority)) {
      return getRandomImage(priority);
    }
  }
  
  return getRandomImage('tech'); // Default fallback
}

// Parse the business ideas and update images
let updatedContent = content;
let imageIndex = 0;

// Find all image lines and replace them
const imageRegex = /image: "https:\/\/images\.unsplash\.com\/photo-[^"]+",/g;
updatedContent = updatedContent.replace(imageRegex, (match) => {
  // Extract the business idea context to determine categories
  const beforeMatch = updatedContent.substring(0, updatedContent.indexOf(match));
  const afterMatch = updatedContent.substring(updatedContent.indexOf(match) + match.length);
  
  // Find the categories for this business idea
  const categoriesMatch = beforeMatch.match(/categories: \[([^\]]+)\]/);
  if (categoriesMatch) {
    const categories = categoriesMatch[1].split(',').map(cat => cat.trim().replace(/"/g, ''));
    const newImage = getBestImage(categories);
    return `image: "${newImage}",`;
  }
  
  // Fallback to cycling through different images
  const images = [
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400",
    "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400",
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400",
    "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400",
    "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400",
    "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=400",
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400",
    "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400",
    "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400",
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
    "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400",
    "https://images.unsplash.com/photo-1544191696-102dbdaeeaa5?w=400",
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400"
  ];
  
  const newImage = images[imageIndex % images.length];
  imageIndex++;
  return `image: "${newImage}",`;
});

// Write the updated content back to the file
fs.writeFileSync('businessIdeas.js', updatedContent);

console.log('Images updated successfully!'); 