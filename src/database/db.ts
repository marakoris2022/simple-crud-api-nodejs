type UserProps = {
  id: number;
  username: string;
  age: number;
  hobbies: string[];
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
    this._data.push(data);
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
