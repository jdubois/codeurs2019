import { Moment } from 'moment';
import { ICategory } from 'app/shared/model/category.model';
import { IProduct } from 'app/shared/model/product.model';
import { CategoryStatus } from 'app/shared/model/enumerations/category-status.model';

export interface ICategory {
  id?: number;
  codeurs2019?: string;
  description?: string;
  sortOrder?: number;
  dateAdded?: Moment;
  dateModified?: Moment;
  status?: CategoryStatus;
  parent?: ICategory;
  products?: IProduct[];
}

export class Category implements ICategory {
  constructor(
    public id?: number,
    public codeurs2019?: string,
    public description?: string,
    public sortOrder?: number,
    public dateAdded?: Moment,
    public dateModified?: Moment,
    public status?: CategoryStatus,
    public parent?: ICategory,
    public products?: IProduct[]
  ) {}
}
