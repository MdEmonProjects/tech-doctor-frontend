import { 
  Product, 
  CategoryItem, 
  RepairService, 
  CustomerReview, 
  FAQItem, 
  RepairTrackingTicket, 
  TradeInDeviceOption 
} from '../types';

import heroTechImg from '../assets/images/hero_tech_composition_1786737880771.jpg';
import productIphoneImg from '../assets/images/product_iphone_flagship_1786737934183.jpg';
import productGalaxyImg from '../assets/images/product_galaxy_ultra_1786737945652.jpg';
import productEarbudsImg from '../assets/images/product_earbuds_pro_1786737956115.jpg';
import productWatchImg from '../assets/images/product_smart_watch_1786737966584.jpg';
import promoArrivalImg from '../assets/images/promo_arrival_laptop_1786737909608.jpg';
import promoDealImg from '../assets/images/promo_deal_headphones_1786737899955.jpg';
import repairBenchImg from '../assets/images/repair_bench_service_1786737890146.jpg';
import storeImg from '../assets/images/store_tech_doctor_1786737920610.jpg';

export {
  heroTechImg,
  productIphoneImg,
  productGalaxyImg,
  productEarbudsImg,
  productWatchImg,
  promoArrivalImg,
  promoDealImg,
  repairBenchImg,
  storeImg
};

