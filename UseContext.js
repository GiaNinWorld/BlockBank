import React, { createContext, useState } from 'react';

const UserContext = createContext([{}, () => { }]);

const UserProvider = (props) => {
  const [state, setState] = useState({
    username: "",
    email: "",
    uid: "",
    password: "",
    cpf: "",
    nrConta: "",
    nacionalidade: "",
    sexo: "",
    endereco: "",
    saldo: 0,
    profilePhotoUrl: "default",
  });

  return <UserContext.Provider value={[state, setState]}>{props.children}</UserContext.Provider>
};


export { UserContext, UserProvider }
/* export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}; */
