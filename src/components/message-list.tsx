import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import { Loader } from "lucide-react";
import { useState } from "react";

import { useCurrentMember } from "@/features/members/api/use-current-member";
import { GetMessagesReturnType } from "@/features/messages/api/use-get-messages";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { Id } from "../../convex/_generated/dataModel";
import ChannelHero from "./channel-hero";
import { Message } from "./message";
import ConversationHero from "./conversation-hero";

const TIME_THRESHOLD = 5;

interface MessageListProps {
  memberName?: string;
  memberImage?: string;
  channelName?: string;
  channelCreationTime?: number;
  variant?: "channel" | "thread" | "conversation";
  data: GetMessagesReturnType;
  loadMore: () => void;
  isLoadingMore: boolean;
  canLoadMore: boolean;
}

const formatDateLabel = (dateStr: string) => {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "EEEE, MMMM d");
};

export const MessageList = ({
  canLoadMore,
  data,
  isLoadingMore,
  loadMore,
  channelCreationTime,
  channelName,
  memberImage,
  memberName,
  variant,
}: MessageListProps) => {
  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);

  const workspaceId = useWorkspaceId();
  const { data: currentMember } = useCurrentMember({ workspaceId });

  const groupedMessages = data?.reduce(
    (groups, message) => {
      const date = new Date(message._creationTime);
      const dateKey = format(date, "yyyy-MM-dd");
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].unshift(message);
      return groups;
    },
    {} as Record<string, typeof data>
  );

  return (
    <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
      {Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
        <div key={dateKey}>
          <div className="text-center my-2 relative">
            <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
            <span className="relative inline-block bg-white px-4 py-1 rounded-full text-sm border border-gray-300 shadow-sm">
              {formatDateLabel(dateKey)}
            </span>
          </div>
          <div>
            {messages.map((message, index) => {
              const prevMessage = messages[index - 1];
              const isCompact =
                prevMessage &&
                prevMessage.user._id === message.user._id &&
                differenceInMinutes(
                  new Date(message._creationTime),
                  new Date(prevMessage._creationTime)
                ) < TIME_THRESHOLD;

              return (
                <Message
                  key={message._id}
                  id={message._id}
                  memberId={message.memberId}
                  authorImage={message.user.image}
                  authorName={message.user.name}
                  isAuthor={currentMember?._id === message.memberId}
                  reactions={message.reactions}
                  body={message.body}
                  image={message.image}
                  updatedAt={message.updatedAt}
                  createdAt={message._creationTime}
                  isEditing={editingId === message._id}
                  setEditingId={setEditingId}
                  isCompact={isCompact}
                  hideThreadButton={variant === "thread"}
                  threadCount={message.threadCount}
                  threadImage={message.threadImage}
                  threadTimestamp={message.threadTimestamp}
                />
              );
            })}
          </div>
        </div>
      ))}
      <div
        className="h-1"
        ref={(el) => {
          if (!el || !canLoadMore) return;
          const observer = new IntersectionObserver(
            (entries) => {
              if (entries[0].isIntersecting) {
                loadMore();
              }
            },
            { threshold: 1 }
          );
          observer.observe(el);
          return () => observer.disconnect();
        }}
      />

      {isLoadingMore && (
        <div className="text-center my-2 relative">
          <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
          <span className="relative inline-block bg-white px-4 py-1 rounded-full text-sm border border-gray-300 shadow-sm">
            <Loader className="size-4 animate-spin" />
          </span>
        </div>
      )}
      {variant === "channel" && channelName && channelCreationTime && (
        <ChannelHero name={channelName} creationTime={channelCreationTime} />
      )}
      {variant === "conversation"  && (
        <ConversationHero name={memberName} image={memberImage} />
      )}
    </div>
  );
};
