import React from 'react';
import { Card } from '@tremor/react';

export default function BillingCalendar() {
  return (
    <div className="grid grid-cols-7 gap-4">
      {Array.from({ length: 31 }, (_, i) => (
        <Card key={i} className="p-4">
          <div className="text-sm font-medium">{i + 1}</div>
          <div className="mt-2 space-y-2">
            {/* TODO: Add billing events for this day */}
          </div>
        </Card>
      ))}
    </div>
  );
}