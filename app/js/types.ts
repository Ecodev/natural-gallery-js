export interface ItemOptions {
    lightbox: boolean;
    selectable: boolean;
    activable: boolean;
    gap: number;
    showLabels: 'hover' | 'never' | 'always';
}

export interface ModelAttributes {
    thumbnailSrc: string;
    thumbnailWidth: number;
    thumbnailHeight: number;
    enlargedSrc: string;
    enlargedWidth: number;
    enlargedHeight: number;
    title: string;
    link: string;
    linkTarget: string;
}

export interface GalleryOptions extends ItemOptions {
    rowsPerPage: number;
    minRowsAtStart: number;
    showCount: boolean;
    events: GalleryEvents;
    infiniteScrollOffset: number;
}

export interface ResponsiveGalleryOptions extends GalleryOptions {
    rowHeight: number;
}

export interface NaturalGalleryOptions extends ResponsiveGalleryOptions {
}

export interface ResponsiveSquareGalleryOptions extends ResponsiveGalleryOptions {
}

export interface SquareGalleryOptions extends GalleryOptions {
    itemsPerRow: number;
}

export interface MasonryGalleryOptions extends GalleryOptions {
    columnWidth: number;
}

export interface ColumnOptions {
    width: number;
    gap: number;
}

export interface PaginationEvent {
    offset: number;
    limit: number;
}

export interface GalleryEvents {
    select: (models: ModelAttributes[]) => void;
    pagination: (event: PaginationEvent) => void;
    activate: (model: ModelAttributes, event: Event) => void;
}

export interface PhotoswipeItem {
    src: string;
    w: number;
    h: number;
    title: string;
}

export interface ItemTitle {
    title: string;
    link: string;
    linkTarget: '_blank' | '_self' | '_parent' | '_top';
}
