import { Op } from "sequelize";
import { sequelize, Contact } from "../models/index.js";

export const identifyContact = async (email, phoneNumber) => {
  const transaction = await sequelize.transaction();

  try {
    // Find matching contacts
    const matches = await Contact.findAll({
      where: {
        [Op.or]: [
          email ? { email } : null,
          phoneNumber ? { phoneNumber } : null
        ].filter(Boolean)
      },
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    if (matches.length === 0) {
      const newContact = await Contact.create(
        {
          email,
          phoneNumber,
          linkPrecedence: "primary",
          linkedId: null
        },
        { transaction }
      );

      await transaction.commit();
      
      return {
        contact: {
          primaryContatctId: newContact.id,
          emails: newContact.email ? [newContact.email] : [],
          phoneNumbers: newContact.phoneNumber ? [newContact.phoneNumber] : [],
          secondaryContactIds: []
        }
      };
    }

    // DSU FIND with full path compression
    const findRoot = async (contact) => {
      let current = contact;
      const visited = [];

      while (current.linkedId !== null) {
        visited.push(current);
        current = await Contact.findByPk(current.linkedId, {
          transaction,
          lock: transaction.LOCK.UPDATE
        });
      }

      const root = current;

      // Path compression
      for (const node of visited) {
        if (node.linkedId !== root.id) {
          await node.update(
            { linkedId: root.id },
            { transaction }
          );
        }
      }

      return root;
    };

    // Resolve all ultimate roots
    const rootMap = new Map();

    for (const contact of matches) {
      const root = await findRoot(contact);
      rootMap.set(root.id, root);
    }

    const roots = [...rootMap.values()];

    // Select oldest root (union by oldest)
    let ultimateRoot = roots[0];

    for (const root of roots) {
      if (new Date(root.createdAt) < new Date(ultimateRoot.createdAt)) {
        ultimateRoot = root;
      }
    }

    // Union other roots into ultimate root
    for (const root of roots) {
      if (root.id !== ultimateRoot.id) {
        await Contact.update(
          {
            linkedId: ultimateRoot.id,
            linkPrecedence: "secondary"
          },
          {
            where: {
              [Op.or]: [
                { id: root.id },
                { linkedId: root.id }
              ]
            },
            transaction
          }
        );
      }
    }

    // Fetch entire flattened cluster
    const cluster = await Contact.findAll({
      where: {
        [Op.or]: [
          { id: ultimateRoot.id },
          { linkedId: ultimateRoot.id }
        ]
      },
      transaction
    });

    const emails = new Set();
    const phoneNumbers = new Set();
    const secondaryContactIds = [];

    cluster.forEach((c) => {
      if (c.email) emails.add(c.email);
      if (c.phoneNumber) phoneNumbers.add(c.phoneNumber);
      if (c.linkPrecedence === "secondary") {
        secondaryContactIds.push(c.id);
      }
    });

    // Create secondary if new info present
    const emailExists = email && emails.has(email);
    const phoneExists = phoneNumber && phoneNumbers.has(phoneNumber);

    if ((email && !emailExists) || (phoneNumber && !phoneExists)) {
      const newSecondary = await Contact.create(
        {
          email,
          phoneNumber,
          linkedId: ultimateRoot.id,
          linkPrecedence: "secondary"
        },
        { transaction }
      );

      if (email) emails.add(email);
      if (phoneNumber) phoneNumbers.add(phoneNumber);
      secondaryContactIds.push(newSecondary.id);
    }

    await transaction.commit();

    return {
      contact: {
        primaryContatctId: ultimateRoot.id,
        emails: [
          ultimateRoot.email,
          ...[...emails].filter((e) => e !== ultimateRoot.email)
        ].filter(Boolean),
        phoneNumbers: [
          ultimateRoot.phoneNumber,
          ...[...phoneNumbers].filter(
            (p) => p !== ultimateRoot.phoneNumber
          )
        ].filter(Boolean),
        secondaryContactIds
      }
    };

  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};