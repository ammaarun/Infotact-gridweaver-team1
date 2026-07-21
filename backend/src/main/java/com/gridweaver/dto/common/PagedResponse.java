package com.gridweaver.dto.common;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.domain.Page;

import java.util.List;

/**
 * Paginated response wrapper used for all list endpoints.
 *
 * <p>Wraps Spring Data's {@link Page} into a stable API contract
 * that does not expose Spring internals directly.
 *
 * @param <T>          the element type
 * @param content      the current page of elements
 * @param page         zero-based current page index
 * @param size         number of elements per page
 * @param totalElements total number of elements across all pages
 * @param totalPages   total number of pages
 * @param last         whether this is the last page
 * @param first        whether this is the first page
 * @param empty        whether the content list is empty
 */
public record PagedResponse<T>(

    List<T> content,
    int page,
    int size,

    @JsonProperty("total_elements")
    long totalElements,

    @JsonProperty("total_pages")
    int totalPages,

    boolean last,
    boolean first,
    boolean empty
) {

    /**
     * Creates a {@link PagedResponse} from a Spring Data {@link Page}.
     *
     * @param springPage the Spring page object
     * @param <T>        element type
     * @return the mapped paged response
     */
    public static <T> PagedResponse<T> of(Page<T> springPage) {
        return new PagedResponse<>(
            springPage.getContent(),
            springPage.getNumber(),
            springPage.getSize(),
            springPage.getTotalElements(),
            springPage.getTotalPages(),
            springPage.isLast(),
            springPage.isFirst(),
            springPage.isEmpty()
        );
    }
}
