import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata = {
    title: 'Privacy Policy | TioraS',
    description: 'Our commitment to your privacy.',
  };
  
  export default function PrivacyPolicyPage() {
    return (
      <>
        <Navbar />
        <main className="flex-1">
          <div className="container mx-auto max-w-4xl px-4 py-16">
            <header className="mb-8 text-center">
              <h1 className="font-headline text-4xl font-bold tracking-tighter md:text-5xl">
                Privacy Policy
              </h1>
              <p className="mt-2 text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
            </header>
            <div className="prose prose-lg dark:prose-invert mx-auto">
              <h2>Introduction</h2>
              <p>
                Welcome to TioraS. We are committed to protecting your privacy and handling your data in an open and transparent manner. This privacy policy sets out how we collect, use, and protect any information that you give us when you use this website.
              </p>
      
              <h2>Information We Collect</h2>
              <p>
                We may collect the following information:
              </p>
              <ul>
                <li>Contact information including email address when you place an order or subscribe to our newsletter.</li>
                <li>Shipping information such as name, address, and phone number for order fulfillment.</li>
                <li>Designs and prompts you generate using our AI Design Studio.</li>
                <li>Technical data such as IP address, browser type, and version.</li>
              </ul>
      
              <h2>How We Use Your Information</h2>
              <p>
                We use the information we collect to understand your needs and provide you with a better service, and in particular for the following reasons:
              </p>
              <ul>
                <li>Internal record keeping.</li>
                <li>To process your orders and deliver your products.</li>
                <li>To improve our products and services.</li>
                <li>We may periodically send promotional emails about new products, special offers, or other information which we think you may find interesting using the email address which you have provided.</li>
              </ul>
      
              <h2>Security</h2>
              <p>
                We are committed to ensuring that your information is secure. In order to prevent unauthorized access or disclosure, we have put in place suitable physical, electronic, and managerial procedures to safeguard and secure the information we collect online.
              </p>
      
              <h2>Your Rights</h2>
              <p>
                You have the right to request details of personal information which we hold about you. If you believe that any information we are holding on you is incorrect or incomplete, please write to or email us as soon as possible.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  