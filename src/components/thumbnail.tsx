import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

interface ThumbnailProps {
  url?: string | null;
}

const Thumbnail = ({ url }: ThumbnailProps) => {
  if (!url) return;

  return (
    <Dialog>
      <DialogTrigger>
        <div className="relative overflow-hidden max-w-[360px] border rounded-lg my2 cursor-zoom-in">
          <Image
            src={url}
            alt="Message image"
            className="rounded-md object-cover size-full"
            width={360}
            height={360}
          />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[800px] border-none bg-transparent p-0 shadow-none">
        <Image
          src={url}
          alt="Message image"
          className="rounded-md object-cover size-full"
          width={800}
          height={800}
        />
      </DialogContent>
    </Dialog>
  );
};

export default Thumbnail;
