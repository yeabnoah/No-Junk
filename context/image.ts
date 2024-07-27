import { create } from "zustand";

interface ImageState {
  image: string | null;
  setImage: (newImage: string | null) => void;
}

const useImageStore = create<ImageState>((set) => ({
  image: null,
  setImage: (newImage) => set({ image: newImage }),
}));

export default useImageStore;
