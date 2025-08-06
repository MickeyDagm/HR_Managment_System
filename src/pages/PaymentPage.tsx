import { CheckIcon } from '@heroicons/react/20/solid';
import React from 'react';

// Define the Tier interface for typing the tiers array
interface Tier {
  name: string;
  id: string;
  href: string;
  priceMonthly: string;
  description: string;
  features: string[];
  featured: boolean;
}

// Define the tiers array with typed data
const tiers: Tier[] = [
  {
    name: 'Regular',
    id: 'tier-regular',
    href: '#',
    priceMonthly: 'ETB',
    description: "The perfect plan if you're just getting started with our product.",
    features: ['25 products', 'Up to 10,000 subscribers', 'Advanced analytics', '24-hour support response time'],
    featured: false,
  },
  {
    name: 'Enterprise',
    id: 'tier-enterprise',
    href: '#',
    priceMonthly: 'ETB',
    description: 'Dedicated support and infrastructure for your company.',
    features: [
      'Unlimited products',
      'Unlimited subscribers',
      'Advanced analytics',
      'Dedicated support representative',
      'Marketing automations',
      'Custom integrations',
    ],
    featured: true,
  },
];

// Typed classNames function to handle conditional Tailwind classes
const classNames = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

const PaymentPage: React.FC = () => {
  return (
    <div className="relative isolate bg-white px-4 py-12 sm:py-16 lg:px-6">
      <div aria-hidden="true" className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-24 blur-3xl">
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="mx-auto aspect-1155/678 w-200 bg-gradient-to-tr from-[#72c02c] to-[#5ca520] opacity-20"
        />
      </div>
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-sm/6 font-semibold text-[#72c02c]">Pricing</h2>
        <p className="mt-2 text-3xl font-semibold tracking-tight text-balance text-gray-900 sm:text-4xl">
          Choose the right plan for you
        </p>
      </div>
      <p className="mx-auto mt-4 max-w-xl text-center text-base font-medium text-pretty text-gray-600 sm:text-lg/7">
        Choose an affordable plan that’s packed with the best features for engaging your audience, creating customer
        loyalty, and driving sales.
      </p>
      <div className="mx-auto mt-8 grid max-w-md grid-cols-1 items-center gap-y-4 sm:mt-12 sm:gap-y-0 lg:max-w-3xl lg:grid-cols-2">
        {tiers.map((tier, tierIdx) => (
          <div
            key={tier.id}
            className={classNames(
              tier.featured ? 'relative bg-gray-900 shadow-xl hover:scale-105 transition-transform duration-200' : 'bg-white/60 sm:mx-6 lg:mx-0 hover:scale-105 transition-transform duration-200',
              tier.featured
                ? ''
                : tierIdx === 0
                  ? 'rounded-lg sm:rounded-b-none lg:rounded-tr-none lg:rounded-bl-lg'
                  : 'sm:rounded-t-none lg:rounded-tr-lg lg:rounded-bl-none',
              'rounded-lg p-6 ring-1 ring-gray-900/10 sm:p-8',
            )}
          >
            <h3
              id={tier.id}
              className={classNames(tier.featured ? 'text-[#5ca520]' : 'text-[#72c02c]', 'text-sm/6 font-semibold')}
            >
              {tier.name}
            </h3>
            <p className="mt-3 flex items-baseline gap-x-2">
              <span
                className={classNames(
                  tier.featured ? 'text-white' : 'text-gray-900',
                  'text-3xl font-semibold tracking-tight',
                )}
              >
                {tier.priceMonthly}
              </span>
              <span className={classNames(tier.featured ? 'text-gray-400' : 'text-gray-500', 'text-sm')}>
                /month
              </span>
            </p>
            <p className={classNames(tier.featured ? 'text-gray-300' : 'text-gray-600', 'mt-4 text-sm/6')}>
              {tier.description}
            </p>
            <ul
              role="list"
              className={classNames(
                tier.featured ? 'text-gray-300' : 'text-gray-600',
                'mt-6 space-y-2 text-xs/5 sm:mt-8',
              )}
            >
              {tier.features.map((feature) => (
                <li key={feature} className="flex gap-x-2">
                  <CheckIcon
                    aria-hidden="true"
                    className={classNames(tier.featured ? 'text-[#5ca520]' : 'text-[#72c02c]', 'h-5 w-4 flex-none')}
                  />
                  {feature}
                </li>
              ))}
            </ul>
            <a
              href={tier.href}
              aria-describedby={tier.id}
              aria-label={`Get started with ${tier.name} plan`}
              className={classNames(
                tier.featured
                  ? 'bg-[#72c02c] text-white shadow-xs hover:bg-[#5ca520] hover:shadow-md focus-visible:outline-[#72c02c]'
                  : 'text-[#72c02c] ring-1 ring-inset ring-green-200 hover:ring-green-300 hover:shadow-md focus-visible:outline-[#72c02c]',
                'mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-8 transition-colors duration-200',
              )}
            >
              Get started today
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentPage;