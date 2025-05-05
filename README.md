# PermiShout: Twitter/X Clone with Access Control Using Permit.io

PermiShout uses [Permit.io](https://www.permit.io/) to manage fine-grained access control to recreate some core functionalities of Twitter/X along with its authentication and authorization capabilities.

## Setting Up

### Prerequisites
- A Node.js environment - to run the application.
- A docker environment - to run the decision point container locally.
- A clerk.com account - to authenticate the users.
- A permit.io account - to manage all the permissions and authorize the users.

### Cloning

Clone the project into the desired folder
```bash
git clone https://github.com/AnsellMaximilian/permishout.git

cd permishout

npm install
```

### Setup Environment
```bash
cp .example.env .env.local
```
Then replace the placeholders with your own keys

#### Clerk
From the clerk.com dashboard, go to API Keys, choose Next.js example, and copy the `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` values to the `.env.local` file.
#### Permit.io


### Permit.io
In the Permit.io dashboard, go to Connect, and copy the token variable to the `PERMIT_SDK_KEY` value in the `.env.local` file.

### Starting a PDP container
```bash
docker run -it \
    -e PDP_API_KEY=<PERMIT_SDK_KEY> \
    -p 7766:7000 \
    -p 8081:8081 \
    permitio/pdp-v2:latest
```

### Setup Clerk Users and Permit.io Components

I've set up a script to seed some clerk users as well ass all the needed configurations for Permit.io, like resources, roles, etc.

From the root folder, run:
```bash
npm run setupPermit
```

After it completes, Permit.io will be setup for you with all the necessary components and you'll have two users:
1. Admin
  - username: admin
  - password: 2025DEVChallenge
  - special access:
    - `delete` any `shout`
    - `reply` to any `shout` where it's set to "everyone"
    - `reply` to any `shout` when it's set to "verified users only"
2. Regular User
  - username: newuser
  - password: 2025DEVChallenge
  - access:
    - `delete` own `shout`
    - `reply` to own `shout`
    - `reply` to any `shout` where it's set to "everyone"
    - `reply` to any `shout` IF the `shout` is set to "people you mention" and the user is mentioned
    - `reply` to any `shout` where the `profile` of that particular `shout` is following the user

### Run the App

```bash
npm run dev
```

Then go to `http://localhost:3000`

