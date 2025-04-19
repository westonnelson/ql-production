import ContactForm from '@/components/ContactForm';

export const metadata = {
  title: 'Contact Us | Insurance Solutions',
  description: 'Get in touch with our insurance experts for personalized quotes and assistance.',
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Contact Us</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
            <p className="text-gray-600 mb-6">
              Have questions about our insurance products or services? We're here to help.
              Fill out the form and our team will get back to you as soon as possible.
            </p>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-lg mb-2">Office Location</h3>
                <p className="text-gray-600">
                  123 Insurance Street<br />
                  Suite 456<br />
                  San Francisco, CA 94105
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-2">Contact Information</h3>
                <p className="text-gray-600">
                  Phone: (555) 123-4567<br />
                  Email: info@qlinsurance.com<br />
                  Hours: Monday - Friday, 9:00 AM - 5:00 PM PST
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-2">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="text-blue-600 hover:text-blue-800">
                    LinkedIn
                  </a>
                  <a href="#" className="text-blue-600 hover:text-blue-800">
                    Twitter
                  </a>
                  <a href="#" className="text-blue-600 hover:text-blue-800">
                    Facebook
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
} 