/* eslint-disable */
const { Permit } = require("permitio");
require("dotenv").config({ path: ".env.local" });

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
    },
  });

  console.log("Creating Resource: topic");
  await permit.api.createResource({
    key: "topic",
    name: "Topic",
    actions: {
      // view, delete, create, update
      view: {},
      delete: {},
      create: {},
      update: {},
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
      follower: {
        name: "Follower",
        permissions: ["view"],
      },
      followee: {
        name: "Followee",
        permissions: ["view"],
      },
    },
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
    "Granting shout:replier from profile:follower if profile is parent of shout"
  );
  await permit.api.resourceRoles.update("shout", "replier", {
    granted_to: {
      users_with_role: [
        {
          linked_by_relation: "parent",
          on_resource: "profile",
          role: "follower",
        },
        {
          linked_by_relation: "parent",
          on_resource: "profile",
          role: "followee",
        },
      ],
    },
  });
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

  console.log("🎉 PermiShout setup complete");
})();
