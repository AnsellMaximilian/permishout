/* eslint-disable */
const { Permit } = require("permitio");
require("dotenv").config({ path: ".env.local" });
const axios = require("axios");

const permit = new Permit({
  token: process.env.PERMIT_SDK_KEY,
  apiUrl: process.env.PERMIT_API_URL || "https://api.permit.io",
});

const cleanEnv = async () => {
  const resources = await permit.api.resources.list();
  console.log(`Found ${resources.length} resources`);
  for (const resource of resources) {
    const resourceRelations = await permit.api.resourceRelations.list({
      resourceKey: resource.key,
    });
    console.log(`Found ${resourceRelations.length} resource relations`);
    for (const rr of resourceRelations.data) {
      console.log(`Deleting relation: ${rr.key}`);
      await permit.api.resourceRelations.delete(resource.key, rr.key);
    }

    const resourceRoles = await permit.api.resourceRoles.list({
      resourceKey: resource.key,
    });
    console.log(`Found ${resourceRoles.length} resource roles`);
    for (const role of resourceRoles) {
      console.log(`Deleting role: ${role.key}`);
      await permit.api.resourceRoles.delete(resource.key, role.key);
    }

    console.log(`Deleting resource: ${resource.key}`);
    await permit.api.resources.delete(resource.key);
  }

  const roles = await permit.api.roles.list();
  for (const role of roles) {
    console.log(`Deleting global role: ${role.key}`);
    await permit.api.roles.delete(role.key);
  }

  const users = await permit.api.users.list();
  for (const user of users.data) {
    console.log(`Deleting user: ${user.key}`);
    await permit.api.users.delete(user.key);
  }
};

const createResources = async () => {
  console.log("Creating Resource: shout");
  await permit.api.createResource({
    key: "shout",
    name: "shout",
    actions: {
      read: {},
      create: {},
      delete: {},
      reply: {},
    },

    // Resource roles are used to define the permissions for each role on the resource
    roles: {
      shouter: {
        name: "Shouter",
        permissions: ["read", "create", "delete", "reply"],
      },
      replier: {
        name: "Replier",
        permissions: ["read", "reply"],
      },
      mentioned: {
        name: "Mentioned",
        permissions: ["read", "reply"],
      },
    },
  });

  // profile resource
  console.log("Creating Resource: profile");
  await permit.api.createResource({
    key: "profile",
    name: "Profile",
    actions: {
      view: {},
      create: {},
      update: {},
    },
    roles: {
      owner: {
        name: "Owner",
        permissions: ["view", "create", "update"],
      },
      followed: {
        name: "Followed",
        permissions: ["view"],
      },
      follower: {
        name: "Follower",
        permissions: ["view"],
      },
    },
  });

  await permit.api.createRole({
    key: "admin",
    name: "Admin",
    permissions: ["shout:delete", "shout:read"],
  });
};

const createResourceRelations = async () => {
  console.log("Creating relation: Profile -> Shout");

  console.log("Creating relation: Shout <- Profile");
  await permit.api.resourceRelations.create("shout", {
    key: "parent",
    name: "Parent",
    subject_resource: "profile",
  });
};

const createRoleDerivations = async () => {
  console.log(
    "Granting shout:replier from profile:followed if profile is parent of shout"
  );
  await permit.api.resourceRoles.update("shout", "replier", {
    granted_to: {
      users_with_role: [
        {
          linked_by_relation: "parent",
          on_resource: "profile",
          role: "followed",
        },
      ],
    },
  });
};

// CREATE USERS

const usersToCreate = [
  {
    username: "admin",
    email: "admin@example.com",
    password: "2025DEVChallenge",
    firstName: "Admin",
    lastName: "Man",
  },
  {
    username: "newuser",
    email: "newuser@example.com",
    password: "2025DEVChallenge",
    firstName: "New",
    lastName: "User",
  },
];

const axiosInstance = axios.create({
  baseURL: "https://api.clerk.com/v1",
  headers: {
    Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
});

const findUserByUsername = async (username) => {
  try {
    const { data } = await axiosInstance.get(`/users`, {
      params: { username },
    });

    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error(
      `❌ Error checking user '${username}':`,
      error.response?.data || error.message
    );
    return null;
  }
};

const createUser = async ({
  username,
  email,
  password,
  firstName,
  lastName,
}) => {
  try {
    console.log(`Creating user: ${username}, ${email}, ${password}`);
    const { data } = await axiosInstance.post("/users", {
      username,
      email_address: [email],
      password,
      first_name: firstName,
      last_name: lastName,
    });

    console.log(`✅ Created user '${username}' with ID: ${data.id}`);
    return data;
  } catch (error) {
    console.error(
      `❌ Failed to create user '${username}':`,
      error.response?.data || error.message
    );
    return null;
  }
};

const createUsers = async () => {
  const createdUsers = {};

  for (const user of usersToCreate) {
    console.log(`\n🔍 Checking user: ${user.username}`);
    const existing = await findUserByUsername(user.username);

    if (existing) {
      console.log(
        `⚠️ User '${user.username}' already exists. ID: ${existing.id}`
      );
      createdUsers[user.username] = existing;
    } else {
      const newUser = await createUser(user);
      if (newUser) {
        createdUsers[user.username] = newUser;
      }
    }
  }

  console.log("\n🎉 Final user summary:");
  for (const [username, user] of Object.entries(createdUsers)) {
    console.log(
      `- ${username}: ID=${user.id}, Email=${user.email_addresses?.[0]?.email_address}`
    );
  }

  for (const createdUserKey in createdUsers) {
    const createdUser = createdUsers[createdUserKey];
    console.log(
      `Syncing user ${createdUser.username} with id ${createdUser.id} and email ${createdUser.email_addresses[0].email_address}`
    );
    const { attributes } = await permit.api.syncUser({
      key: createdUser.id,
      first_name: createdUser.first_name,
      last_name: createdUser.last_name,
      email: createdUser.email_addresses[0].email_address,
      attributes: {
        username: createdUser.username,
        yearBorn: 1990,
        country: "United States-US",
      },
    });
    console.log(`Synced user ${attributes?.username}. Now creating profile`);

    await permit.api.roleAssignments.assign({
      user: createdUser.id,
      role: "owner",
      resource_instance: `profile:profile_${createdUser.id}`,
      tenant: "default",
    });

    console.log(`Created profile for use ${createdUser.username}`);

    if (createdUser.username === "admin") {
      await permit.api.roleAssignments.assign({
        user: createdUser.id,
        role: "admin",
        tenant: "default",
      });

      console.log(`Made user ${createdUser.username} an admin`);
    }
  }
};

(async () => {
  try {
    await cleanEnv();
    console.log("✅ cleanEnv completed");
  } catch (err) {
    console.error("❌ Error in cleanEnv:", err);
  }

  try {
    await createResources();
    console.log("✅ createResources completed");
  } catch (err) {
    console.error("❌ Error in createResources:", err);
  }

  try {
    await createResourceRelations();
    console.log("✅ createResourceRelations completed");
  } catch (err) {
    console.error("❌ Error in createResourceRelations:", err);
  }

  try {
    await createRoleDerivations();
    console.log("✅ createRoleDerivations completed");
  } catch (err) {
    console.error("❌ Error in createRoleDerivations:", err);
  }

  try {
    await createUsers();
    console.log("✅ Creating users completed");
  } catch (error) {
    console.error("❌ Error in creaing users:", error);
  }

  console.log("🎉 PermiShout setup complete");
})();
