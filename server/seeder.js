import User from "./user.model.js";

export const SeederService = async () => {
  const users = [
    {
      firstName: "Alice",
      lastName: "Smith",
      email: "alice.smith@example.com",
      password: "securePass1",
    },
    {
      firstName: "Bob",
      lastName: "Johnson",
      email: "bob.johnson@example.com",
      password: "securePass2",
    },
    {
      firstName: "Carol",
      lastName: "Williams",
      email: "carol.williams@example.com",
      password: "securePass3",
    },
    {
      firstName: "David",
      lastName: "Brown",
      email: "david.brown@example.com",
      password: "securePass4",
    },
    {
      firstName: "Emma",
      lastName: "Jones",
      email: "emma.jones@example.com",
      password: "securePass5",
    },
  ];

  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    try {
      const exist = await User.findOne({ email: user.email });
      if (exist) continue;
      const newUser = new User({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
      });
      await newUser.save();
      console.log(`Created user: ${user.firstName} ${user.lastName}`);
    } catch (error) {
      console.error(`Failed to create user ${user.email}:`, error.message);
    }
  }
};
