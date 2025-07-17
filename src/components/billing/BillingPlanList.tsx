import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Badge,
} from "@tremor/react";
import { BillingPlan, PaymentStatus } from "@/types/billing";


export default function BillingPlanList() {
  // TODO: Replace with actual data from API
  const billingPlans: BillingPlan[] = [];

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Proyecto</TableHeaderCell>
          <TableHeaderCell>Total</TableHeaderCell>
          <TableHeaderCell>Estado</TableHeaderCell>
          <TableHeaderCell>Próximo Pago</TableHeaderCell>
          <TableHeaderCell>Monto Pendiente</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {billingPlans.map((plan) => (
          <TableRow key={plan.id}>
            <TableCell>{plan.projectId}</TableCell>
            <TableCell>${plan.totalAmount.toLocaleString()}</TableCell>
            <TableCell>
              <Badge
                color={
                  plan.status === "ACTIVE"
                    ? "blue"
                    : plan.status === "COMPLETED"
                    ? "green"
                    : "gray"
                }
              >

                {plan.status}
              </Badge>
            </TableCell>
            <TableCell>
              {plan.milestones
                .filter((m) => m.status === PaymentStatus.PENDING)
                .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())[0]
                ?.dueDate.toLocaleDateString()}
            </TableCell>
            <TableCell>
              $
              {plan.milestones
                .filter((m) => m.status === PaymentStatus.PENDING)

                .reduce((sum, m) => sum + m.amount, 0)
                .toLocaleString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

}