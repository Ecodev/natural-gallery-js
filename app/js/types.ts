export interface ItemOptions {
    lightbox: boolean;
    selectable: boolean;
    activable: boolean;
    gap: number;
    round: number;
    showLabels: 'hover' | 'never' | 'always';
    zoomRotation: boolean;
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
    format: 'natural' | 'square';
    rowHeight: number;
    imagesPerRow?: number;
    rowsPerPage: number;
    minRowsAtStart: number;
    showCount: boolean;
    labelImages: string;
    infiniteScrollOffset: number;
    events: GalleryEvents;
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
