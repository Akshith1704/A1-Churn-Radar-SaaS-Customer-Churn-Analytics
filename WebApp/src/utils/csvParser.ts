import { Customer } from '../types';

// Simple hash function to generate deterministic values based on customerID
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Deterministic helper to get a pseudo-random value between min and max
function getDeterministicValue(id: string, seed: string, min: number, max: number): number {
  const hash = hashCode(id + seed);
  return min + (hash % (max - min + 1));
}

// Deterministic helper to select from array
function getDeterministicChoice<T>(id: string, seed: string, choices: T[]): T {
  const idx = hashCode(id + seed) % choices.length;
  return choices[idx];
}

export function parseCSV(csvText: string): Customer[] {
  const lines = csvText.trim().split('\n');
  if (lines.length <= 1) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
  const customers: Customer[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Robust CSV split considering quotes (standard Telco data doesn't have nested commas within quotes usually, but let's handle simple cases)
    const values: string[] = [];
    let insideQuote = false;
    let currentValue = '';

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"' || char === "'") {
        insideQuote = !insideQuote;
      } else if (char === ',' && !insideQuote) {
        values.push(currentValue.trim().replace(/^["']|["']$/g, ''));
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim().replace(/^["']|["']$/g, ''));

    if (values.length < headers.length) continue;

    const rawObj: any = {};
    headers.forEach((header, index) => {
      rawObj[header] = values[index];
    });

    const customerID = rawObj.customerID || `CUST-${i}`;
    const tenure = parseInt(rawObj.tenure) || 0;
    const monthlyCharges = parseFloat(rawObj.MonthlyCharges) || 0;
    const totalCharges = parseFloat(rawObj.TotalCharges) || (tenure * monthlyCharges) || 0;
    const isChurned = rawObj.Churn === 'Yes';

    // Establish correlated enriched fields
    // Churned customers are more likely to have high support tickets, low NPS, poor health, rare login frequency
    const ticketBias = isChurned ? 3 : 0;
    const supportTickets = getDeterministicValue(customerID, 'tickets', 0, 6) + ticketBias;
    const finalSupportTickets = Math.min(supportTickets, 10);

    const npsBias = isChurned ? -3 : 2;
    const npsScore = Math.max(0, Math.min(10, getDeterministicValue(customerID, 'nps', 4, 8) + npsBias));

    const loginChoices = isChurned 
      ? ['Monthly', 'Rare', 'Weekly'] 
      : ['Daily', 'Weekly', 'Weekly', 'Daily'];
    const loginFrequency = getDeterministicChoice(customerID, 'login_freq', loginChoices);

    const usageMin = monthlyCharges > 80 ? 120 : 10;
    const usageMax = monthlyCharges > 80 ? 300 : 150;
    const monthlyUsageHours = getDeterministicValue(customerID, 'usage_hours', usageMin, usageMax);

    const lastLoginDays = isChurned
      ? getDeterministicValue(customerID, 'last_login', 5, 29)
      : getDeterministicValue(customerID, 'last_login', 0, 6);

    const contractType = rawObj.Contract || 'Month-to-month';
    const hasOnlineSecurity = rawObj.OnlineSecurity === 'Yes';
    const hasTechSupport = rawObj.TechSupport === 'Yes';

    // Account Health Calculation
    // Positive factors: tenure, online security, tech support, high NPS, low support tickets
    // Negative factors: Churn intent, month-to-month, high support tickets, no tech support
    let healthScore = 50;
    healthScore += tenure * 0.5;
    if (hasOnlineSecurity) healthScore += 15;
    if (hasTechSupport) healthScore += 15;
    healthScore += (npsScore - 5) * 5;
    healthScore -= finalSupportTickets * 8;
    if (contractType === 'Two year') healthScore += 20;
    if (contractType === 'Month-to-month') healthScore -= 15;
    if (isChurned) healthScore -= 25;

    let accountHealth = 'Fair';
    if (healthScore > 65) accountHealth = 'Good';
    else if (healthScore < 35) accountHealth = 'Poor';

    // Plan categorization based on Monthly Charges
    let subscriptionPlan = 'Basic';
    if (monthlyCharges > 85) subscriptionPlan = 'Premium';
    else if (monthlyCharges > 45) subscriptionPlan = 'Standard';

    // Calculate revenue at risk
    // High risk customers (Poor health + Month-to-month + Churn = Yes or Churn = No but NPS < 4)
    const isAtRisk = isChurned || (accountHealth === 'Poor' && contractType === 'Month-to-month');
    const revenueAtRisk = isAtRisk ? monthlyCharges : 0;

    const customer: Customer = {
      customerID,
      gender: rawObj.gender || getDeterministicChoice(customerID, 'gender', ['Male', 'Female']),
      SeniorCitizen: parseInt(rawObj.SeniorCitizen) || 0,
      Partner: rawObj.Partner || 'No',
      Dependents: rawObj.Dependents || 'No',
      tenure,
      PhoneService: rawObj.PhoneService || 'Yes',
      MultipleLines: rawObj.MultipleLines || 'No',
      InternetService: rawObj.InternetService || 'DSL',
      OnlineSecurity: rawObj.OnlineSecurity || 'No',
      OnlineBackup: rawObj.OnlineBackup || 'No',
      DeviceProtection: rawObj.DeviceProtection || 'No',
      TechSupport: rawObj.TechSupport || 'No',
      StreamingTV: rawObj.StreamingTV || 'No',
      StreamingMovies: rawObj.StreamingMovies || 'No',
      Contract: contractType,
      PaperlessBilling: rawObj.PaperlessBilling || 'No',
      PaymentMethod: rawObj.PaymentMethod || 'Electronic check',
      MonthlyCharges: monthlyCharges,
      TotalCharges: totalCharges,
      Churn: rawObj.Churn || 'No',
      
      // Enriched
      LoginFrequency: loginFrequency,
      SupportTickets: finalSupportTickets,
      MonthlyUsageHours: monthlyUsageHours,
      LastLoginDays: lastLoginDays,
      NPSScore: npsScore,
      SubscriptionPlan: subscriptionPlan,
      AccountHealth: accountHealth,
      RevenueAtRisk: revenueAtRisk
    };

    customers.push(customer);
  }

  return customers;
}
