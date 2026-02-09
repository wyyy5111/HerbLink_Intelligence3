// API endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: '/api/auth/login',
  AUTH_REGISTER: '/api/auth/register',
  AUTH_REFRESH: '/api/auth/refresh',
  AUTH_LOGOUT: '/api/auth/logout',
  AUTH_ME: '/api/auth/me',

  // User
  USER_PROFILE: (id: string) => `/api/users/${id}`,
  USER_UPDATE: (id: string) => `/api/users/${id}`,
  USER_ORDERS: (id: string) => `/api/users/${id}/orders`,
  USER_FARMS: (id: string) => `/api/users/${id}/farms`,

  // Farm
  FARMS: '/api/farms',
  FARM_DETAIL: (id: string) => `/api/farms/${id}`,
  FARM_CREATE: '/api/farms',
  FARM_UPDATE: (id: string) => `/api/farms/${id}`,
  FARM_MONITORING: (id: string) => `/api/farms/${id}/monitoring`,
  FARM_PRODUCTS: (id: string) => `/api/farms/${id}/products`,

  // Product
  PRODUCTS: '/api/products',
  PRODUCT_DETAIL: (id: string) => `/api/products/${id}`,
  PRODUCT_TRACEABILITY: (id: string) => `/api/products/${id}/traceability`,
  PRODUCT_CREATE: '/api/products',
  PRODUCT_UPDATE: (id: string) => `/api/products/${id}`,

  // Order
  ORDERS: '/api/orders',
  ORDER_DETAIL: (id: string) => `/api/orders/${id}`,
  ORDER_CREATE: '/api/orders',
  ORDER_UPDATE_STATUS: (id: string) => `/api/orders/${id}/status`,
  ORDER_PAY: (id: string) => `/api/orders/${id}/pay`,

  // Market
  MARKET_PRICES: '/api/market/prices',
  MARKET_PRODUCT: (id: string) => `/api/market/prices/${id}`,
  MARKET_REGIONS: '/api/market/prices/regions',
  MARKET_ANALYSIS: '/api/market/analysis',

  // Livestream
  LIVESTREAMS: '/api/livestreams',
  LIVESTREAM_DETAIL: (id: string) => `/api/livestreams/${id}`,
  LIVESTREAM_CREATE: '/api/livestreams',
  LIVESTREAM_START: (id: string) => `/api/livestreams/${id}/start`,
  LIVESTREAM_END: (id: string) => `/api/livestreams/${id}/end`,

  // AI
  AI_CHAT: '/api/ai/chat',
  AI_IDENTIFY: '/api/ai/identify',
  AI_ANALYZE: '/api/ai/analyze',
  AI_PREDICT: '/api/ai/predict',

  // Course
  COURSES: '/api/courses',
  COURSE_DETAIL: (id: string) => `/api/courses/${id}`,
  COURSE_CREATE: '/api/courses',
  COURSE_ENROLL: (id: string) => `/api/courses/${id}/enroll`,
} as const

// Socket events
export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',

  // Market subscription
  SUBSCRIBE_MARKET: 'subscribe:market',
  UNSUBSCRIBE_MARKET: 'unsubscribe:market',
  PRICE_UPDATE: 'price:update',

  // Farm monitoring
  SUBSCRIBE_FARM: 'subscribe:farm',
  UNSUBSCRIBE_FARM: 'unsubscribe:farm',
  FARM_ALERT: 'farm:alert',

  // Livestream
  JOIN_LIVESTREAM: 'join:livestream',
  LEAVE_LIVESTREAM: 'leave:livestream',
  LIVESTREAM_MESSAGE: 'livestream:message',
  LIVESTREAM_VIEWER_COUNT: 'livestream:viewer:count',

  // Notifications
  NOTIFICATION: 'notification',
} as const

// User roles
export const USER_ROLES = {
  CUSTOMER: 'customer',
  FARMER: 'farmer',
  ADMIN: 'admin',
} as const

// Farm status
export const FARM_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const

// Order status
export const ORDER_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const

// Pest risk levels
export const PEST_RISK = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const

// Alert levels
export const ALERT_LEVEL = {
  NORMAL: 'normal',
  WARNING: 'warning',
  CRITICAL: 'critical',
} as const

// Livestream status
export const LIVESTREAM_STATUS = {
  SCHEDULED: 'scheduled',
  LIVE: 'live',
  ENDED: 'ended',
  CANCELLED: 'cancelled',
} as const

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const

// Storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_INFO: 'user_info',
  CART_ITEMS: 'cart_items',
} as const

// Herb categories
export const HERB_CATEGORIES = [
  '根茎类',
  '全草类',
  '花叶类',
  '果实种子类',
  '皮类',
  '藤木类',
  '树脂类',
  '菌藻类',
  '动物类',
  '矿物类',
] as const

// Chinese provinces for farm locations
export const PROVINCES = [
  '安徽', '福建', '甘肃', '广东', '广西', '贵州', '海南', '河北', '河南', '黑龙江',
  '湖北', '湖南', '吉林', '江苏', '江西', '辽宁', '内蒙古', '宁夏', '青海', '山东',
  '山西', '陕西', '上海', '四川', '天津', '西藏', '新疆', '云南', '浙江', '重庆',
] as const

// Payment methods
export const PAYMENT_METHODS = {
  WECHAT: 'wechat',
  ALIPAY: 'alipay',
  BANK_CARD: 'bank_card',
  BALANCE: 'balance',
} as const

// Price ranges for filtering
export const PRICE_RANGES = [
  { label: '0-50元', min: 0, max: 50 },
  { label: '50-100元', min: 50, max: 100 },
  { label: '100-200元', min: 100, max: 200 },
  { label: '200-500元', min: 200, max: 500 },
  { label: '500元以上', min: 500, max: Infinity },
] as const
