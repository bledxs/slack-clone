import { XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Id } from "../../../../convex/_generated/dataModel";

interface ThreadProps {
  messageId: Id<"messages">;
  onClose: () => void;
}

export const Thread = ({ messageId, onClose }: ThreadProps) => {

    
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between h-[49px] border-b px-4">
        <p className="text-lg font-bold">Thread</p>
        <Button onClick={onClose} variant="ghost" size="iconSm">
          <XIcon className="size-5 stroke-[1.5]" />
        </Button>
      </div>
    </div>
  );
};