export const CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-iphone',
    name: 'iPhone',
    slug: 'iphone',
    count: 24,
    image: productIphoneImg,
    description: 'Latest & certified refurbished Apple iPhones with warranty'
  },
  {
    id: 'cat-samsung',
    name: 'Samsung Galaxy',
    slug: 'samsung',
    count: 18,
    image: productGalaxyImg,
    description: 'Flagship Galaxy S-Series, Z-Fold & Z-Flip smartphones'
  },
  {
    id: 'cat-pixel',
    name: 'Google Pixel',
    slug: 'google-pixel',
    count: 12,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80',
    description: 'Pure Android experience with Google Tensor AI imaging'
  },
  {
    id: 'cat-android',
    name: 'Android Phones',
    slug: 'android-phones',
    count: 32,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
    description: 'Curated selection from OnePlus, Xiaomi, and Motorola'
  },
  {
    id: 'cat-cases',
    name: 'Phone Cases',
    slug: 'phone-cases',
    count: 45,
    image: 'https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&w=600&q=80',
    description: 'Shockproof MagSafe, Kevlar armor, and slim frosted cases'
  },
  {
    id: 'cat-chargers',
    name: 'Fast Chargers',
    slug: 'chargers',
    count: 28,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80',
    description: 'GaN fast wall adapters, Qi2 wireless pads, and braided cables'
  },
  {
    id: 'cat-audio',
    name: 'Audio & Buds',
    slug: 'audio',
    count: 19,
    image: productEarbudsImg,
    description: 'Active noise cancelling wireless earbuds and studio headphones'
  },
  {
    id: 'cat-smartwatches',
    name: 'Smartwatches',
    slug: 'smartwatches',
    count: 16,
    image: productWatchImg,
    description: 'Cellular & GPS smart fitness watches and protective bands'
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod-iphone-16-pro',
    name: 'Apple iPhone 16 Pro (256GB)',
    brand: 'Apple',
    category: 'smartphones',
    price: 999.00,
    originalPrice: 1099.00,
    rating: 4.9,
    reviewCount: 142,
    specs: 'Grade Titanium • A18 Pro Chip • 48MP Fusion Camera',
    inStock: true,
    badge: 'Best Seller',
    image: productIphoneImg,
    description: 'Features a strong, lightweight titanium design with textured matte glass back, Action Button, 4K 120 fps Dolby Vision recording, and all-day battery life. Includes 1-year Tech Doctor certified warranty.',
    colors: ['Natural Titanium', 'Black Titanium', 'White Titanium', 'Desert Titanium'],
    features: ['6.3-inch Super Retina XDR display', 'ProMotion 120Hz refresh rate', 'USB-C 3.0 ultra-fast transfer speeds', 'Crash Detection & Emergency SOS'],
    warrantyMonths: 12
  },
  {
    id: 'prod-galaxy-s25-ultra',
    name: 'Samsung Galaxy S25 Ultra (512GB)',
    brand: 'Samsung',
    category: 'smartphones',
    price: 1199.00,
    originalPrice: 1299.00,
    rating: 4.9,
    reviewCount: 98,
    specs: 'Snapdragon 8 Elite • 200MP Quad Tele • Built-in S-Pen',
    inStock: true,
    badge: 'New',
    image: productGalaxyImg,
    description: 'The pinnacle of mobile productivity. Built with a titanium frame, anti-reflective Corning Gorilla Armor, and Galaxy AI live translation tools. Factory unlocked for all global carriers.',
    colors: ['Titanium Gray', 'Titanium Black', 'Titanium Violet', 'Titanium Yellow'],
    features: ['6.8-inch Dynamic AMOLED 2X 2600 nits', 'Built-in precision S-Pen stylus', '5,000mAh intelligent battery', '7 years of guaranteed OS updates'],
    warrantyMonths: 12
  },
  {
    id: 'prod-pixel-9-pro',
    name: 'Google Pixel 9 Pro (128GB)',
    brand: 'Google',
    category: 'smartphones',
    price: 899.00,
    originalPrice: 999.00,
    rating: 4.8,
    reviewCount: 76,
    specs: 'Google Tensor G4 • Gemini Nano AI • 30x Super Res Zoom',
    inStock: true,
    badge: 'Save 20%',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
    description: 'Pro-level photography and seamless Google AI integration. Features a polished metal frame, silky matte glass back, and the brightest Pixel display ever.',
    colors: ['Obsidian', 'Porcelain', 'Hazel', 'Rose Quartz'],
    features: ['6.3-inch Super Actua display', '48MP 5x telephoto lens', 'Pixel Thermometer sensor', 'Titan M2 security chip'],
    warrantyMonths: 12
  },
  {
    id: 'prod-td-anc-buds',
    name: 'Tech Doctor Pro ANC Wireless Earbuds',
    brand: 'Tech Doctor',
    category: 'audio',
    price: 129.00,
    originalPrice: 169.00,
    rating: 4.9,
    reviewCount: 215,
    specs: '-45dB Hybrid ANC • 36h Battery • Qi Wireless Case',
    inStock: true,
    badge: 'Best Seller',
    image: productEarbudsImg,
    description: 'Engineered for audiophiles and phone technicians alike. Delivers crystal-clear call quality with 6 environmental noise-suppression microphones and low-latency gaming mode.',
    colors: ['Matte Black', 'Glacier White', 'Cobalt Blue'],
    features: ['Custom 11mm titanium drivers', 'Transparency mode with speech detection', 'IPX5 sweat and water resistance', 'Multi-point dual device pairing'],
    warrantyMonths: 12
  },
  {
    id: 'prod-smart-watch-ultra',
    name: 'Apex Pro Cellular Smartwatch (46mm)',
    brand: 'Tech Doctor',
    category: 'smartwatches',
    price: 249.00,
    originalPrice: 299.00,
    rating: 4.7,
    reviewCount: 84,
    specs: 'Sapphire Crystal • ECG & SpO2 • 100m Water Resist',
    inStock: true,
    badge: 'Hot Deal',
    image: productWatchImg,
    description: 'Aerospace-grade titanium chassis with military-grade drop resistance. Seamlessly syncs notifications, fitness telemetry, sleep stages, and standalone 4G LTE calls.',
    colors: ['Titanium Black', 'Silver Frost', 'Stealth Navy'],
    features: ['Always-On AMOLED 1.43-inch display', 'Dual-frequency precision GPS', 'Up to 5 days standard battery life', 'Customizable quick-action button'],
    warrantyMonths: 12
  },
  {
    id: 'prod-magsafe-armor-case',
    name: 'ArmorShield Pro MagSafe Case for iPhone 16/15',
    brand: 'Tech Doctor',
    category: 'cases',
    price: 39.99,
    originalPrice: 49.99,
    rating: 4.9,
    reviewCount: 310,
    specs: '15ft Military Drop Tested • N52 Neodymium Ring',
    inStock: true,
    badge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&w=800&q=80',
    description: 'Precision-engineered dual-layer polycarbonate and TPU air-cushioned bumpers. Raised 1.5mm camera ring protects lenses against surface scratches.',
    colors: ['Frosted Smoke', 'Clear Crystal', 'Deep Navy', 'Alpine Green'],
    features: ['Strong magnetic lock for MagSafe accessories', 'Anti-yellowing UV coating', 'Tactile anodized aluminum buttons', 'Textured grip sides'],
    warrantyMonths: 24
  },
  {
    id: 'prod-gan-65w-charger',
    name: '65W Dual USB-C GaN Fast Power Hub',
    brand: 'Tech Doctor',
    category: 'chargers',
    price: 45.00,
    originalPrice: 59.00,
    rating: 4.9,
    reviewCount: 188,
    specs: 'GaN III Tech • Power Delivery 3.0 • PPS Supported',
    inStock: true,
    badge: 'Hot Deal',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
    description: 'Charge your phone to 50% in just 20 minutes. Compact foldable prongs make it the ultimate compact travel adapter for smartphones, tablets, and lightweight laptops.',
    colors: ['Arctic White', 'Midnight Slate'],
    features: ['2x USB-C + 1x USB-A simultaneous ports', 'Active heat-management thermal sensor', 'Universal voltage 100-240V', 'Short-circuit & surge safety'],
    warrantyMonths: 24
  },
  {
    id: 'prod-sapphire-glass-shield',
    name: '9H Diamond-Hardness Privacy Screen Guard',
    brand: 'Tech Doctor',
    category: 'screen_protectors',
    price: 24.99,
    originalPrice: 29.99,
    rating: 4.8,
    reviewCount: 260,
    specs: 'Edge-to-Edge 2.5D • 28° 2-Way Privacy Filter',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80',
    description: 'Keep your screen contents private in public while shielding your OLED panel from shatter shocks and scratches. Includes alignment installation tray for bubble-free application in under 30 seconds.',
    colors: ['Full Privacy Black', 'HD Ultra Clear'],
    features: ['Oleophobic anti-fingerprint coating', 'True touch sensitivity response', 'Zero camera haze or sensor interference', 'Free in-store installation by our technicians'],
    warrantyMonths: 6
  }
];

