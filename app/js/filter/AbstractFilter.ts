module Natural.Gallery {

    export abstract class AbstractFilter {

        /**
         * If null, means no filter active
         * If empty, means filter active, but no results
         * If not empty, means filter active, and there are wanted items
         * @type {null}
         * @private
         */
        protected _collection: Item[] = null;

        public constructor(protected header: Header) {
        }

        abstract render(): HTMLElement;

        abstract filter(value?: string): void;

        public isActive(): boolean {
            return !_.isNull(this.collection);
        }

        get collection(): Item[] {
            return this._collection;
        }

        set collection(value: Item[]) {
            this._collection = value;
        }

    }

}
