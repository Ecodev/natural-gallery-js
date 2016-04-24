module Natural.Gallery {

    export abstract class AbstractFilter {

        protected _collection: Item[];

        public constructor(protected header: Header) {
        }

        abstract render(): JQuery;

        abstract filter(): Item[];

        public isFiltered(): boolean {
            return _.isNull(this.collection);
        }

        get collection(): Item[] {
            return this._collection;
        }

        set collection(value: Item[]) {
            this._collection = value;
        }

    }

}