export const REPAIR_SERVICES: RepairService[] = [
  {
    id: 'service-screen',
    title: 'Screen & OLED Replacement',
    shortDesc: 'Fix cracked glass, broken digitizers, vertical lines, or black displays.',
    fullDesc: 'We replace cracked glass and broken OLED/LCD modules with OEM-spec original grade displays. Colors, 120Hz ProMotion/refresh rates, and True Tone calibration are fully preserved.',
    estimatedTime: '30 - 45 Mins',
    startingPrice: 79,
    warranty: 'Lifetime Warranty on Parts',
    iconName: 'Smartphone',
    popularIssues: ['Cracked front glass', 'Touch unresponsive', 'Green / black vertical lines', 'Flickering display', 'Ghost touch'],
    supportedBrands: ['Apple', 'Samsung', 'Google', 'OnePlus', 'Motorola']
  },
  {
    id: 'service-battery',
    title: 'Battery Health Replacement',
    shortDesc: 'Restore full all-day battery life and prevent unexpected power drops.',
    fullDesc: 'Revitalize sluggish devices with high-capacity zero-cycle replacement cells. Eliminates battery swelling risks, sudden 20% drops, and restores peak CPU throttling performance.',
    estimatedTime: '20 - 30 Mins',
    startingPrice: 49,
    warranty: '1-Year Full Warranty',
    iconName: 'BatteryCharging',
    popularIssues: ['Health degraded below 80%', 'Drains fast', 'Device gets excessively warm', 'Shuts down at 20%', 'Swollen battery lifting screen'],
    supportedBrands: ['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi']
  },
  {
    id: 'service-port',
    title: 'Charging Port & Lightning/USB-C',
    shortDesc: 'Repair loose cables, intermittent connections, or moisture errors.',
    fullDesc: 'From micro-debris ultrasonic cleaning to complete dock flex module micro-soldering. We ensure reliable fast charging, data transfer, and tight cable click.',
    estimatedTime: '30 Mins',
    startingPrice: 39,
    warranty: '180-Day Warranty',
    iconName: 'Zap',
    popularIssues: ['Cable wiggles loose', 'Slow charging speeds', 'Moisture detected warning', 'Microphone muffled on bottom flex', 'No computer sync'],
    supportedBrands: ['Apple', 'Samsung', 'Google', 'OnePlus', 'Sony']
  },
  {
    id: 'service-camera',
    title: 'Camera Lens & Sensor Repair',
    shortDesc: 'Replace cracked lens glass, fix optical image stabilization rattle, or blurry focus.',
    fullDesc: 'Restore crisp 4K recording and sharp portrait photos. We replace individual outer lens sapphire sapphire covers as well as full multi-sensor camera modules.',
    estimatedTime: '45 Mins',
    startingPrice: 59,
    warranty: '180-Day Warranty',
    iconName: 'Camera',
    popularIssues: ['Cracked outer camera sapphire', 'Black camera preview', 'Vibrating / buzzing OIS motor', 'Blurry autofocus', 'Dust specks in lens'],
    supportedBrands: ['Apple', 'Samsung', 'Google', 'OnePlus']
  },
  {
    id: 'service-speaker',
    title: 'Speaker & Microphone Service',
    shortDesc: 'Fix low call volume, distorted loud speakers, or muffled microphones.',
    fullDesc: 'Deep acoustic mesh cleaning and speaker transducer replacement. Fixes quiet earpiece receivers so you can hear callers clearly without needing speakerphone.',
    estimatedTime: '30 Mins',
    startingPrice: 45,
    warranty: '180-Day Warranty',
    iconName: 'Volume2',
    popularIssues: ['Barely hear calls on earpiece', 'Cracking loudspeaker sound', 'Callers cannot hear my voice', 'Siri / Assistant not responding', 'Audio IC failure'],
    supportedBrands: ['Apple', 'Samsung', 'Google', 'OnePlus']
  },
  {
    id: 'service-water',
    title: 'Water Damage Diagnostics',
    shortDesc: 'Ultrasonic board wash, corrosion removal, and logic board power restoration.',
    fullDesc: 'Dropped your phone in water, pool, or coffee? Time is critical. We disassemble the device immediately, neutralize corrosion with ultrasonic isopropyl baths, and test micro-traces under a microscope.',
    estimatedTime: '24 - 48 Hours',
    startingPrice: 69,
    warranty: '90-Day Diagnostic Warranty',
    iconName: 'Droplets',
    popularIssues: ['Device won\'t turn on after liquid exposure', 'Screen has water spots', 'Short circuit hot spots', 'Data recovery priority'],
    supportedBrands: ['Apple', 'Samsung', 'Google', 'OnePlus', 'All Brands']
  },
  {
    id: 'service-software',
    title: 'Software & Boot-Loop Recovery',
    shortDesc: 'Recover stuck Apple logo, Android boot-loops, update crashes, and data backup.',
    fullDesc: 'Expert firmware recovery and flashing without wiping user memories whenever possible. Data extraction, forgotten pin reset support with proof of ownership, and malware removal.',
    estimatedTime: '1 - 2 Hours',
    startingPrice: 49,
    warranty: '100% Satisfaction Guarantee',
    iconName: 'Cpu',
    popularIssues: ['Frozen on Apple/Android boot logo', 'Storage completely full error', 'Failed system update', 'App crashes repeatedly', 'Secure data transfer'],
    supportedBrands: ['Apple', 'Samsung', 'Google', 'OnePlus', 'Huawei']
  },
  {
    id: 'service-diagnostics',
    title: '36-Point Hardware Diagnostics',
    shortDesc: 'Comprehensive device inspection, sensor testing, and transparent quote.',
    fullDesc: 'Not sure what is wrong? Bring your phone in for a complete multi-point test including logic board telemetry, battery cycles, RF signal strength, and screen digitization.',
    estimatedTime: '15 - 20 Mins',
    startingPrice: 0,
    warranty: 'No Fix, No Fee Guarantee',
    iconName: 'ShieldCheck',
    popularIssues: ['Unexplained battery drain', 'Mysterious overheating', 'Intermittent cellular drops', 'Pre-purchase inspection', 'Insurance repair assessment'],
    supportedBrands: ['All Brands & Models']
  }
];

