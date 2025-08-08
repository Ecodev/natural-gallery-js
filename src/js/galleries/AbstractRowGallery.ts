import {AbstractGallery, ModelAttributes} from './AbstractGallery';

export abstract class AbstractRowGallery<Model extends ModelAttributes> extends AbstractGallery<Model> {
    public override init(): void {
        super.init();

        this.bodyElementRef!.style.rowGap = this.options.gap + 'px';
    }

    protected onScroll(): void {
        this.addRows(1);
    }

    protected onPageAdd(): void {
        this.addRows(this.getRowsPerPage());
    }

    /**
     * Add given number of rows to DOM
     * @param rows
     */
    protected addRows(rows: number): void {
        const nbVisibleImages = this.domCollection.length;
        // console.log('nbVisibleImages', nbVisibleImages);

        // Next row to add (first invisible row)
        const nextRow = this.domCollection.length ? this.domCollection[nbVisibleImages - 1].row + 1 : 0;
        const lastWantedRow = nextRow + rows - 1;

        // Compute size only for elements we're going to add
        const bufferedItems = this.collection.slice(nbVisibleImages);
        this.organizeItems(bufferedItems, nextRow, lastWantedRow);
        // console.log('bufferedItems', nextRow, lastWantedRow);
        const itemsToAdd = bufferedItems.filter(i => i.row <= lastWantedRow);
        // console.log('itemsToAdd', itemsToAdd.length);
        itemsToAdd.forEach(i => this.addItemToDOM(i));

        this.flushBufferedItems();
        this.updateNextButtonVisibility();
    }

    protected endResize(): void {
        super.endResize();

        if (!this.domCollection.length) {
            return;
        }

        // Compute with new width. Rows indexes may have changed
        this.organizeItems(this.domCollection);
    }
}
