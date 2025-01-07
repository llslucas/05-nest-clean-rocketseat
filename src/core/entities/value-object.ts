export class ValueObject<Props> {
  protected _props: Props;

  protected constructor(public props: Props) {
    this._props = props;
  }

  public equals(entity: ValueObject<unknown>) {
    if (entity === null || entity === undefined) {
      return false;
    }

    if (entity.props === undefined) {
      return false;
    }

    return JSON.stringify(this._props) === JSON.stringify(entity._props);
  }
}
