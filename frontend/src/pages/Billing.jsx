import { useState } from 'react';

const Billing = ({ shop }) => {
  const [currentPlan, setCurrentPlan] = useState('free');

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      features: ['2 languages', '500K chars/month'],
      color: '#6d7175'
    },
    {
      id: 'basic',
      name: 'Basic',
      price: 9.99,
      features: ['10 languages', '5M chars/month', 'Widget customization'],
      popular: true,
      color: '#008060'
    },
    {
      id: 'growth',
      name: 'Growth',
      price: 24.99,
      features: ['50 languages', '20M chars/month', 'Manual editor', 'SEO hreflang'],
      color: '#5c6ac4'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 49.99,
      features: ['130+ languages', 'Unlimited', 'All features', 'Priority support'],
      color: '#ff6d00'
    },
  ];

  const handleSelectPlan = (planId) => {
    setCurrentPlan(planId);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: '600' }}>Billing</h1>
        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
          Choose a plan that fits your needs.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {plans.map((plan) => (
          <div
            key={plan.id}
            style={{
              background: 'white',
              padding: '24px',
              borderRadius: '12px',
              border: plan.popular ? `2px solid ${plan.color}` : '1px solid #e3e3e3',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {plan.popular && (
              <div style={{
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: plan.color,
                color: 'white',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                Most Popular
              </div>
            )}
            
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '600' }}>{plan.name}</h3>
              <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
                ${plan.price.toFixed(2)}
                <span style={{ fontSize: '14px', color: '#666', fontWeight: 'normal' }}>/mo</span>
              </div>
            </div>
            
            <ul style={{ margin: '0 0 20px 0', padding: '0 0 0 20px', flex: 1, fontSize: '14px' }}>
              {plan.features.map((feature, i) => (
                <li key={i} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#008060' }}>✓</span> {feature}
                </li>
              ))}
            </ul>
            
            <button
              onClick={() => handleSelectPlan(plan.id)}
              disabled={currentPlan === plan.id}
              style={{
                width: '100%',
                padding: '12px',
                background: currentPlan === plan.id ? '#e3e3e3' : plan.color,
                color: currentPlan === plan.id ? '#666' : 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: currentPlan === plan.id ? 'default' : 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              {currentPlan === plan.id ? 'Current Plan' : plan.price === 0 ? 'Downgrade' : 'Select Plan'}
            </button>
          </div>
        ))}
      </div>

      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e3e3e3' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Current Subscription</h3>
        
        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Plan</div>
            <div style={{ fontSize: '16px', fontWeight: '500' }}>
              {plans.find(p => p.id === currentPlan)?.name}
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Price</div>
            <div style={{ fontSize: '16px', fontWeight: '500' }}>
              ${plans.find(p => p.id === currentPlan)?.price.toFixed(2)}/month
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Languages</div>
            <div style={{ fontSize: '16px', fontWeight: '500' }}>
              {plans.find(p => p.id === currentPlan)?.features[0]}
            </div>
          </div>
        </div>

        {currentPlan !== 'free' && (
          <button
            style={{
              marginTop: '16px',
              padding: '8px 16px',
              background: 'none',
              border: '1px solid #dc3545',
              color: '#dc3545',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Cancel Subscription
          </button>
        )}
      </div>
    </div>
  );
};

export default Billing;
