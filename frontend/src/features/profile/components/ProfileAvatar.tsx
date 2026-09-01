import { cn } from "@/shared/utils";

interface ProfileAvatarProps {
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-10 w-10 text-sm",
  md: "h-16 w-16 text-lg",
  lg: "h-24 w-24 text-2xl",
} as const;

function getInitials(firstName?: string | null, lastName?: string | null): string {
  const first = firstName?.charAt(0)?.toUpperCase() ?? "";
  const last = lastName?.charAt(0)?.toUpperCase() ?? "";
  return `${first}${last}` || "?";
}

function getBackgroundColor(name: string): string {
  const colors = [
    "bg-emerald-500",
    "bg-violet-500",
    "bg-sky-500",
    "bg-amber-500",
    "bg-rose-500",
    "bg-fuchsia-500",
    "bg-teal-500",
    "bg-indigo-500",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function ProfileAvatar({
  firstName,
  lastName,
  avatarUrl,
  size = "md",
  className,
}: ProfileAvatarProps) {
  const initials = getInitials(firstName, lastName);
  const bgColor = getBackgroundColor(initials);

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={`${firstName ?? ""} ${lastName ?? ""}`.trim() || "User avatar"}
        className={cn(
          "rounded-full object-cover",
          sizeClasses[size],
          className,
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full font-semibold text-white",
        bgColor,
        sizeClasses[size],
        className,
      )}
    >
      {initials}
    </div>
  );
}
