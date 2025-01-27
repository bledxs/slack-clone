import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface ConversationHeroProps {
  name?: string;
  image?: string;
}
const ConversationHero = ({
  image,
  name = "Member",
}: ConversationHeroProps) => {
  const avatarFallback = name.charAt(0).toUpperCase();

  return (
    <div className="mt-[88px] mx-5 mb-4">
      <div className="flex items-center gap-x-1 mb-2">
        <Avatar className="size-14 mr-2">
          <AvatarImage src={image} alt={name} />
          <AvatarFallback className="text-xl">{avatarFallback}</AvatarFallback>
        </Avatar>
      </div>
      <p className="text-2xl font-bold "> {name}</p>
      <p className="font-normal text-slate-800 mb4">
        This conversation is just between you and <strong>{name}</strong>{" "}
        member.
      </p>
    </div>
  );
};

export default ConversationHero;