export const DEVICE_CATALOG = {
  Apple: [
    'iPhone 16 Pro Max', 'iPhone 16 Pro', 'iPhone 16 Plus', 'iPhone 16',
    'iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15 Plus', 'iPhone 15',
    'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14', 'iPhone 13 Pro',
    'iPhone 13', 'iPhone 12', 'iPhone 11', 'iPhone SE (3rd Gen)'
  ],
  Samsung: [
    'Galaxy S25 Ultra', 'Galaxy S25+', 'Galaxy S25',
    'Galaxy S24 Ultra', 'Galaxy S24+', 'Galaxy S24',
    'Galaxy S23 Ultra', 'Galaxy S23', 'Galaxy Z Fold 6',
    'Galaxy Z Flip 6', 'Galaxy A55 5G', 'Galaxy A35 5G'
  ],
  Google: [
    'Pixel 9 Pro XL', 'Pixel 9 Pro', 'Pixel 9',
    'Pixel 8 Pro', 'Pixel 8', 'Pixel 8a',
    'Pixel 7 Pro', 'Pixel 7', 'Pixel 7a', 'Pixel Fold'
  ],
  OnePlus: [
    'OnePlus 13', 'OnePlus 12', 'OnePlus 12R',
    'OnePlus Open', 'OnePlus 11', 'OnePlus Nord 4'
  ],
  Other: [
    'Motorola Edge 50 Ultra', 'Xiaomi 14 Ultra', 'Sony Xperia 1 VI', 'Other Brand / Model'
  ]
};

