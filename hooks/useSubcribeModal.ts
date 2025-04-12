import { create } from "zustand";

interface SubscribeModalStore {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}
const useSubscribeModal = create<SubscribeModalStore>((set) => ({
  isOpen: false,
  onClose: () => set({ isOpen: false }),
  onOpen: () => set({ isOpen: true }),
}));

export default useSubscribeModal;
