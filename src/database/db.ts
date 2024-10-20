import { v4 as uuidv4 } from "uuid";

type UserProps = {
  username: string;
  age: number;
  hobbies: string[];
  id?: number;
};

type DataStoreProps = {
  _data: UserProps[];
  addToStore: (data: UserProps) => UserProps;
  getUsers: () => UserProps[];
  getUserById: (id: number) => null | UserProps;
};

export const DATA_STORE: DataStoreProps = {
  _data: [],
  addToStore: function (data: UserProps) {
    this._data.push({
      ...data,
      id: uuidv4(),
    });
    return data;
  },
  getUsers: function () {
    return this._data as UserProps[];
  },
  getUserById: function (id: number) {
    const user = this._data.find((user: UserProps) => user.id === id);
    return user ? (user as UserProps) : null;
  },
};
