import { CheckIcon, PhoneIcon } from '@heroicons/react/20/solid';
import React from 'react';
import { Helmet } from "react-helmet-async";


// Define the Tier interface for typing the tiers array
interface Tier {
  name: string;
  id: string;
  href: string;
  price: string;
  features: string[];
  featured: boolean;
}

// Define the tiers array with typed data
const tiers: Tier[] = [
  {
    name: '1 Month CV Search',
    id: '1-month',
    href: '#',
    price: '3000 ETB',
    features: [
      'Preview candidates profile for free before viwing their CV',
      'Download & Contact up to 50 CVs',
      'Access Expires after 1 month',
      'Unlimited Searching',
      '24 hours Support'
    ],
    featured: false,
  },
   {
    name: '3 Month CV Search',
    id: '3-month',
    href: '#',
    price: '8000 ETB',
    features: [
      'Preview candidates profile for free before viwing their CV',
      'Download & Contact up to 150 CVs',
      'Access Expires after 3 month',
      'Unlimited Searching',
      '24 hours Support'
    ],   
     featured: false,
  },
   {
    name: '6 Month CV Search',
    id: '6-month',
    href: '#',
    price: '15000 ETB',
    features: [
      'Preview candidates profile for free before viwing their CV',
      'Download & Contact up to 350 CVs',
      'Access Expires after 6 month',
      'Unlimited Searching',
      '24 hours Support'
    ],
    featured: false,
  },
  {
    name: '1 year CV Search',
    id: '1-year',
    href: '#',
    price: '25000 ETB',
    features: [
      'Preview candidates profile for free before viwing their CV',
      'Download & Contact up to 1000 CVs',
      'Access Expires after 1 year',
      'Unlimited Searching',
      '24 hours Support'
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
    <>
      <Helmet>
        <title>Payment | HR Management System</title>
      </Helmet>
      <div className="mx-auto  text-center">
        <p className="text-3xl font-semibold tracking-tight text-balance text-gray-900 sm:text-3xl">
          Choose the right plan for you
        </p>
      </div>
      <div className="mx-auto mt-8 grid  grid-cols-2 items-center gap-3 sm:mt-12  lg:grid-cols-4">
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
              className={classNames(tier.featured ? 'text-[#5ca520]' : 'text-[#72c02c]', 'text-lg font-semibold')}
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
                {tier.price}
              </span>
            </p>
            <ul
              role="list"
              className={classNames(
                tier.featured ? 'text-gray-300' : 'text-gray-600',
                'mt-6 space-y-2 text-sm sm:mt-8',
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
      <div className='mt-5 p-3 bg-[#72c02c]'>
        <p className='text-md text-white text-center px-auto sm:text-wrap'>Need More Detail? Contact Marketing Team <PhoneIcon className='w-6 h-5 inline'/> 0988747248 </p>
      </div>    
    </>
  );
};

export default PaymentPage;