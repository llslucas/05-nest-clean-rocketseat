import { UniqueEntityId } from "./unique-entity-id";

export class Entity<Props> {
  private readonly _id: UniqueEntityId;
  protected _props: Props;

  protected constructor(
    public props: Props,
    id?: UniqueEntityId
  ) {
    this._id = id ?? new UniqueEntityId();
    this._props = props;
  }

  get id() {
    return this._id;
  }

  public equals(entity: Entity<unknown>) {
    if (entity === this) {
      return true;
    }

    if (entity.id === this.id) {
      return true;
    }

    return false;
  }
}

