export interface Customer {
  customerID: string;
  gender: string;
  SeniorCitizen: number;
  Partner: string;
  Dependents: string;
  tenure: number;
  PhoneService: string;
  MultipleLines: string;
  InternetService: string;
  OnlineSecurity: string;
  OnlineBackup: string;
  DeviceProtection: string;
  TechSupport: string;
  StreamingTV: string;
  StreamingMovies: string;
  Contract: string;
  PaperlessBilling: string;
  PaymentMethod: string;
  MonthlyCharges: number;
  TotalCharges: number;
  Churn: string;

  // Enriched Columns for SaaS project
  LoginFrequency: string;       // Daily, Weekly, Monthly, Rare
  SupportTickets: number;       // 0 to 10
  MonthlyUsageHours: number;    // 10 to 300
  LastLoginDays: number;        // 0 to 30
  NPSScore: number;             // 0 to 10
  SubscriptionPlan: string;     // Basic, Standard, Premium
  AccountHealth: string;        // Good, Fair, Poor
  RevenueAtRisk: number;        // Calculated monthly charges if Churn is Yes and high risk
}

export type TabType = 'dashboard' | 'analytics' | 'prediction' | 'insights' | 'reports' | 'about';

export interface FilterState {
  gender: string;
  Contract: string;
  SubscriptionPlan: string;
  InternetService: string;
  PaymentMethod: string;
  AccountHealth: string;
  Churn: string;
  searchQuery: string;
}

export interface PredictionInput {
  gender: string;
  SeniorCitizen: string;
  Partner: string;
  Dependents: string;
  tenure: number;
  PhoneService: string;
  InternetService: string;
  Contract: string;
  PaymentMethod: string;
  MonthlyCharges: number;
  LoginFrequency: string;
  SupportTickets: number;
  MonthlyUsageHours: number;
  LastLoginDays: number;
  NPSScore: number;
  SubscriptionPlan: string;
  AccountHealth: string;
}

export interface PredictionResult {
  churnProbability: number;
  riskLevel: 'High' | 'Medium' | 'Low';
  recommendations: string[];
  strategies: string[];
}
