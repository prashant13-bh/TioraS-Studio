import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata = {
    title: 'Terms of Service | TioraS',
    description: 'The terms and conditions for using TioraS services.',
  };
  
  export default function TermsOfServicePage() {
    return (
      <>
        <Navbar />
        <main className="flex-1">
          <div className="container mx-auto max-w-4xl px-4 py-8 md:py-16">
            <header className="mb-8 text-center">
              <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tighter lg:text-5xl">
                Terms of Service
              </h1>
              <p className="mt-2 text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
            </header>
            <div className="prose prose-base md:prose-lg dark:prose-invert mx-auto">
              <h2>1. Agreement to Terms</h2>
              <p>
                By using our website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
      
              <h2>2. AI Design Studio</h2>
              <p>
                You are responsible for the text prompts you provide to the AI Design Studio. You agree not to generate content that is unlawful, harmful, defamatory, obscene, or otherwise objectionable. We reserve the right to review and reject designs that violate our policies.
              </p>
              <p>
                You retain the rights to the unique aspects of your prompts, but you grant TioraS a worldwide, non-exclusive, royalty-free license to use, reproduce, and display the generated designs for the purpose of fulfilling your order and for marketing purposes.
              </p>
      
              <h2>3. Orders and Payment</h2>
              <p>
                All orders are subject to acceptance and availability. We reserve the right to refuse or cancel an order for any reason, including limitations on quantities available for purchase, inaccuracies, or errors in product or pricing information.
              </p>
      
              <h2>4. Intellectual Property</h2>
              <p>
                The TioraS name, logo, and all related names, logos, product and service names, designs, and slogans are trademarks of TioraS or its affiliates or licensors. You must not use such marks without our prior written permission.
              </p>
      
              <h2>5. Limitation of Liability</h2>
              <p>
                In no event will TioraS, its affiliates or their licensors, service providers, employees, agents, officers, or directors be liable for damages of any kind, under any legal theory, arising out of or in connection with your use, or inability to use, the website, any websites linked to it, any content on the website, or such other websites.
              </p>
      
               <h2>6. Changes to Terms</h2>
              <p>
                We may revise and update these Terms of Service from time to time in our sole discretion. All changes are effective immediately when we post them. Your continued use of the website following the posting of revised Terms of Service means that you accept and agree to the changes.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  