export const REPAIR_PRICE_ESTIMATES: Record<string, Record<string, number>> = {
  'Screen & OLED Replacement': {
    'iPhone 16 Pro Max': 289,
    'iPhone 16 Pro': 249,
    'iPhone 15 Pro Max': 239,
    'iPhone 15': 179,
    'iPhone 14': 149,
    'iPhone 13': 129,
    'Galaxy S25 Ultra': 299,
    'Galaxy S24 Ultra': 269,
    'Galaxy S24': 189,
    'Pixel 9 Pro': 219,
    'Pixel 8': 169,
    'default': 149
  },
  'Battery Health Replacement': {
    'iPhone 16 Pro Max': 89,
    'iPhone 15 Pro': 79,
    'iPhone 14': 69,
    'iPhone 13': 59,
    'Galaxy S25 Ultra': 79,
    'Galaxy S24': 69,
    'Pixel 9 Pro': 75,
    'default': 65
  },
  'Charging Port & Lightning/USB-C': {
    'default': 55
  },
  'Camera Lens & Sensor Repair': {
    'default': 85
  },
  'Speaker & Microphone Service': {
    'default': 49
  },
  'Water Damage Diagnostics': {
    'default': 69
  },
  'Software & Boot-Loop Recovery': {
    'default': 49
  },
  '36-Point Hardware Diagnostics': {
    'default': 0
  }
};

export const CUSTOMER_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    author: 'Marcus Vance',
    rating: 5,
    date: '2 days ago',
    device: 'iPhone 15 Pro',
    serviceOrProduct: 'Screen Replacement',
    comment: 'Dropped my phone onto concrete and shattered the OLED panel completely. Walked into Tech Doctor during my lunch break and picked it up 35 minutes later looking factory-fresh. True Tone and FaceID work perfectly!',
    verified: true
  },
  {
    id: 'rev-2',
    author: 'Elena Rostova',
    rating: 5,
    date: '1 week ago',
    device: 'Galaxy S24 Ultra',
    serviceOrProduct: 'Battery Replacement & Case',
    comment: 'Battery was draining by 2 PM every day. Tech Doctor replaced the cell with an OEM battery and tested the thermal cycles right in front of me. Also grabbed an ArmorShield MagSafe case. Phenomenal service.',
    verified: true
  },
  {
    id: 'rev-3',
    author: 'David Chen',
    rating: 5,
    date: '2 weeks ago',
    device: 'Google Pixel 8 Pro',
    serviceOrProduct: 'Water Damage Diagnostics',
    comment: 'My Pixel took a dive in the swimming pool. Another shop told me it was a total loss, but the technicians at Tech Doctor did micro-soldering on the motherboard and recovered all 4,000 photos of my newborn daughter. Forever grateful!',
    verified: true
  },
  {
    id: 'rev-4',
    author: 'Sophia Martinez',
    rating: 5,
    date: '3 weeks ago',
    device: 'iPhone 16 Pro',
    serviceOrProduct: 'Phone Purchase + 65W GaN Hub',
    comment: 'Purchased an unlocked iPhone 16 Pro and the 65W fast charger. Pricing beat big-box retailers and they transferred all my eSIMs and banking apps free of charge before I left the shop.',
    verified: true
  }
];

