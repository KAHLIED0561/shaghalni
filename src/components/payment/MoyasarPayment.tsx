"use client";

import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { ReactNode, useState } from "react";
import { toast } from "sonner";



import "./moyasar.css";
import { BASE_URL } from "@/constant";


declare global {
  interface Window {
    Moyasar: any;
  }
}

interface IProps {
  title: string;
  className: string;
  content?: ReactNode;
  amount: number;
  financialTransferId?: number | string;
}

const MoyasarPayment = ({ title, className, content, amount, financialTransferId }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const url = `${process.env.NODE_ENV === "production" ? BASE_URL : "http://localhost:3000"}`;

  const handlePayment = () => {
    const script = document.createElement("script");
    script.src = "https://cdn.moyasar.com/mpf/1.14.0/moyasar.js";
    script.async = true;

    script.onload = () => {
      if (window.Moyasar) {
        window.Moyasar.init({
          element: ".mysr-form",
          amount,
          currency: "SAR",
          description: `${financialTransferId}`,
          publishable_api_key: "pk_test_6afQHenM7vL3XDeUWYEVUi7gaou5R3KwFuhTiHWY",
          methods: ["creditcard"],
          callback_url: `${url}/payment?financialTransferId=${financialTransferId}`,
          metadata: {
            financialTransferId,
          },
          on_completed: () => {
            console.log("success payment");
          },
          on_error: (error: any) => {
            console.error("Payment error:", error);
            toast.error("حدث خطأ أثناء معالجة الدفع، الرجاء المحاولة مرة أخرى", { duration: 5000 });
          },
        });
      }
    };

    document.body.appendChild(script);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className={className} onClick={handlePayment}>
            {content ? content : title}
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl text-center font-semibold">{title}</DialogTitle>
          </DialogHeader>

          <div className="mysr-form"></div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MoyasarPayment;