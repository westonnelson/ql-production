// Test script for submitting leads of different types
const testLeads = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  // Life Insurance Lead
  const lifeLead = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'test-life@example.com',
    phone: '5551234567',
    age: 35,
    gender: 'male',
    product_type: 'life',
    coverage_amount: 500000,
    term_length: 20,
    tobacco_use: false,
    utm_source: 'test'
  };
  
  // Disability Insurance Lead
  const disabilityLead = {
    first_name: 'Jane',
    last_name: 'Smith',
    email: 'test-disability@example.com',
    phone: '5559876543',
    age: 40,
    gender: 'female',
    product_type: 'disability',
    occupation: 'Software Engineer',
    employment_status: 'Full-time',
    income_range: '$100,000 - $150,000',
    utm_source: 'test'
  };
  
  // Supplemental Health Insurance Lead
  const supplementalLead = {
    first_name: 'Robert',
    last_name: 'Johnson',
    email: 'test-supplemental@example.com',
    phone: '5555555555',
    age: 45,
    gender: 'male',
    product_type: 'supplemental',
    pre_existing_conditions: 'None',
    desired_coverage_type: 'Medicare Supplement',
    utm_source: 'test'
  };
  
  const leads = [lifeLead, disabilityLead, supplementalLead];
  
  for (const lead of leads) {
    console.log(`Testing ${lead.product_type} lead submission...`);
    try {
      const response = await fetch(`${baseUrl}/api/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lead),
      });
      
      const result = await response.json();
      console.log(`Result for ${lead.product_type} lead:`, result);
      
      if (result.success) {
        console.log(`✅ ${lead.product_type} lead submitted successfully`);
      } else {
        console.error(`❌ ${lead.product_type} lead submission failed:`, result.error);
      }
    } catch (error) {
      console.error(`❌ Error submitting ${lead.product_type} lead:`, error);
    }
    
    // Wait a bit between submissions
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
};

// Run the tests
testLeads().catch(console.error); 