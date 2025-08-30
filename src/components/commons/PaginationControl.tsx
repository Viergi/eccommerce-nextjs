import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function PaginationControl({
  totalPage,
  currentPage,
  basePath,
}: {
  totalPage: number;
  currentPage: number;
  basePath: string;
}) {
  return (
    // <Pagination>
    //   <PaginationContent>
    //     <PaginationItem>
    //       <PaginationPrevious href={`products?page=${currentPage - 1}`} />
    //     </PaginationItem>
    //     {currentPage != 1 && currentPage != 2 && (
    //       <PaginationItem>
    //         <PaginationEllipsis />
    //       </PaginationItem>
    //     )}
    //     {currentPage != 1 && (
    //       <PaginationItem>
    //         <PaginationLink href={`/products?page=${currentPage + 1}`}>
    //           {currentPage != 1 ? currentPage - 1 : currentPage}
    //         </PaginationLink>
    //       </PaginationItem>
    //     )}
    //     <PaginationItem>
    //       <PaginationLink
    //         className="text-white bg-black/90"
    //         href={`admin/products?page?${currentPage}`}
    //         isActive={true}
    //       >
    //         {currentPage}
    //       </PaginationLink>
    //     </PaginationItem>
    //     {currentPage != totalPage && (
    //       <PaginationItem>
    //         <PaginationLink href={`admin/products?page=${currentPage + 1}`}>
    //           {currentPage == totalPage ? currentPage : currentPage + 1}
    //         </PaginationLink>
    //       </PaginationItem>
    //     )}
    //     {currentPage != totalPage - 1 && currentPage != totalPage && (
    //       <PaginationItem>
    //         <PaginationEllipsis />
    //       </PaginationItem>
    //     )}
    //     <PaginationItem>
    //       <PaginationNext href={`products?page=${currentPage + 1}`} />
    //     </PaginationItem>
    //   </PaginationContent>
    // </Pagination>
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            disabled={currentPage == 1}
            href={`${basePath}?page=${currentPage - 1}`}
            isActive={currentPage > 1}
          />
        </PaginationItem>
        {currentPage > 2 && (
          <PaginationItem>
            <PaginationLink href={`${basePath}?page=1`}>1</PaginationLink>
          </PaginationItem>
        )}

        {/* Ellipsis di kiri */}
        {currentPage > 3 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationLink href={`${basePath}?page=${currentPage - 1}`}>
              {currentPage - 1}
            </PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationLink
            className="text-white bg-black/90 "
            href={`${basePath}?page=${currentPage}`}
            isActive={true}
          >
            {currentPage}
          </PaginationLink>
        </PaginationItem>

        {currentPage < totalPage && (
          <PaginationItem>
            <PaginationLink href={`${basePath}?page=${currentPage + 1}`}>
              {currentPage + 1}
            </PaginationLink>
          </PaginationItem>
        )}

        {currentPage < totalPage - 2 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {currentPage < totalPage - 1 && (
          <PaginationItem>
            <PaginationLink href={`${basePath}?page=${totalPage}`}>
              {totalPage}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Tombol "Berikutnya" */}
        <PaginationItem>
          <PaginationNext
            disabled={currentPage == totalPage}
            href={`${basePath}?page=${currentPage + 1}`}
            isActive={currentPage < totalPage}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
