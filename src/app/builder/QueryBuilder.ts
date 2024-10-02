import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    if (this?.query?.searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields?.map(
          (field) =>
            ({
              [field]: { $regex: this?.query?.searchTerm, $options: 'i' }, // partial match er jonno regex
            }) as FilterQuery<T>,
        ),
      });
    }

    return this;
  }

  filter() {
    const queryObj = { ...this.query };
    const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];

    excludeFields.forEach((el) => delete queryObj[el]);
    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);

    return this;
  }

  sort() {
    const sort = this?.query?.sort || '-createdAt';
    this.modelQuery = this.modelQuery.sort(sort as string);
    return this;
  }
}

export default QueryBuilder;