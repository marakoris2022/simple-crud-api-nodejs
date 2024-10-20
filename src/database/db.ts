import { v4 as uuid4 } from "uuid";

type UserProps = {
  username: string;
  age: number;
  hobbies: string[];
  id?: string;
};

type DataStoreProps = {
  _data: UserProps[];
  addToStore: (data: UserProps) => UserProps;
  getUsers: () => UserProps[];
  getUserById: (id: string) => null | UserProps;
};

export const DATA_STORE: DataStoreProps = {
  _data: [],
  addToStore: function (data: UserProps) {
    this._data.push({
      ...data,
      id: uuid4(),
    });
    return data;
  },
  getUsers: function () {
    return this._data as UserProps[];
  },
  getUserById: function (id: string) {
    const user = (this._data as UserProps[]).find((user) => user.id === id);
    return user ? user : null;
  },
};
