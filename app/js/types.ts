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
    events: GalleryEvents;
    infiniteScrollOffset: number;
    photoSwipeOptions: PhotoSwipeOptions;
}

export interface PhotoSwipeOptions {
    getThumbBoundsFn?: (index?: number) => void;
    showHideOpacity?: boolean;
    showAnimationDuration?: number;
    hideAnimationDuration?: number;
    bgOpacity?: number;
    spacing?: number;
    allowPanToNext?: boolean;
    maxSpreadZoom?: number;
    getDoubleTapZoom?: (isMouseClick?: boolean, item?: any) => number;
    pinchToClose?: boolean;
    closeOnScroll?: boolean;
    closeOnVerticalDrag?: boolean;
    mouseUsed?: boolean;
    escKey?: boolean;
    arrowKeys?: boolean;
    history?: boolean;
    galleryUID?: number;
    galleryPIDs?: boolean;
    errorMsg?: string;
    preload?: [number, number];
    mainClass?: string;
    getNumItemsFn?: () => number;
    focus?: boolean;
    modal?: boolean;
    verticalDragRange?: number;
    mainScrollEndFriction?: number;
    panEndFriction?: number;
    isClickableElement?: (el) => boolean;
    scaleMode?: string;
}

export interface InnerPhotoSwipeOptions extends PhotoSwipeOptions {
    index: number;
    loop: boolean;
}

export interface NaturalGalleryOptions extends GalleryOptions {
    rowHeight: number;
}

export interface ResponsiveSquareGalleryOptions extends GalleryOptions {
    rowHeight: number;
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
