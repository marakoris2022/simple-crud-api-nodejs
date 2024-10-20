import { v4 as uuid4 } from "uuid";

export type UserProps = {
  username: string;
  age: number;
  hobbies: string[];
  id?: string;
};

type DataStoreProps = {
  _data: UserProps[];
  addUser: (data: UserProps) => UserProps;
  getUsers: () => UserProps[];
  getUserById: (id: string) => null | UserProps;
  updateUser: (id: string, data: UserProps) => null | UserProps;
  deleteUser: (id: string) => boolean; // Add deleteUser signature
};

export const DATA_STORE: DataStoreProps = {
  _data: [],
  addUser: function (data: UserProps) {
    const newUser = {
      ...data,
      id: uuid4(),
    };
    this._data.push(newUser);
    return newUser; // Return the new user with the generated id
  },
  getUsers: function () {
    return this._data as UserProps[];
  },
  getUserById: function (id: string) {
    const user = this._data.find((user) => user.id === id);
    return user ? user : null;
  },
  updateUser: function (id: string, data: UserProps) {
    const users = this._data;

    for (let i = 0; i < users.length; i++) {
      if (users[i].id === id) {
        users[i] = { ...users[i], ...data };
        return users[i];
      }
    }

    return null;
  },
  deleteUser: function (id: string) {
    const initialLength = this._data.length;
    this._data = this._data.filter((user) => user.id !== id);
    return this._data.length < initialLength; // Return true if a user was deleted
  },
};
