import { Component } from 'react';
import { nanoid } from 'nanoid';

import ContactForm from './Form/Form';
import FilterPhonebook from './FilterPhonebook/FilterPhonebook';
import ContactList from './ContactsList/ContactsList'

import css from './App.module.css';

class App extends Component {
  state = {
    contacts: [
    {id: 'id-1', name: 'Rosie Simpson', number: '459-12-56'},
    {id: 'id-2', name: 'Hermione Kline', number: '443-89-12'},
    {id: 'id-3', name: 'Eden Clements', number: '645-17-79'},
    {id: 'id-4', name: 'Annie Copeland', number: '227-91-26'},
  ],
    filter: '',
  };

  componentDidMount() {
    const contacts = JSON.parse(localStorage.getItem('my contacts'));
    if (contacts?.length) {
      // contacts && contacts.length
      this.setState({ contacts });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { contacts } = this.state;
    if (contacts !== prevState.contacts) {
      localStorage.setItem('my contacts', JSON.stringify(contacts));
    }
  }

  removeContact = id => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== id),
    }));
  };

  addFormSubmitContact = ({ name, number }) => {
    if (this.isDublicate(name)) {
      alert(`${name} is already in contacts.`);
      return false;
    }

    this.setState(prevState => {
      const { contacts } = prevState;

      const newContact = {
        id: nanoid(),
        name,
        number,
      };

      return { contacts: [newContact, ...contacts] };
    });

    return true;
  };

  isDublicate(name) {
    const normalizedName = name.toLowerCase();
    const { contacts } = this.state;

    const result = contacts.find(({ name }) => {
      return name.toLowerCase() === normalizedName;
    });

    return Boolean(result);
  }

  changeFilter = ({ target }) => {
    this.setState({ filter: target.value });
  };

  getfilterContacts() {
    const { filter, contacts } = this.state;
    if (!filter) {
      return contacts;
    }
    const normalizedContact = filter.toLowerCase();
    const result = contacts.filter(({ name, number }) => {
      return (
        name.toLowerCase().includes(normalizedContact) ||
        number.toLowerCase().includes(normalizedContact)
      );
    });
    return result;
  }

  render() {
    const contacts = this.getfilterContacts();
    const { addFormSubmitContact, changeFilter, removeContact } = this;

    return (
      <div className={css.conteinerPhonebook}>
        <h1>Phonebook</h1>
        <ContactForm onSubmit={addFormSubmitContact} />

        <h2>Contacts</h2>
        <FilterPhonebook onChange={changeFilter} />
        <ContactList contacts={contacts} onDeleteContact={removeContact} />
      </div>
    );
  }
}

export default App;

