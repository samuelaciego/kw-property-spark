export type Language = 'en' | 'es';

export interface Translations {
  // Common
  loading: string;
  save: string;
  cancel: string;
  edit: string;
  delete: string;
  view: string;
  download: string;
  share: string;
  back: string;
  
  // Navigation
  dashboard: string;
  processProperty: string;
  plans: string;
  profile: string;
  logout: string;
  login: string;
  signUp: string;
  features: string;
  pricing: string;
  about: string;
  
  // Profile
  profileTitle: string;
  personalInformation: string;
  name: string;
  company: string;
  language: string;
  agencyLogo: string;
  uploadLogo: string;
  currentPlan: string;
  usage: string;
  upgradeNow: string;
  
  // Dashboard
  myProperties: string;
  url: string;
  title: string;
  status: string;
  views: string;
  actions: string;
  viewProperty: string;
  noProperties: string;
  startProcessing: string;
  
  // Property Processor
  propertyProcessorTitle: string;
  enterUrl: string;
  processUrl: string;
  processing: string;
  
  // Plans
  freePlan: string;
  proPlan: string;
  enterprisePlan: string;
  monthly: string;
  perMonth: string;
  
  // Languages
  english: string;
  spanish: string;
  
  // Hero Section
  exclusiveForKW: string;
  automatePropertyMarketing: string;
  yourProperties: string;
  heroSubtitle: string;
  automaticExtraction: string;
  aiContent: string;
  automaticVideos: string;
  startFreeTrial: string;
  goToDashboard: string;
  processProperties: string;
  seeDemo: string;
  trustedBy: string;
  officialPartner: string;
  
  // Features Section
  mainFeatures: string;
  everythingYouNeed: string;
  toStandOut: string;
  featuresDescription: string;
  simpleProcess: string;
  pasteLink: string;
  pasteLinkDesc: string;
  aiProcessing: string;
  aiProcessingDesc: string;
  readyContent: string;
  readyContentDesc: string;
  tryFeatures: string;
  
  // Features
  automaticExtractionTitle: string;
  automaticExtractionDesc: string;
  socialImages: string;
  socialImagesDesc: string;
  optimizedContent: string;
  optimizedContentDesc: string;
  automaticVideosTitle: string;
  automaticVideosDesc: string;
  controlPanel: string;
  controlPanelDesc: string;
  secureReliable: string;
  secureReliableDesc: string;
  
  // Pricing Section
  plansAndPricing: string;
  choosePerfectPlan: string;
  forYourBusiness: string;
  pricingDescription: string;
  mostPopular: string;
  basic: string;
  professional: string;
  enterprise: string;
  basicDesc: string;
  professionalDesc: string;
  enterpriseDesc: string;
  startBasic: string;
  startProfessional: string;
  contactSales: string;
  frequentQuestions: string;
  
  // Footer
  footerDescription: string;
  quickLinks: string;
  tutorials: string;
  support: string;
  contact: string;
  privacy: string;
  terms: string;
  cookies: string;
  madeWithLove: string;
}

