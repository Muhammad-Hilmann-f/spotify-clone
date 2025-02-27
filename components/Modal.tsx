import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ModalProps {
  isOpen: boolean;
  onChange: (open: boolean) => void;
  title: string;
  description: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onChange,
  title,
  description,
  children,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent className="text-white fixed top-1/2 left-1/2 max-h-full h-auto max-h-[85vh] w-full max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-neutral-900 p-6 border border-neutral-700 shadow-xl">
        <DialogTrigger
          className="absolute right-4 top-4 rounded-full p-1 text-white hover:bg-neutral-800"
          onClick={() => onChange(false)}
        ></DialogTrigger>
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-bold text-white">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm text-neutral-400 mt-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="text-neutral-200">{children}</div>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
