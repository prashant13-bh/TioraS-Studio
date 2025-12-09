import { DesignForm } from './_components/design-form';

export const metadata = {
  title: 'AI Design Studio | TioraS',
  description: 'Create your own custom apparel designs with AI.',
};

export default function DesignStudioPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tighter md:text-5xl">
          AI Design Studio
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Bring your ideas to life. Describe your vision and let our AI create it.
        </p>
      </header>
      <DesignForm />
    </div>
  );
}
