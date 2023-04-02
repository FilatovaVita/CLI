import { readFile, writeFile } from "node:fs/promises";
import { nanoid } from "nanoid";

const contactsPath = "./db/contacts.json";

export async function listContacts() {
  try {
    const data = await readFile(contactsPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
  }
}

export async function getContactById(contactId) {
  try {
    const res = await listContacts();
    const [result] = res.filter((contact) => contact.id === contactId);
    return result || null;
  } catch (err) {
    console.log(err);
  }
}

export async function removeContact(contactId) {
  const contacts = await listContacts();
  const idx = contacts.findIndex((contact) => contact.id === contactId);
  if (idx === -1) {
    return null;
  }

  const [removed] = contacts.splice(idx, 1);

  writeFile(contactsPath, JSON.stringify(contacts));

  return removed;
}

export async function addContact(name, email, phone) {
  try {
    const contacts = await listContacts();
    const newContact = { id: nanoid(), name, email, phone };
    if (
      contacts.some(
        (contact) => contact.name === name && contact.email === email
      )
    ) {
      return console.log(
        `The contact name: ${name} with email: ${email} already exist, add someone new please`
      );
    }

    contacts.push(newContact);
    writeFile(contactsPath, JSON.stringify(contacts));
    return newContact;
  } catch (error) {
    console.log(error);
  }
}