export const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How long does a typical repair take?',
    answer: 'Most standard repairs—including iPhone and Samsung screen replacements, battery swaps, camera lenses, and charging ports—are completed in just 20 to 45 minutes. You can relax in our customer lounge with complimentary coffee while our certified technicians fix your device.',
    category: 'repairs'
  },
  {
    id: 'faq-2',
    question: 'Do you repair both iPhone and Android devices?',
    answer: 'Yes! We service Apple (all iPhones, iPads, and Apple Watches), Samsung Galaxy (S-Series, Z-Fold, Z-Flip, A-Series), Google Pixel, OnePlus, Motorola, and other Android smartphones with dedicated diagnostic equipment and genuine-spec parts.',
    category: 'repairs'
  },
  {
    id: 'faq-3',
    question: 'Do you offer a warranty on repairs?',
    answer: 'Absolutely. We back our craftsmanship with a comprehensive warranty: Lifetime Warranty on screen replacement parts and a 1-Year Warranty on battery replacements against manufacturing defects. If you ever experience an issue, we make it right with zero hassle.',
    category: 'warranty'
  },
  {
    id: 'faq-4',
    question: 'Can I get a repair quote before visiting?',
    answer: 'Yes! You can use our instant Repair Quote & Booking tool right on this website to select your device brand, model, and issue for an upfront price estimate with no hidden service fees.',
    category: 'repairs'
  },
  {
    id: 'faq-5',
    question: 'Do I need an appointment?',
    answer: 'Walk-ins are always welcome during all business hours! However, booking a quick reservation online reserves your replacement part in advance and gives you priority express line access.',
    category: 'store'
  },
  {
    id: 'faq-6',
    question: 'What happens if my phone has water damage?',
    answer: 'Do not plug the phone into a charger or put it in rice (rice dust clogs ports and accelerates corrosion). Bring it to Tech Doctor as soon as possible. Our technicians use ultrasonic precision baths and microscopic board diagnostics to neutralize moisture before logic board traces rust.',
    category: 'repairs'
  },
  {
    id: 'faq-7',
    question: 'Can you transfer my data to another phone?',
    answer: 'Yes! We provide full encrypted data migration services between iOS to iOS, Android to Android, and cross-platform between Android and iOS. We transfer your photos, messages, contacts, WhatsApp chats, and apps securely.',
    category: 'products'
  },
  {
    id: 'faq-8',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit and debit cards (Visa, Mastercard, American Express, Discover), Apple Pay, Google Pay, Samsung Pay, PayPal, and flexible Buy-Now-Pay-Later payment options with 0% interest.',
    category: 'store'
  }
];

export const POPULAR_DEVICES = [
  { 
    brand: 'Apple', 
    models: ['iPhone 16 Pro Max', 'iPhone 16 Pro', 'iPhone 16', 'iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15', 'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 13', 'iPhone 12'] 
  },
  { 
    brand: 'Samsung', 
    models: ['Galaxy S24 Ultra', 'Galaxy S24+', 'Galaxy S24', 'Galaxy S23 Ultra', 'Galaxy Z Fold 6', 'Galaxy Z Flip 6', 'Galaxy S22 Ultra'] 
  },
  { 
    brand: 'Google', 
    models: ['Pixel 9 Pro XL', 'Pixel 9 Pro', 'Pixel 9', 'Pixel 8 Pro', 'Pixel 8', 'Pixel 7 Pro'] 
  },
  { 
    brand: 'OnePlus', 
    models: ['OnePlus 12', 'OnePlus 12R', 'OnePlus 11 5G', 'OnePlus Open'] 
  }
];

export const STORE_INFO = {
  name: 'Tech Doctor Flagship Lounge & Repair Lab',
  address: '428 Technology Boulevard, Suite 100, Innovation District',
  cityStateZip: 'Metropolis, NY 10012',
  phone: '+1 (800) 555-TECH (8324)',
  email: 'service@techdoctor-repairs.com',
  hours: [
    { days: 'Monday – Friday', time: '8:30 AM – 7:30 PM' },
    { days: 'Saturday', time: '9:00 AM – 6:00 PM' },
    { days: 'Sunday', time: '10:00 AM – 4:00 PM' }
  ],
  parking: 'Free 2-hour parking available directly in front of the shop and validated underground parking.',
  transit: 'Located 2 minutes walking distance from Central Tech Metro Station (Blue & Red Lines).'
};

