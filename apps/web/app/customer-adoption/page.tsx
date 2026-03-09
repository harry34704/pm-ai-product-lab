import type { Metadata } from "next";
import { CustomerAccountDashboard } from "@/components/customer-adoption/customer-account-dashboard";

export const metadata: Metadata = {
  title: "Customer Adoption Dashboard",
  description: "Customer account self-service adoption dashboard for Jan to Mar 2026."
};

export default function CustomerAdoptionPage() {
  return <CustomerAccountDashboard />;
}
