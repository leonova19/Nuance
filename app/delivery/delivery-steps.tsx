'use client';

import { useState } from 'react';
import { CreditCard, PackageCheck, Truck } from 'lucide-react';

type DeliveryStep = 'delivery' | 'payment' | 'returns';

const steps: { id: DeliveryStep; label: string; icon: typeof Truck }[] = [
  { id: 'delivery', label: 'Доставка', icon: Truck },
  { id: 'payment', label: 'Оплата', icon: CreditCard },
  { id: 'returns', label: 'Возврат', icon: PackageCheck },
];

export function DeliverySteps({ children }: { children: React.ReactNode }) {
  const [activeStep, setActiveStep] = useState<DeliveryStep>('delivery');
  const stepChildren = Array.isArray(children) ? children : [children];

  return (
    <section className="delivery-steps info-section" aria-label="Условия заказа">
      <div className="delivery-switcher info-tabs" role="tablist" aria-label="Разделы информации о заказе">
        {steps.map((step) => (
          <button
            key={step.id}
            type="button"
            role="tab"
            aria-selected={activeStep === step.id}
            className={`info-tab${activeStep === step.id ? ' active' : ''}`}
            onClick={() => setActiveStep(step.id)}
          >
            <step.icon aria-hidden="true" />
            {step.label}
          </button>
        ))}
      </div>
      <div className="delivery-step-panels info-content">
        {stepChildren.map((child, index) => (
          <div className={`delivery-panel info-panel${activeStep === steps[index]?.id ? ' active' : ''}`} key={steps[index]?.id ?? index}>
            {child}
          </div>
        ))}
      </div>
    </section>
  );
}
