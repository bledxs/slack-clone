import { Loader } from "lucide-react";

import { MessageList } from "@/components/message-list";
import { useGetMember } from "@/features/members/api/use-get-member";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { useMemberId } from "@/hooks/use-member-id";
import { usePanel } from "@/hooks/use-panel";

import { Id } from "../../../../../../convex/_generated/dataModel";
import { ChatInput } from "./chat-input";
import { Header } from "./header";

type Props = {
  id: Id<"conversations">;
};
export const Conversation = ({ id }: Props) => {
  const memberId = useMemberId();

  const { onOpenProfile } = usePanel();

  const { data: member, isLoading: memberLoading } = useGetMember({
    id: memberId,
  });

  const { results, status, loadMore } = useGetMessages({
    conversationId: id,
  });

  if (memberLoading || status === "LoadingFirstPage") {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <Loader className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        memberName={member?.user.name}
        memberImage={member?.user.image}
        onClick={() => onOpenProfile(memberId)}
      />
      <MessageList
        data={results}
        canLoadMore={status === "CanLoadMore"}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        variant="conversation"
        memberImage={member?.user.image}
        memberName={member?.user.name}
      />
      <ChatInput
        placeholder={`Message ${member?.user.name}`}
        conversationId={id}
      />
    </div>
  );
};
