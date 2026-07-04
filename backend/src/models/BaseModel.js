export class BaseModel {
  /**
   * @param {string} tableName 
   * @param {Function} queryFn 
   */
  constructor(tableName, queryFn) {
    this.table = tableName;
    this.query = queryFn;
    this.created_at = new Date().toISOString();
    this.updated_at = new Date().toISOString();
  }

  validate() {
    return true;
  }

  toJSON() {
    return {
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }

  static fromDB(row) {
    return new this(row);
  }
}
