import { BaseEntity } from './../../shared';

export class Handler implements BaseEntity {
    constructor(
        public id?: number,
        public seconds?: number,
    ) {
    }
}
