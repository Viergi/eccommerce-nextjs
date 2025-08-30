// import * as React from "react";
// import { cn } from "@/lib/utils";
// import Image from "next/image";

// function Card({ className, ...props }: React.ComponentProps<"div">) {
//   return (
//     <div
//       data-slot="card"
//       className={cn(
//         "bg-white text-black flex flex-col rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow",
//         className
//       )}
//       {...props}
//     />
//   );
// }

// function CardImage({
//   src,
//   alt = "Product Image",
//   className,
// }: {
//   src: string;
//   alt?: string;
//   className?: string;
// }) {
//   return (
//     <div className={cn("aspect-square bg-gray-100", className)}>
//       <Image
//         width={100}
//         height={100}
//         unoptimized={true}
//         src={src}
//         alt={alt}
//         className="w-full h-full object-cover"
//         loading="lazy"
//       />
//     </div>
//   );
// }

// function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
//   return (
//     <div
//       data-slot="card-header"
//       className={cn("p-4 flex flex-col gap-1", className)}
//       {...props}
//     />
//   );
// }

// function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
//   return (
//     <h3
//       data-slot="card-title"
//       className={cn("text-sm font-medium line-clamp-2", className)}
//       {...props}
//     />
//   );
// }

// function CardPrice({
//   className,
//   children,
// }: {
//   className?: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <div className={cn("text-primary font-bold text-base", className)}>
//       {children}
//     </div>
//   );
// }

// function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
//   return (
//     <div
//       data-slot="card-description"
//       className={cn("text-xs text-gray-500", className)}
//       {...props}
//     />
//   );
// }

// function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
//   return (
//     <div
//       data-slot="card-footer"
//       className={cn("p-4 flex justify-between items-center", className)}
//       {...props}
//     />
//   );
// }

// function CardRating({ value }: { value: number }) {
//   return (
//     <div className="text-xs text-yellow-500 flex items-center gap-1">
//       <span>⭐</span>
//       <span>{value.toFixed(1)}</span>
//     </div>
//   );
// }

// function CardAction({ className, ...props }: React.ComponentProps<"div">) {
//   return (
//     <div
//       data-slot="card-action"
//       className={cn(
//         "text-sm text-blue-500 font-medium hover:underline cursor-pointer",
//         className
//       )}
//       {...props}
//     />
//   );
// }

// export {
//   Card,
//   CardImage,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardPrice,
//   CardRating,
//   CardFooter,
//   CardAction,
// };

import * as React from "react";

import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
