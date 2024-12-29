"use client";

import { ReceiptIcon, WalletIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "sonner";



import { cn } from "@/lib/utils";



import { Button } from "@/components/ui/button";



import { usePostData } from "@/hooks/useFetch";



import errorImg from "@/assets/images/payment-error.png";
import successImg from "@/assets/images/payment-success.png";


const PaymentForm = ({
  moyasarId,
  financialTransferId,
  amount,
  status,
}: {
  moyasarId: string;
  financialTransferId: string;
  amount: string;
  status: string;
}) => {
  const { mutateAsync } = usePostData({ endpoint: "/payment/callback" });

  let id;
  toast.dismiss(id);

  const postData = async () => {
    try {
      const res = await mutateAsync({
        financialTransferId: Number(financialTransferId),
        moyasarId,
      });

      if (res.status === "fail") {
        const concatenateErrors = Object.values(res.message).join("\n");
        id = toast.error(concatenateErrors, { duration: 5000 });
      } else if (res.status === "success") {
        id = toast.success("تم التحويل بنجاح،", {
          description: "سنقوم بالرد عليك في أقرب وقت ممكن",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Error during payment processing:", error);
      toast.error("حدث خطأ أثناء معالجة الدفع، الرجاء المحاولة مرة أخرى", { duration: 5000 });
    }
  };

  useEffect(() => {
    postData();
  }, [financialTransferId, moyasarId]);

  return (
    <div className="max-w-[500px] w-full mx-auto rounded-xl bg-white p-6">
      <div className="flex items-center justify-center py-8">
        <Image
          src={status === "paid" ? successImg : errorImg}
          alt="Success"
          width={200}
          height={200}
          className="w-40 h-40 object-contain"
        />
      </div>

      <div className="text-center mb-6">
        <h1 className={cn("text-2xl font-bold", status === "paid" ? "text-primaryClr" : "text-destructive")}>
          {status === "paid" ? "Success" : "Error"}
        </h1>
        <p className="text-lg text-muted-foreground">
          {status === "paid"
            ? "Your payment has been successfully processed."
            : "Something went wrong while processing your payment."}
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-start gap-2">
          <div className="bg-muted h-11 w-11 rounded-md flex items-center justify-center">
            <ReceiptIcon className="size-6 text-muted-foreground" />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Payment ID</p>
            <p className="text-xs text-muted-foreground">#{financialTransferId}</p>
          </div>
        </div>

        <div className="flex items-center justify-start gap-2">
          <div className="bg-muted h-11 w-11 rounded-md flex items-center justify-center">
            <WalletIcon className="size-6 text-muted-foreground" />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Your Total</p>
            <p className="text-xs text-muted-foreground">{amount} SAR</p>
          </div>
        </div>
      </div>

      <Link href="/" className="w-full">
        <Button className="w-full rounded-md">Back to Home</Button>
      </Link>
    </div>
  );
};

export default PaymentForm;