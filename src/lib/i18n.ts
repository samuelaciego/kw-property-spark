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