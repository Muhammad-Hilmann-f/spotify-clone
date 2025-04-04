// File: useOnPlay.ts
import { Song } from "@/types";
import usePlayer from "./usePlayer";
import useAuthModal from "./useAuthModal";
import { useUser } from "./useUser";

const useOnPlay = (songs: Song[]) => {
  const player = usePlayer();
  const authModal = useAuthModal();
  const { user } = useUser();

  const onPlay = (id: string) => {
    if (!user) {
      return authModal.onOpen();
    }

    if (!songs || !Array.isArray(songs)) {
      console.error("Songs is not an array or undefined:", songs);
      return;
    }

    player.setId(id);

    try {
      player.setIds(songs.map((song) => song.id));
    } catch (error) {
      console.error("Error setting song IDs:", error);
    }
  };

  return onPlay;
};

export default useOnPlay;
