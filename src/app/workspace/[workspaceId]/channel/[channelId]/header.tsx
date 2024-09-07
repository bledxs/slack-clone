import { Button } from "@/components/ui/button";
import { FaChevronDown } from "react-icons/fa";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRemoveChannel } from "@/features/channels/api/use-remove-channel";
import { useUpdateChannel } from "@/features/channels/api/use-update-channel";
import { useChannelId } from "@/hooks/use-channel-id";
import { useConfirm } from "@/hooks/use-confirm";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { DialogClose } from "@radix-ui/react-dialog";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useCurrentMember } from "@/features/members/api/use-current-member";

type HeaderProps = {
  title: string;
};

export const Header = ({ title }: HeaderProps) => {
  const router = useRouter();
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();
  const { data: member } = useCurrentMember({ workspaceId });

  const [ConfirmDialog, confirm] = useConfirm(
    "Delete this channel?",
    "You are about to delete this channel. This action cannot be undone."
  );

  const [name, setName] = useState(title);
  const [editOpen, setEditOpen] = useState(false);

  const { mutate: updateChannel, isPending: isChannelUpdating } =
    useUpdateChannel();

  const { mutate: removeChannel, isPending: isChannelRemoving } =
    useRemoveChannel();

  const handleOpen = (value: boolean) => {
    if (member?.role !== "admin") return;

    setEditOpen(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setName(value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateChannel(
      { name, channelId },
      {
        onSuccess: () => {
          toast.success("Channel updated");
          setEditOpen(false);
        },
        onError: () => {
          toast.error("Failed to update channel");
        },
      }
    );
  };

  const handleRemove = async () => {
    const ok = await confirm();

    if (!ok) return;

    removeChannel(
      { channelId },
      {
        onSuccess() {
          toast.success("Channel removed");
          router.push(`/workspace/${workspaceId}`);
        },
        onError() {
          toast.error("Failed to remove channel");
        },
      }
    );
  };

  return (
    <>
      <ConfirmDialog />
      <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="text-lg font-semibold px-2 overflow-hidden w-auto"
              size="sm"
            >
              <span className="truncate"># {title}</span>
              <FaChevronDown className="size-2.5 ml-2" />
            </Button>
          </DialogTrigger>
          <DialogContent className="p-0 bg-gray-50 overflow-hidden">
            <DialogHeader className="p-4 border-b bg-white">
              <DialogTitle># {title}</DialogTitle>
            </DialogHeader>
            <div className="px-4 pb-4 flex flex-col gap-y-2">
              <Dialog open={editOpen} onOpenChange={handleOpen}>
                <DialogTrigger asChild>
                  <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">Channel name</p>
                      {member?.role === "admin" && (
                        <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                          Edit
                        </p>
                      )}
                    </div>
                    <p className="text-sm"># {title}</p>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Rename this channel </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      disabled={isChannelUpdating}
                      value={name}
                      onChange={handleChange}
                      required
                      autoFocus
                      min={3}
                      max={80}
                      placeholder="e.g. marketing"
                    />
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline" disabled={isChannelUpdating}>
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button disabled={isChannelUpdating}>Save</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              {member?.role === "admin" && (
                <button
                  className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50 text-rose-600"
                  onClick={handleRemove}
                  disabled={isChannelRemoving}
                >
                  <TrashIcon className="size-4" />
                  <p className="text-sm font-semibold">Delete channel</p>
                </button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};
