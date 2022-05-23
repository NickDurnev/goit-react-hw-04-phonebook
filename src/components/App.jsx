import { useState, useEffect, useRef } from 'react';
import useLocalStorage from 'hooks/useLocalStorage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from 'styled-components';
import ContactForm from './ContactForm';
import ContactList from './ContactList';
import Filter from './Filter';
import AgreementModal from './AgreementModal';
import DropList from './DropList';
import { Container, StyledToastContainer } from './App.styled';
import { light, dark, blue } from '../themes';
import Button from './Button';

export function App() {
  const timeout = useRef(parseInt(light.animationDuration));
  let deleteContactID = useRef(null);

  const [filter, setFilter] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [contacts, setContacts] = useLocalStorage('contacts', []);
  const [theme, setTheme] = useLocalStorage('theme', light);

  const addContact = value => {
    const names = contacts.map(contact => contact.name.toLowerCase());
    if (names.includes(value.name.toLowerCase())) {
      toast.error(`${value.name} is already in contacts`);
      return;
    }
    setContacts(prevContacts => [...prevContacts, value]);
  };

  const filterContacts = () => {
    const normalizedFilter = filter.toLowerCase();
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizedFilter)
    );
  };

  const checkAgreement = answear => {
    document.querySelector('#modal-1').classList.add('hidden');
    if (answear) {
      deleteContact(deleteContactID.current);
    }
    setTimeout(() => {
      setModalOpen(false);
    }, timeout.current);
  };

  const openModalAgreement = id => {
    deleteContactID.current = id;
    setModalOpen(true);
  };

  const changeTheme = value => {
    setTheme(value);
    document.querySelector('#sidebar-1').classList.add('hidden');
    setTimeout(() => {
      setSidebarOpen(false);
    }, timeout.current);
  };

  const deleteContact = id => {
    const remainingContacts = contacts.filter(contact => contact.id !== id);
    document.querySelector(`#${id}`).classList.add('hidden');
    setTimeout(() => {
      setContacts([...remainingContacts]);
    }, timeout.current * 2);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Button
          onClick={() => setSidebarOpen(true)}
          padding={'5px 32px'}
          position={'absolute'}
          positionY={'30px'}
          positionX={'30px'}
        >
          Choose theme
        </Button>
        {isSidebarOpen && (
          <DropList id={'sidebar-1'}>
            <Button
              onClick={() => {
                changeTheme(dark);
              }}
              padding="5px 10px"
            >
              Dark
            </Button>
            <Button
              onClick={() => {
                changeTheme(light);
              }}
              padding="5px 10px"
            >
              Light
            </Button>
            <Button
              onClick={() => {
                changeTheme(blue);
              }}
              padding="5px 10px"
            >
              Blue
            </Button>
          </DropList>
        )}
        <h1>Phonebook</h1>
        <ContactForm onSubmit={contact => addContact(contact)} />

        <h2>Contacts</h2>
        <Filter onChange={value => setFilter(value)} filter={filter} />
        {contacts.length > 0 && (
          <ContactList
            filterItems={filterContacts()}
            onClick={value => openModalAgreement(value)}
          />
        )}
        {isModalOpen && (
          <AgreementModal id={'modal-1'}>
            <p>Do you really want delete this contact?</p>
            <Button onClick={() => checkAgreement(false)} padding={'5px 15px'}>
              No
            </Button>
            <Button onClick={() => checkAgreement(true)} padding={'5px 15px'}>
              Yes
            </Button>
          </AgreementModal>
        )}
        <StyledToastContainer autoClose={3000} />
      </Container>
    </ThemeProvider>
  );
}
