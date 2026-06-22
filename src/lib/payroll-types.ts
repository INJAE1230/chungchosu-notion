export interface PayrollRecord {
  id: string;
  title: string;
  month: string; // YYYY-MM
  payDate: string; // YYYY-MM-DD
  basePay: number;
  overtimePay: number;
  overtimeHours: number;
  holidayPay: number;
  nightPay: number;
  annualLeavePay: number;
  positionPay: number;
  mealAllowance: number;
  vehicleAllowance: number;
  otherPay: number;
  totalPay: number;
  incomeTax: number;
  residentTax: number;
  healthInsurance: number;
  longTermCare: number;
  nationalPension: number;
  employmentInsurance: number;
  yearEndSettlement: number;
  otherDeduction: number;
  totalDeduction: number;
  netPay: number;
  totalWorkHours: number;
  workDays: number;
  hourlyWage: number;
  note: string;
}

export interface PayrollFormData {
  month: string;
  payDate: string;
  basePay: number;
  overtimePay: number;
  overtimeHours: number;
  holidayPay: number;
  nightPay: number;
  annualLeavePay: number;
  positionPay: number;
  mealAllowance: number;
  vehicleAllowance: number;
  otherPay: number;
  incomeTax: number;
  residentTax: number;
  healthInsurance: number;
  longTermCare: number;
  nationalPension: number;
  employmentInsurance: number;
  yearEndSettlement: number;
  otherDeduction: number;
  totalWorkHours: number;
  workDays: number;
  hourlyWage: number;
  note: string;
}
