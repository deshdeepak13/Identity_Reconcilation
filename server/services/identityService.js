import { Op } from "sequelize";
import { Contact } from "../models/index.js";

export const identifyContact = async (email, phoneNumber) => {
  // Step 1: Find matching contacts
  const matchedContacts = await Contact.findAll({
    where: {
      [Op.or]: [
        email ? { email } : null,
        phoneNumber ? { phoneNumber } : null
      ].filter(Boolean)
    }
  });

  // Step 2: If none found → create new primary
  if (matchedContacts.length === 0) {
    const newContact = await Contact.create({
      email,
      phoneNumber,
      linkPrecedence: "primary"
    });

    return buildResponse(newContact.id);
  }

  // Step 3: Collect all primary IDs
  const primaryIds = new Set();

  matchedContacts.forEach((c) => {
    if (c.linkPrecedence === "primary") {
      primaryIds.add(c.id);
    } else {
      primaryIds.add(c.linkedId);
    }
  });

  // Step 4: Get full cluster
  const allContacts = await Contact.findAll({
    where: {
      [Op.or]: [
        { id: [...primaryIds] },
        { linkedId: [...primaryIds] }
      ]
    }
  });

  // Step 5: Find oldest primary
  const primaries = allContacts.filter(
    (c) => c.linkPrecedence === "primary"
  );

  primaries.sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  const oldestPrimary = primaries[0];

  // Step 6: Convert other primaries to secondary
  for (const primary of primaries) {
    if (primary.id !== oldestPrimary.id) {
      await primary.update({
        linkPrecedence: "secondary",
        linkedId: oldestPrimary.id
      });
    }
  }

  // Step 7: Refresh cluster
  const finalCluster = await Contact.findAll({
    where: {
      [Op.or]: [
        { id: oldestPrimary.id },
        { linkedId: oldestPrimary.id }
      ]
    }
  });

  const emails = new Set();
  const phoneNumbers = new Set();
  const secondaryContactIds = [];

  finalCluster.forEach((c) => {
    if (c.email) emails.add(c.email);
    if (c.phoneNumber) phoneNumbers.add(c.phoneNumber);
    if (c.linkPrecedence === "secondary") {
      secondaryContactIds.push(c.id);
    }
  });

  // Step 8: Create secondary if new info
  const emailExists = email && emails.has(email);
  const phoneExists = phoneNumber && phoneNumbers.has(phoneNumber);

  if ((email && !emailExists) || (phoneNumber && !phoneExists)) {
    const newSecondary = await Contact.create({
      email,
      phoneNumber,
      linkedId: oldestPrimary.id,
      linkPrecedence: "secondary"
    });

    if (email) emails.add(email);
    if (phoneNumber) phoneNumbers.add(phoneNumber);
    secondaryContactIds.push(newSecondary.id);
  }

  return {
    contact: {
      primaryContatctId: oldestPrimary.id,
      emails: [
        oldestPrimary.email,
        ...[...emails].filter((e) => e !== oldestPrimary.email)
      ].filter(Boolean),
      phoneNumbers: [
        oldestPrimary.phoneNumber,
        ...[...phoneNumbers].filter(
          (p) => p !== oldestPrimary.phoneNumber
        )
      ].filter(Boolean),
      secondaryContactIds
    }
  };
};

const buildResponse = async (primaryId) => {
  const cluster = await Contact.findAll({
    where: {
      [Op.or]: [
        { id: primaryId },
        { linkedId: primaryId }
      ]
    }
  });

  const primary = cluster.find(
    (c) => c.linkPrecedence === "primary"
  );

  return {
    contact: {
      primaryContatctId: primary.id,
      emails: cluster.map((c) => c.email).filter(Boolean),
      phoneNumbers: cluster
        .map((c) => c.phoneNumber)
        .filter(Boolean),
      secondaryContactIds: cluster
        .filter((c) => c.linkPrecedence === "secondary")
        .map((c) => c.id)
    }
  };
};