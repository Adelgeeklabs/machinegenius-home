import { ComponentType } from "react";
import styles from "./withPagination.module.css";

interface PaginationState {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalCount: number;
}

interface WithPaginationProps {
  paginationState: PaginationState;
  setPaginationState: (
    state: PaginationState | ((prev: PaginationState) => PaginationState),
  ) => void;
}

interface WithPaginationInjectedProps {
  PaginationControls: React.ComponentType<WithPaginationProps>;
}

export const withPagination = <P extends WithPaginationInjectedProps>(
  WrappedComponent: ComponentType<P>,
) => {
  return (props: Omit<P, keyof WithPaginationInjectedProps>) => {
    const PaginationControls = ({
      paginationState,
      setPaginationState,
    }: WithPaginationProps) => {
      const renderPageNumbers = () => {
        const { totalPages, currentPage } = paginationState;
        const pageNumbers = [];

        // Always show first page
        if (totalPages > 0) {
          pageNumbers.push(1);
        }

        // Calculate range of pages to show around current page
        let rangeStart = currentPage - 1;
        let rangeEnd = currentPage + 1;

        // Adjust range if at edges
        if (rangeStart <= 2) {
          rangeStart = 2;
          rangeEnd = Math.min(4, totalPages - 1);
        } else if (rangeEnd >= totalPages - 1) {
          rangeEnd = totalPages - 1;
          rangeStart = Math.max(totalPages - 3, 2);
        }

        // Add ellipsis and range numbers
        if (rangeStart > 2) {
          pageNumbers.push("...");
        }

        for (let i = rangeStart; i <= rangeEnd; i++) {
          pageNumbers.push(i);
        }

        if (rangeEnd < totalPages - 1) {
          pageNumbers.push("...");
        }

        // Always show last page if there's more than one page
        if (totalPages > 1) {
          pageNumbers.push(totalPages);
        }

        return pageNumbers.map((pageNum, idx) => {
          if (pageNum === "...") {
            return (
              <span key={`ellipsis-${idx}`} className={styles.ellipsis}>
                ...
              </span>
            );
          }
          return (
            <button
              key={pageNum}
              onClick={() => {
                setPaginationState((prev) => ({
                  ...prev,
                  currentPage: pageNum as number,
                }));
              }}
              className={`${styles.pageNumber} ${
                paginationState.currentPage === pageNum ? styles.active : ""
              }`}
            >
              {pageNum}
            </button>
          );
        });
      };

      return (
        <div className={styles.pagination}>
          <div className={styles.paginationControls}>
            <button
              onClick={() => {
                if (paginationState.currentPage > 1) {
                  setPaginationState((prev) => ({
                    ...prev,
                    currentPage: prev.currentPage - 1,
                  }));
                }
              }}
              disabled={paginationState.currentPage === 1}
              className={styles.paginationButton}
            >
              Previous
            </button>

            <div className={styles.pageNumbers}>{renderPageNumbers()}</div>

            <button
              onClick={() => {
                if (paginationState.currentPage < paginationState.totalPages) {
                  setPaginationState((prev) => ({
                    ...prev,
                    currentPage: prev.currentPage + 1,
                  }));
                }
              }}
              disabled={
                paginationState.currentPage === paginationState.totalPages
              }
              className={styles.paginationButton}
            >
              Next
            </button>
          </div>
        </div>
      );
    };

    return (
      <WrappedComponent
        {...(props as P)}
        PaginationControls={PaginationControls}
      />
    );
  };
};
