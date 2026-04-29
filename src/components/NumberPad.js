/**
 * NumberPad.js
 *
 * Teclado numérico para entrada de valor monetário.
 * Layout padrão de 3 colunas (1-9, placeholder, 0, backspace).
 *
 * @param {Function} onPress - Chamado com (item: string | 'BACKSPACE').
 *   - string '0'-'9': dígito pressionado
 *   - 'BACKSPACE': apagar último dígito
 */
import React from 'react';
import { Dimensions, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import Text from '../components/Text';

const SCREEN_WIDTH = Dimensions.get('window').width;
const KEY_SIZE = Math.floor((SCREEN_WIDTH - 64) / 3);

// Layout: 12 células — null = célula vazia (sem interação)
const BUTTONS = [
  '1', '2', '3',
  '4', '5', '6',
  '7', '8', '9',
  null, '0', 'BACKSPACE',
];

export default function NumberPad({ onPress }) {
  return (
    <KeyPad>
      {BUTTONS.map((item, index) => {
        if (item === null) {
          return <EmptyKey key={index} size={KEY_SIZE} />;
        }

        if (item === 'BACKSPACE') {
          return (
            <Key key={index} size={KEY_SIZE} onPress={() => onPress('BACKSPACE')} activeOpacity={0.6}>
              <MaterialIcons name="keyboard-backspace" size={28} color="#ffffff" />
            </Key>
          );
        }

        return (
          <Key key={index} size={KEY_SIZE} onPress={() => onPress(item)} activeOpacity={0.6}>
            <KeyLabel>{item}</KeyLabel>
          </Key>
        );
      })}
    </KeyPad>
  );
}

const KeyPad = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  padding: 0 32px;
  margin-bottom: 8px;
`;

const Key = styled(TouchableOpacity)`
  width: ${p => p.size}px;
  height: ${p => p.size * 0.7}px;
  align-items: center;
  justify-content: center;
`;

const EmptyKey = styled(View)`
  width: ${p => p.size}px;
  height: ${p => p.size * 0.7}px;
`;

const KeyLabel = styled.Text`
  color: #ffffff;
  font-size: 28px;
  font-weight: 300;
`;