const translations: Record<Language, Translations> = {
  en: {
    // Common
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    view: 'View',
    download: 'Download',
    share: 'Share',
    back: 'Back',
    
    // Navigation
    dashboard: 'Dashboard',
    processProperty: 'Process Property',
    plans: 'Plans',
    profile: 'Profile',
    logout: 'Logout',
    login: 'Login',
    signUp: 'Sign Up',
    features: 'Features',
    pricing: 'Pricing',
    about: 'About',
    
    // Profile
    profileTitle: 'Profile',
    personalInformation: 'Personal Information',
    name: 'Name',
    company: 'Company',
    language: 'Language',
    agencyLogo: 'Agency Logo',
    uploadLogo: 'Upload Logo',
    currentPlan: 'Current Plan',
    usage: 'Usage',
    upgradeNow: 'Upgrade Now',
    
    // Dashboard
    myProperties: 'My Properties',
    url: 'URL',
    title: 'Title',
    status: 'Status',
    views: 'Views',
    actions: 'Actions',
    viewProperty: 'View Property',
    noProperties: 'No properties found. Start processing your first property!',
    startProcessing: 'Start Processing',
    
    // Property Processor
    propertyProcessorTitle: 'Property Processor',
    enterUrl: 'Enter property URL',
    processUrl: 'Process URL',
    processing: 'Processing...',
    
    // Plans
    freePlan: 'Free',
    proPlan: 'Pro',
    enterprisePlan: 'Enterprise',
    monthly: 'Monthly',
    perMonth: '/month',
    
    // Languages
    english: 'English',
    spanish: 'Spanish',
    
    // Hero Section
    exclusiveForKW: 'Exclusive for Keller Williams Agents',
    automatePropertyMarketing: 'Automate Marketing of',
    yourProperties: 'your Properties',
    heroSubtitle: 'Extract property data automatically and generate professional social media content in seconds.',
    automaticExtraction: 'Automatic Extraction',
    aiContent: 'AI Content',
    automaticVideos: 'Automatic Videos',
    startFreeTrial: 'Start Free Trial',
    goToDashboard: 'Go to Dashboard',
    processProperties: 'Process Properties',
    seeDemo: 'See Demo',
    trustedBy: 'Trusted by over 1,000+ real estate agents',
    officialPartner: 'Official Partner',
    
    // Features Section
    mainFeatures: 'Main Features',
    everythingYouNeed: 'Everything you need to',
    toStandOut: 'stand out',
    featuresDescription: 'A complete solution that automates your entire real estate marketing workflow, from data extraction to professional content generation.',
    simpleProcess: 'Simple 3-Step Process',
    pasteLink: '1. Paste the Link',
    pasteLinkDesc: 'Copy and paste any Keller Williams property URL',
    aiProcessing: '2. AI Processing',
    aiProcessingDesc: 'Our system extracts and processes all information automatically',
    readyContent: '3. Ready Content',
    readyContentDesc: 'Download images, videos and texts optimized for social media',
    tryFeatures: 'Try Features',
    
    // Features
    automaticExtractionTitle: 'Automatic Extraction',
    automaticExtractionDesc: 'Enter any KW property link and automatically extract title, description, price, address, images and agent data.',
    socialImages: 'Social Media Images',
    socialImagesDesc: 'Automatically generate professional images for Instagram and Facebook with personalized agent branding.',
    optimizedContent: 'Optimized Content',
    optimizedContentDesc: 'Create texts with relevant hashtags and effective calls to action to maximize engagement.',
    automaticVideosTitle: 'Automatic Videos',
    automaticVideosDesc: 'Produce professional short videos combining property photos with persuasive text.',
    controlPanel: 'Control Panel',
    controlPanelDesc: 'Access a complete history of all processed properties and performance metrics.',
    secureReliable: 'Secure and Reliable',
    secureReliableDesc: 'Google OAuth 2.0 authentication and secure cloud storage with automatic backups.',
    
    // Pricing Section
    plansAndPricing: 'Plans and Pricing',
    choosePerfectPlan: 'Choose the perfect plan for',
    forYourBusiness: 'your business',
    pricingDescription: 'All plans include a 14-day free trial. No commitments, cancel anytime.',
    mostPopular: 'Most Popular',
    basic: 'Basic',
    professional: 'Professional',
    enterprise: 'Enterprise',
    basicDesc: 'Perfect for agents who are getting started',
    professionalDesc: 'The most popular option for active agents',
    enterpriseDesc: 'For teams and complete offices',
    startBasic: 'Start Basic',
    startProfessional: 'Start Professional',
    contactSales: 'Contact Sales',
    frequentQuestions: 'Frequently Asked Questions',
    
    // Footer
    footerDescription: 'The ultimate tool for Keller Williams real estate agents looking to automate and optimize their digital property marketing.',
    quickLinks: 'Quick Links',
    tutorials: 'Tutorials',
    support: 'Support',
    contact: 'Contact',
    privacy: 'Privacy',
    terms: 'Terms',
    cookies: 'Cookies',
    madeWithLove: 'Made with ❤️ for real estate agents',
  },
  es: {
    // Common
    loading: 'Cargando...',
    save: 'Guardar',
    cancel: 'Cancelar',
    edit: 'Editar',
    delete: 'Eliminar',
    view: 'Ver',
    download: 'Descargar',
    share: 'Compartir',
    back: 'Volver',
    
    // Navigation
    dashboard: 'Panel',
    processProperty: 'Procesar Propiedad',
    plans: 'Planes',
    profile: 'Perfil',
    logout: 'Cerrar Sesión',
    login: 'Iniciar Sesión',
    signUp: 'Registrarse',
    features: 'Características',
    pricing: 'Precios',
    about: 'Nosotros',
    
    // Profile
    profileTitle: 'Perfil',
    personalInformation: 'Información Personal',
    name: 'Nombre',
    company: 'Empresa',
    language: 'Idioma',
    agencyLogo: 'Logo de Agencia',
    uploadLogo: 'Subir Logo',
    currentPlan: 'Plan Actual',
    usage: 'Uso',
    upgradeNow: 'Actualizar Ahora',
    
    // Dashboard
    myProperties: 'Mis Propiedades',
    url: 'URL',
    title: 'Título',
    status: 'Estado',
    views: 'Vistas',
    actions: 'Acciones',
    viewProperty: 'Ver Propiedad',
    noProperties: 'No se encontraron propiedades. ¡Comienza procesando tu primera propiedad!',
    startProcessing: 'Comenzar Procesamiento',
    
    // Property Processor
    propertyProcessorTitle: 'Procesador de Propiedades',
    enterUrl: 'Ingresa la URL de la propiedad',
    processUrl: 'Procesar URL',
    processing: 'Procesando...',
    
    // Plans
    freePlan: 'Gratis',
    proPlan: 'Pro',
    enterprisePlan: 'Empresarial',
    monthly: 'Mensual',
    perMonth: '/mes',
    
    // Languages
    english: 'Inglés',
    spanish: 'Español',
    
    // Hero Section
    exclusiveForKW: 'Exclusivo para Agentes de Keller Williams',
    automatePropertyMarketing: 'Automatiza el Marketing de',
    yourProperties: 'tus Propiedades',
    heroSubtitle: 'Extrae datos de propiedades automáticamente y genera contenido profesional para redes sociales en segundos.',
    automaticExtraction: 'Extracción Automática',
    aiContent: 'Contenido IA',
    automaticVideos: 'Videos Automáticos',
    startFreeTrial: 'Comenzar Prueba Gratuita',
    goToDashboard: 'Ir al Dashboard',
    processProperties: 'Procesar Propiedades',
    seeDemo: 'Ver Demo',
    trustedBy: 'Confiado por más de 1,000+ agentes inmobiliarios',
    officialPartner: 'Partner Oficial',
    
    // Features Section
    mainFeatures: 'Características Principales',
    everythingYouNeed: 'Todo lo que necesitas para',
    toStandOut: 'destacar',
    featuresDescription: 'Una solución completa que automatiza todo tu flujo de trabajo de marketing inmobiliario, desde la extracción de datos hasta la generación de contenido profesional.',
    simpleProcess: 'Proceso Simple en 3 Pasos',
    pasteLink: '1. Pega el Enlace',
    pasteLinkDesc: 'Copia y pega cualquier URL de propiedad de Keller Williams',
    aiProcessing: '2. Procesamiento IA',
    aiProcessingDesc: 'Nuestro sistema extrae y procesa toda la información automáticamente',
    readyContent: '3. Contenido Listo',
    readyContentDesc: 'Descarga imágenes, videos y textos optimizados para redes sociales',
    tryFeatures: 'Probar Características',
    
    // Features
    automaticExtractionTitle: 'Extracción Automática',
    automaticExtractionDesc: 'Ingresa cualquier enlace de propiedad de KW y extrae automáticamente título, descripción, precio, dirección, imágenes y datos del agente.',
    socialImages: 'Imágenes para Redes',
    socialImagesDesc: 'Genera automáticamente imágenes profesionales para Instagram y Facebook con el branding personalizado del agente.',
    optimizedContent: 'Contenido Optimizado',
    optimizedContentDesc: 'Crea textos con hashtags relevantes y llamadas a la acción efectivas para maximizar el engagement.',
    automaticVideosTitle: 'Videos Automáticos',
    automaticVideosDesc: 'Produce videos cortos profesionales combinando las fotos de la propiedad con texto persuasivo.',
    controlPanel: 'Panel de Control',
    controlPanelDesc: 'Accede a un historial completo de todas las propiedades procesadas y métricas de rendimiento.',
    secureReliable: 'Seguro y Confiable',
    secureReliableDesc: 'Autenticación con Google OAuth 2.0 y almacenamiento seguro en la nube con respaldos automáticos.',
    
    // Pricing Section
    plansAndPricing: 'Planes y Precios',
    choosePerfectPlan: 'Elige el plan perfecto para',
    forYourBusiness: 'tu negocio',
    pricingDescription: 'Todos los planes incluyen prueba gratuita de 14 días. Sin compromisos, cancela cuando quieras.',
    mostPopular: 'Más Popular',
    basic: 'Básico',
    professional: 'Profesional',
    enterprise: 'Empresarial',
    basicDesc: 'Perfecto para agentes que están comenzando',
    professionalDesc: 'La opción más popular para agentes activos',
    enterpriseDesc: 'Para equipos y oficinas completas',
    startBasic: 'Comenzar Básico',
    startProfessional: 'Comenzar Profesional',
    contactSales: 'Contactar Ventas',
    frequentQuestions: 'Preguntas Frecuentes',
    
    // Footer
    footerDescription: 'La herramienta definitiva para agentes inmobiliarios de Keller Williams que buscan automatizar y optimizar su marketing digital de propiedades.',
    quickLinks: 'Enlaces Rápidos',
    tutorials: 'Tutoriales',
    support: 'Soporte',
    contact: 'Contacto',
    privacy: 'Privacidad',
    terms: 'Términos',
    cookies: 'Cookies',
    madeWithLove: 'Hecho con ❤️ para agentes inmobiliarios',
  },
};

export function getTranslations(language: Language): Translations {
  return translations[language] || translations.en;
}

export function getAvailableLanguages(): Array<{ code: Language; name: string }> {
  return [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
  ];
}