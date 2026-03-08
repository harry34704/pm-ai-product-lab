"use client";

import { Select } from "@/components/ui/select";

export function StoryCategoryFilter({
  value,
  onChange
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Select value={value} onChange={(event) => onChange(event.target.value)}>
      <option value="ALL">All categories</option>
      <option value="LEADERSHIP">Leadership</option>
      <option value="DELIVERY">Delivery</option>
      <option value="ANALYTICS">Analytics</option>
      <option value="STAKEHOLDER_MANAGEMENT">Stakeholder Management</option>
      <option value="OWNERSHIP">Ownership</option>
      <option value="CONFLICT">Conflict</option>
      <option value="FAILURE">Failure</option>
      <option value="CUSTOMER_FOCUS">Customer Focus</option>
      <option value="AMBIGUITY">Ambiguity</option>
    </Select>
  );
}
