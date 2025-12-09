import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export const metadata = {
  title: 'FAQ | TioraS',
  description: 'Frequently asked questions about TioraS products and services.',
};

const faqs = [
    {
        question: "How does the AI design generation work?",
        answer: "Our AI Design Studio uses a powerful text-to-image model. You provide a descriptive text prompt, and the AI interprets it to create a unique visual design. You can then preview this design on different products like T-Shirts or Hoodies."
    },
    {
        question: "What is your shipping policy?",
        answer: "We offer free standard shipping on all orders within India. Orders are typically processed within 2-3 business days and delivered within 5-7 business days. You will receive a tracking number once your order is shipped."
    },
    {
        question: "Can I return a custom-designed item?",
        answer: "Because each custom-designed item is created specifically for you, we are unable to accept returns or exchanges unless the product is defective or damaged upon arrival. Please review your design carefully before ordering."
    },
    {
        question: "What materials are your clothes made from?",
        answer: "We are committed to quality. Our T-shirts are made from 100% premium pima cotton, and our hoodies use a soft, durable fleece-back jersey. Specific material information is available on each product page."
    },
    {
        question: "How do I track my order?",
        answer: "Once your order is shipped, you will receive an email with a tracking link. You can also view your order history and tracking information in your Customer Dashboard if you have an account."
    }
];

export default function FaqPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tighter md:text-5xl">
          Frequently Asked Questions
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Find answers to common questions about our products and services.
        </p>
      </header>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className='text-left font-bold text-lg'>{faq.question}</AccordionTrigger>
                <AccordionContent className='text-base text-muted-foreground'>
                    {faq.answer}
                </AccordionContent>
            </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
