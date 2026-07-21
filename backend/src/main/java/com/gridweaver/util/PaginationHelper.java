package com.gridweaver.util;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

/**
 * Helper utility for constructing {@link Pageable} objects from HTTP query parameters.
 *
 * <p>Enforces safe limits on page size to prevent clients from requesting
 * unbounded result sets.
 *
 * @author GridWeaver Team
 */
public final class PaginationHelper {

    private PaginationHelper() {
        // Utility class — no instantiation
    }

    /**
     * Builds a {@link Pageable} with validated size and sort parameters.
     *
     * @param page     zero-based page index
     * @param size     requested page size (clamped to {@link Constants#MAX_PAGE_SIZE})
     * @param sortBy   field name to sort by
     * @param sortDir  sort direction ({@code "ASC"} or {@code "DESC"})
     * @return the constructed {@link Pageable}
     */
    public static Pageable of(int page, int size, String sortBy, String sortDir) {
        int safeSize = Math.min(Math.max(size, 1), Constants.MAX_PAGE_SIZE);
        Sort.Direction direction = Sort.Direction.fromOptionalString(sortDir)
            .orElse(Sort.Direction.DESC);
        return PageRequest.of(Math.max(page, 0), safeSize, Sort.by(direction, sortBy));
    }

    /**
     * Builds a default {@link Pageable} with default page size and descending createdAt sort.
     *
     * @return the default pageable
     */
    public static Pageable defaultPageable() {
        return of(0, Constants.DEFAULT_PAGE_SIZE, "createdAt", "DESC");
    }
}
