import { DesignForm } from './_components/design-form';

export const metadata = {
  title: 'AI Design Studio | TioraS',
  description: 'Create your own custom apparel designs with AI.',
};

export default function DesignStudioPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <DesignForm />
    </div>
  );
}