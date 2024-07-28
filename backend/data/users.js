import bcrypt from "bcryptjs";

const user = [
  {
    name: "Admin",
    email: "admin@email.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: true,
    isSeller: false,
  },
  {
    name: "John Doe",
    email: "john@email.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: false,
    isSeller: false,
  },
  {
    name: "Jane Doe",
    email: "jane@email.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: false,
    isSeller: false,
  },
  {
    name: "jujutsu",
    email: "jujutsu@email.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: false,
    isSeller: true,
  },
];

export default user;
