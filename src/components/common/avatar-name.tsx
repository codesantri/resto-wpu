import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function AvatarName({
  url,
  name,
  role,
}: {
  url?: string;
  name?: string;
  role?: string;
}) {
  const fallbackInitial = name?.split(" ")[0]?.charAt(0)?.toUpperCase() ?? "U";
  const displayName = name || "Unknown";

  return (
    <div className="flex items-center gap-2 px-1 py-1.5">
      <Avatar className="h-8 w-8 rounded-full">
        <AvatarImage src={url} alt={displayName} />
        <AvatarFallback className="rounded-full">
          {fallbackInitial}
        </AvatarFallback>
      </Avatar>
      <div className="leading-tight">
        <h4 className="truncate font-medium">{displayName}</h4>
        {role && (
          <p className="text-muted-foreground truncate text-xs capitalize">
            {role}
          </p>
        )}
      </div>
    </div>
  );
}