export const MOCK_TRACKING_TICKETS: RepairTrackingTicket[] = [
  {
    ticketId: 'TD-84920',
    customerName: 'Alexander Hayes',
    device: 'Apple iPhone 15 Pro Max (Titanium Natural)',
    imeiSnippet: '358291048291***',
    serviceRequested: 'Screen & OLED TrueTone Replacement + Gasket Repressurization',
    dateReceived: 'Today at 10:15 AM',
    estimatedCompletion: 'Today at 2:30 PM',
    currentStep: 4,
    totalSteps: 5,
    statusTitle: 'Automated 24-Point Quality Testing',
    statusBadge: 'Quality Control',
    technician: {
      name: 'Marcus Sterling',
      role: 'Senior Master Hardware Engineer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    steps: [
      {
        name: 'Device Check-in & Intake Sanitization',
        status: 'completed',
        timestamp: '10:15 AM',
        detail: 'Device inspected, serial verified, UV sanitized and logged into cleanroom bench queue.'
      },
      {
        name: 'Digital Diagnostic Board Inspection',
        status: 'completed',
        timestamp: '10:45 AM',
        detail: 'Microscopic logic board scan completed. No trace corrosion detected.'
      },
      {
        name: 'Precision Super Retina XDR OLED Installation',
        status: 'completed',
        timestamp: '11:30 AM',
        detail: 'TrueTone EEPROM serialized transfer successful. Ceramic Shield bonding completed.'
      },
      {
        name: '24-Point Sensor & Water Seal Pressure Test',
        status: 'in-progress',
        timestamp: '12:10 PM',
        detail: 'Undergoing IP68 automated pneumatic repressurization and 120Hz touch latency sweep.'
      },
      {
        name: 'Final Quality Sign-off & Client Notification',
        status: 'pending',
        detail: 'Ready for in-store concierge handoff or express insured courier dispatch.'
      }
    ],
    diagnostics: {
      batteryHealthOriginal: '89% (512 cycles)',
      displayTrueTonePreserved: true,
      waterProofSealPressure: 'Passed IP68 (1.2 atm spec)',
      technicianNotes: 'OLED swap performed flawlessly. TrueTone serialized transfer verified via optical sensor calibration tool. Device ready for pickup shortly.'
    },
    totalCost: 229,
    warrantyPeriod: 'Lifetime Screen Warranty + 1-Year Workmanship Guarantee'
  },
  {
    ticketId: 'TD-91044',
    customerName: 'Sarah Jenkins',
    device: 'Samsung Galaxy S24 Ultra (Titanium Gray)',
    imeiSnippet: '990012849102***',
    serviceRequested: 'OEM High-Density Battery Swap & Thermal Paste Refresh',
    dateReceived: 'Yesterday at 3:45 PM',
    estimatedCompletion: 'Ready for Pickup',
    currentStep: 5,
    totalSteps: 5,
    statusTitle: 'Completed & Certified Ready',
    statusBadge: 'Ready for Pickup',
    technician: {
      name: 'Elena Vance',
      role: 'Lead Micro-Soldering Specialist',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80'
    },
    steps: [
      {
        name: 'Device Check-in & Intake Sanitization',
        status: 'completed',
        timestamp: 'Yesterday 3:45 PM',
        detail: 'Device intake verified and battery health logged at 74%.'
      },
      {
        name: 'Diagnostic Thermal & Voltage Sweep',
        status: 'completed',
        timestamp: 'Yesterday 4:15 PM',
        detail: 'Verified no logic board parasitic draw.'
      },
      {
        name: 'OEM 5,000mAh Battery Installation',
        status: 'completed',
        timestamp: 'Yesterday 5:00 PM',
        detail: 'Applied graphite vapor dissipation sheet and new battery cell.'
      },
      {
        name: 'Fast 45W Charging Cycle & Seal Test',
        status: 'completed',
        timestamp: 'Yesterday 5:45 PM',
        detail: 'Passed 0-50% 45W fast charging thermal check without throttling.'
      },
      {
        name: 'Ready in VIP Concierge Locker',
        status: 'completed',
        timestamp: 'Today 9:00 AM',
        detail: 'Stored in secure climate-controlled locker. Verification code sent via SMS.'
      }
    ],
    diagnostics: {
      batteryHealthOriginal: '74% (810 cycles)',
      batteryHealthNew: '100% (0 cycles)',
      waterProofSealPressure: 'Passed IP68 Seal',
      technicianNotes: 'Brand new OEM Samsung cell installed. Super fast charging 2.0 active. Full 1-Year battery replacement warranty certificate issued.'
    },
    totalCost: 79,
    warrantyPeriod: '1-Year Battery Health Warranty'
  },
  {
    ticketId: 'TD-62810',
    customerName: 'Michael Chang',
    device: 'Google Pixel 8 Pro (Obsidian 256GB)',
    imeiSnippet: '862049182741***',
    serviceRequested: 'Triple Camera Glass & 50MP OIS Sensor Calibration',
    dateReceived: 'Today at 9:00 AM',
    estimatedCompletion: 'Today at 4:00 PM',
    currentStep: 2,
    totalSteps: 5,
    statusTitle: 'Micro-Soldering & Sensor Laser Calibration',
    statusBadge: 'Under Precision Repair',
    technician: {
      name: 'David Kim',
      role: 'Optics & Sensor Calibration Engineer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    },
    steps: [
      {
        name: 'Device Check-in & Intake Sanitization',
        status: 'completed',
        timestamp: '9:00 AM',
        detail: 'Device received with cracked rear camera visor bar.'
      },
      {
        name: 'Sensor Bench Laser Alignment',
        status: 'in-progress',
        timestamp: '11:15 AM',
        detail: 'Removing glass shards in nitrogen cleanroom, replacing sapphire lens cover.'
      },
      {
        name: 'Optical Image Stabilization Calibration',
        status: 'pending',
        detail: 'Aligning gyroscopic stabilization coils.'
      },
      {
        name: '4K60 HDR & Night Sight Test Capture',
        status: 'pending',
        detail: 'Testing optical focus matrix across wide, telephoto, and ultra-wide.'
      },
      {
        name: 'Client Notification',
        status: 'pending',
        detail: 'Will alert customer upon final inspection.'
      }
    ],
    diagnostics: {
      displayTrueTonePreserved: true,
      waterProofSealPressure: 'Pending final assembly',
      technicianNotes: 'Laser alignment in progress. Main 50MP sensor undamaged beneath the visor; sapphire lens replacement proceeding smoothly.'
    },
    totalCost: 119,
    warrantyPeriod: '1-Year Camera & Optics Warranty'
  }
];

export const TRADE_IN_DEVICES: TradeInDeviceOption[] = [
  {
    id: 'trade-iphone-15-pro-max',
    brand: 'Apple',
    name: 'Apple iPhone 15 Pro Max',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80',
    storages: [
      { size: '256GB', baseValue: 720 },
      { size: '512GB', baseValue: 810 },
      { size: '1TB', baseValue: 920 }
    ]
  },
  {
    id: 'trade-iphone-15-pro',
    brand: 'Apple',
    name: 'Apple iPhone 15 Pro',
    image: 'https://images.unsplash.com/photo-1695048065057-de747c32729a?auto=format&fit=crop&w=600&q=80',
    storages: [
      { size: '128GB', baseValue: 580 },
      { size: '256GB', baseValue: 640 },
      { size: '512GB', baseValue: 710 },
      { size: '1TB', baseValue: 790 }
    ]
  },
  {
    id: 'trade-iphone-14-pro-max',
    brand: 'Apple',
    name: 'Apple iPhone 14 Pro Max',
    image: 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?auto=format&fit=crop&w=600&q=80',
    storages: [
      { size: '128GB', baseValue: 480 },
      { size: '256GB', baseValue: 530 },
      { size: '512GB', baseValue: 590 }
    ]
  },
  {
    id: 'trade-samsung-s24-ultra',
    brand: 'Samsung',
    name: 'Samsung Galaxy S24 Ultra 5G',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80',
    storages: [
      { size: '256GB', baseValue: 690 },
      { size: '512GB', baseValue: 780 },
      { size: '1TB', baseValue: 880 }
    ]
  },
  {
    id: 'trade-samsung-z-fold5',
    brand: 'Samsung',
    name: 'Samsung Galaxy Z Fold 5',
    image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80',
    storages: [
      { size: '256GB', baseValue: 550 },
      { size: '512GB', baseValue: 620 }
    ]
  },
  {
    id: 'trade-google-pixel-8-pro',
    brand: 'Google',
    name: 'Google Pixel 8 Pro',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80',
    storages: [
      { size: '128GB', baseValue: 420 },
      { size: '256GB', baseValue: 480 },
      { size: '512GB', baseValue: 540 }
    ]
  }
];

