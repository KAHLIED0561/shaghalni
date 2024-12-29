import { redirect } from "next/navigation";

import PaymentForm from "./PaymentForm";

const PaymentSuccess = async ({
  searchParams,
}: {
  searchParams: {
    amount: string;
    status: string;
    id: string;
    financialTransferId: string;
  };
}) => {
  const { id: moyasarId, amount, status, financialTransferId } = await searchParams;

  if (!financialTransferId || !moyasarId) {
    redirect("/");
  }

  return (
    <main className="pt-32 pb-12 bg-accent" dir="ltr">
      <div className="container">
        <PaymentForm moyasarId={moyasarId} financialTransferId={financialTransferId} amount={amount} status={status} />
      </div>
    </main>
  );
};

export default PaymentSuccess;
