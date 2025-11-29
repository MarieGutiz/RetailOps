import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

const UserAvatar = ({avatar, username,gray}: {avatar: string, username: string, gray?: boolean}) => {
  const initials = username ? username.slice(0, 2).toUpperCase() : "??";

    return (
        <Avatar className={`h-8 w-8 rounded-lg ${gray ? "grayscale" : ""}`}>
        <AvatarImage src={avatar} alt={username} />
        <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
        </Avatar>
    );
}

export default UserAvatar