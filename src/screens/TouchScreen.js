

/* import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import axios from 'axios';

const App = () => {
  const [terca, setTerca] = useState();
  const [segunda, setSegunda] = useState();
  const [sexta, setSexta] = useState();
  const [quinta, setQuinta] = useState();

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await axios.get('https://economia.awesomeapi.com.br/json/daily/USD-BRL/?start_date=20231003&end_date=20231003');
        const response02 = await axios.get('https://economia.awesomeapi.com.br/json/daily/USD-BRL/?start_date=20231002&end_date=20231002');
        const response01 = await axios.get('https://economia.awesomeapi.com.br/json/daily/USD-BRL/?start_date=20230929&end_date=20230929');
        const response28 = await axios.get('https://economia.awesomeapi.com.br/json/daily/USD-BRL/?start_date=20230928&end_date=20230928');

        setTerca(response.data[0]['bid'])
        setSegunda(response02.data[0]['bid'])
        setSexta(response01.data[0]['bid'])
        setQuinta(response28.data[0]['bid'])

        console.log(parseFloat(response.data[0]['bid']))
        console.log(parseFloat(response02.data[0]['bid']))
        console.log(parseFloat(response01.data[0]['bid']))
        console.log(parseFloat(response28.data[0]['bid']))

        
        
      } catch (error) {
        console.error('Erro ao obter a taxa de câmbio:', error);
      }
    };

    fetchExchangeRate();
  }, []);

  return (
    <View>
      <Text> 
        ${terca}
        ${segunda}
        ${sexta}
        ${quinta}
        ${quinta}
        ${quinta}
        ${quinta}
        
      </Text>
    </View>
  );
};

export default App;
 */