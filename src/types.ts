export interface ServiceCard {
  id: string;
  title: string;
  description: string;
  category: "sourcing" | "procurement" | "logistics" | "consulting";
  features: string[];
}

export interface IndustrySection {
  id: string;
  title: string;
  iconName: string;
  description: string;
  details: string[];
  keyMaterials: string[];
}

export interface ProjectCaseStudy {
  id: string;
  title: string;
  industry: string;
  location: string;
  challenge: string;
  solution: string;
  result: string;
  volumeMetric: string;
  timeline: string;
  trustSignal: string;
}

export interface RFQFormState {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  productRequired: string;
  quantity: string;
  technicalSpecs: string;
  deliveryLocation: string;
  requiredDeliveryDate: string;
  budgetRange: string;
  additionalRequirements: string;
  fileData: string | null;  // base64
  fileName: string | null;
  fileType: string | null;
}

export interface SupplierFormState {
  companyName: string;
  website: string;
  contactInfo: string;
  productCategories: string;
  certifications: string;
  manufacturingCapabilities: string;
  exportMarkets: string;
}

export interface ContactFormState {
  name: string;
  company: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface ServerSubmission {
  id: string;
  type: "rfq" | "contact" | "supplier";
  timestamp: string;
  emailDispatchedTo: string;
  data: any;
}
