export type UserRole = "admin" | "tenant";
export type RentStatus = "paid" | "pending";

export interface UserRow {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  created_at: string;
}

export interface PropertyRow {
  id: string;
  name: string;
  location: string;
  owner_id: string;
}

export interface TenancyRow {
  id: string;
  user_id: string;
  property_id: string;
  start_date: string;
  advance_paid: number;
  monthly_rent: number;
  status: string;
}

export interface RentPaymentRow {
  id: string;
  tenancy_id: string;
  month: string;
  amount: number;
  status: RentStatus;
  paid_on: string | null;
}

export interface ElectricityRow {
  id: string;
  tenancy_id: string;
  initial_reading: number;
  current_reading: number;
  units_used: number;
  bill_amount: number;
  paid_on: string | null;
}

export interface TenancyRecord extends TenancyRow {
  user?: UserRow | null;
  property?: PropertyRow | null;
  rent_payments: RentPaymentRow[];
  electricity: ElectricityRow[];
}

export interface DashboardMetrics {
  totalRentCollected: number;
  pendingRentCount: number;
  advanceRemaining: number;
  electricitySummary: number;
  paidRentAmount: number;
  pendingRentAmount: number;
  rentTrend: Array<{
    month: string;
    paid: number;
    pending: number;
  }>;
  paidVsPending: Array<{
    name: string;
    value: number;
  }>;
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: UserRow;
        Insert: Partial<UserRow> & Pick<UserRow, "id">;
        Update: Partial<UserRow>;
        Relationships: [];
      };
      properties: {
        Row: PropertyRow;
        Insert: Omit<PropertyRow, "id"> & Partial<Pick<PropertyRow, "id">>;
        Update: Partial<PropertyRow>;
        Relationships: [
          {
            foreignKeyName: "properties_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      tenancies: {
        Row: TenancyRow;
        Insert: Omit<TenancyRow, "id"> & Partial<Pick<TenancyRow, "id">>;
        Update: Partial<TenancyRow>;
        Relationships: [
          {
            foreignKeyName: "tenancies_property_id_fkey";
            columns: ["property_id"];
            isOneToOne: false;
            referencedRelation: "properties";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tenancies_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      rent_payments: {
        Row: RentPaymentRow;
        Insert: Omit<RentPaymentRow, "id"> & Partial<Pick<RentPaymentRow, "id">>;
        Update: Partial<RentPaymentRow>;
        Relationships: [
          {
            foreignKeyName: "rent_payments_tenancy_id_fkey";
            columns: ["tenancy_id"];
            isOneToOne: false;
            referencedRelation: "tenancies";
            referencedColumns: ["id"];
          }
        ];
      };
      electricity: {
        Row: ElectricityRow;
        Insert: Omit<ElectricityRow, "id"> & Partial<Pick<ElectricityRow, "id">>;
        Update: Partial<ElectricityRow>;
        Relationships: [
          {
            foreignKeyName: "electricity_tenancy_id_fkey";
            columns: ["tenancy_id"];
            isOneToOne: false;
            referencedRelation: "tenancies";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
