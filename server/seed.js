import dotenv from "dotenv";
import { sequelize, Contact } from "./models/index.js";

dotenv.config();

const seed = async () => {
  try {
    console.log("Connecting to database...");
    await sequelize.authenticate();
    console.log("Database connected.");

    await Contact.destroy({
      where: {},
      truncate: true,
      restartIdentity: true
    });

    console.log("Old data cleared.");

    /*
      CLUSTER 1
      Simple primary + multiple secondaries
    */
    const c1 = await Contact.create({
      phoneNumber: "100001",
      email: "cluster1_primary@mail.com",
      linkPrecedence: "primary"
    });

    await Contact.bulkCreate([
      {
        phoneNumber: "100001",
        email: "cluster1_secondary1@mail.com",
        linkedId: c1.id,
        linkPrecedence: "secondary"
      },
      {
        phoneNumber: "100001",
        email: "cluster1_secondary2@mail.com",
        linkedId: c1.id,
        linkPrecedence: "secondary"
      }
    ]);

    /*
      CLUSTER 2
      Email-only primary
    */
    const c2 = await Contact.create({
      phoneNumber: null,
      email: "email_only_primary@mail.com",
      linkPrecedence: "primary"
    });

    await Contact.create({
      phoneNumber: null,
      email: "email_only_secondary@mail.com",
      linkedId: c2.id,
      linkPrecedence: "secondary"
    });

    /*
      CLUSTER 3
      Phone-only primary
    */
    const c3 = await Contact.create({
      phoneNumber: "200001",
      email: null,
      linkPrecedence: "primary"
    });

    await Contact.create({
      phoneNumber: "200001",
      email: "phone_only_secondary@mail.com",
      linkedId: c3.id,
      linkPrecedence: "secondary"
    });

    /*
      CLUSTER 4
      Deep Nested Dependencies
      A -> B -> C -> D
    */
    const deepPrimary = await Contact.create({
      phoneNumber: "300001",
      email: "deep_primary@mail.com",
      linkPrecedence: "primary"
    });

    const deep2 = await Contact.create({
      phoneNumber: "300001",
      email: "deep_level_2@mail.com",
      linkedId: deepPrimary.id,
      linkPrecedence: "secondary"
    });

    const deep3 = await Contact.create({
      phoneNumber: "300001",
      email: "deep_level_3@mail.com",
      linkedId: deep2.id,
      linkPrecedence: "secondary"
    });

    await Contact.create({
      phoneNumber: "300001",
      email: "deep_level_4@mail.com",
      linkedId: deep3.id,
      linkPrecedence: "secondary"
    });

    /*
      CLUSTER 5
      Two primaries that should merge later
    */
    const merge1 = await Contact.create({
      phoneNumber: "400001",
      email: "merge_primary_1@mail.com",
      linkPrecedence: "primary"
    });

    const merge2 = await Contact.create({
      phoneNumber: "400002",
      email: "merge_primary_2@mail.com",
      linkPrecedence: "primary"
    });

    // Secondary linking to first primary
    await Contact.create({
      phoneNumber: "400001",
      email: "merge_secondary@mail.com",
      linkedId: merge1.id,
      linkPrecedence: "secondary"
    });

    /*
      CLUSTER 6
      Complex transitive linking
      P1 (primary)
      P2 (primary)
      S1 linked to P1
      S2 linked to P2
      Later request linking P1 & P2 should merge
    */
    const t1 = await Contact.create({
      phoneNumber: "500001",
      email: "trans_primary_1@mail.com",
      linkPrecedence: "primary"
    });

    const t2 = await Contact.create({
      phoneNumber: "500002",
      email: "trans_primary_2@mail.com",
      linkPrecedence: "primary"
    });

    await Contact.bulkCreate([
      {
        phoneNumber: "500001",
        email: "trans_secondary_1@mail.com",
        linkedId: t1.id,
        linkPrecedence: "secondary"
      },
      {
        phoneNumber: "500002",
        email: "trans_secondary_2@mail.com",
        linkedId: t2.id,
        linkPrecedence: "secondary"
      }
    ]);

    /*
      CLUSTER 7
      Duplicate email across different phones
    */
    const dup1 = await Contact.create({
      phoneNumber: "600001",
      email: "duplicate@mail.com",
      linkPrecedence: "primary"
    });

    await Contact.create({
      phoneNumber: "600002",
      email: "duplicate@mail.com",
      linkedId: dup1.id,
      linkPrecedence: "secondary"
    });

    /*
      Additional Independent Primaries
    */
    const independentEntries = [];

    for (let i = 1; i <= 10; i++) {
      independentEntries.push({
        phoneNumber: `70000${i}`,
        email: `independent_${i}@mail.com`,
        linkPrecedence: "primary"
      });
    }

    await Contact.bulkCreate(independentEntries);

    console.log("30+ robust dummy records inserted successfully.");
    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seed();