"use client";

import { Button } from "../ui/button";
import { CloudUploadIcon, PaperclipIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { socket } from "@/socket";

const UploadImgModal = ({ sessionId }: { sessionId?: number }) => {
  const t = useTranslations("chat");
  const [isOpen, setIsOpen] = useState(false);
  const [imgValue, setImgValue] = useState<string | null>(null);
  const [imgLink, setImgLink] = useState<string | null>(null);

  const changeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImgValue(reader.result as string);
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch(`https://api.shaghalni.sa/supabase/upload`, { method: "POST", body: formData });
        const result = await response.json();

        if (response.ok) {
          setImgLink(result.url);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleSend = () => {
    socket.emit("message", {
      sessionId,
      content: imgLink,
      type: "IMAGE",
    });

    setIsOpen(false);
    setImgValue(null);
    setImgLink(null);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="absolute end-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
      >
        <PaperclipIcon className="w-5 h-5 text-gray-500" />
      </button>

      <Dialog open={isOpen} modal onOpenChange={setIsOpen}>
        <DialogContent className="space-y-5 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-center text-4xl font-semibold">{t("title")}</DialogTitle>
          </DialogHeader>

          <div className="space-y-5">
            <label
              htmlFor="image"
              className="flex w-full aspect-video border-primaryClr border-2 rounded-2.5xl cursor-pointer overflow-hidden"
            >
              <Input
                type="file"
                id="image"
                multiple={false}
                accept="image/*"
                placeholder={t("select_photo")}
                className="hidden"
                onChange={changeHandler}
              />

              {imgValue ? (
                <img src={imgValue} alt="Uploaded" className="w-full h-full object-contain" />
              ) : (
                <>
                  <div className="w-full h-full flex items-center justify-center flex-col gap-4">
                    <CloudUploadIcon size={60} className="text-primaryClr" />

                    <span className="text-primaryClr font-semibold text-3xl">{t("select_photo")}</span>
                  </div>
                </>
              )}
            </label>

            <Button className="w-full py-5" type="button" onClick={handleSend} disabled={!imgLink}>
              {t("send")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UploadImgModal;
