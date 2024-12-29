import { ContactForm } from "./_components/contact-form";
import { PageHeader } from "./_components/header";

export default async function Page() {
  return (
    <>
      <PageHeader />
      <main className="container py-12">
        <ContactForm />
      </main>
    </>
  );
}
