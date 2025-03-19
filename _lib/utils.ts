// import { type ClassValue, clsx } from "clsx";
// import { twMerge } from "tailwind-merge/dist/lib/tw-merge";

export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs));
// }
