"use client"
import { useParams } from "next/navigation";

const JoinIdPage = () => {
  const { joinId } = useParams<{ joinId: string }>();
  return <div>JoinIdPage: {joinId}</div>;
};

export default JoinIdPage;
