
import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  useColorScheme,
} from 'react-native';

function Display({ value, dark }: { value: string; dark: boolean }) {
  return (
    <View style={styles.display}>
      <Text
        style={[styles.result, { color: dark ? '#FFFFFF' : '#4A235A' }]}
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  );
}

function CalcButton({
  title,
  onPress,
  color,
  dark,
}: {
  title: string;
  onPress: () => void;
  color?: string;
  dark: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: color || (dark ? '#34243F' : '#F3E5F5'),
          opacity: pressed ? 0.6 : 1,
        },
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          { color: color ? '#FFFFFF' : dark ? '#FFFFFF' : '#6A1B9A' },
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

export default function Calculator() {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';

  const [input, setInput] = useState('0');
  const [firstValue, setFirstValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waiting, setWaiting] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  function buttonPress(value: string) {
    if (value === 'C') {
      setInput('0');
      setFirstValue(null);
      setOperator(null);
      setWaiting(false);
      return;
    }

    if (value === 'DEL') {
      setInput(input.length > 1 ? input.slice(0, -1) : '0');
      return;
    }

    if (['+', '-', '×', '÷'].includes(value)) {
      setFirstValue(Number(input));
      setOperator(value);
      setWaiting(true);
      return;
    }

    if (value === '=') {
      if (firstValue === null || operator === null) return;

      const secondValue = Number(input);
      let result = 0;

      if (operator === '+') result = firstValue + secondValue;
      if (operator === '-') result = firstValue - secondValue;
      if (operator === '×') result = firstValue * secondValue;
      if (operator === '÷') {
        if (secondValue === 0) {
          setInput('Error');
          setFirstValue(null);
          setOperator(null);
          setWaiting(true);
          return;
        }
        result = firstValue / secondValue;
      }

      const expression = `${firstValue} ${operator} ${secondValue} = ${result}`;
      setHistory((old) => [expression, ...old].slice(0, 5));
      setInput(String(Number(result.toFixed(8))));
      setFirstValue(null);
      setOperator(null);
      setWaiting(true);
      return;
    }

    if (value === '.') {
      if (waiting) {
        setInput('0.');
        setWaiting(false);
      } else if (!input.includes('.')) {
        setInput(input + '.');
      }
      return;
    }

    if (waiting || input === '0' || input === 'Error') {
      setInput(value);
      setWaiting(false);
    } else {
      setInput(input + value);
    }
  }

  const buttons = [
    'C', 'DEL', '÷', '×',
    '7', '8', '9', '-',
    '4', '5', '6', '+',
    '1', '2', '3', '=',
    '0', '.', 
  ];

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: dark ? '#1C1424' : '#FFF0F8' },
      ]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: dark ? '#E8B8FF' : '#A64AC9' }]}>
        My Calculator
      </Text>

      <Display value={input} dark={dark} />

      <View style={styles.grid}>
        {buttons.map((item) => (
          <CalcButton
            key={item}
            title={item}
            onPress={() => buttonPress(item)}
            dark={dark}
            color={
              item === '='
                ? '#A64AC9'
                : ['+', '-', '×', '÷'].includes(item)
                ? '#C77DFF'
                : item === 'C' || item === 'DEL'
                ? '#E75480'
                : undefined
            }
          />
        ))}
      </View>

      <Text style={[styles.historyTitle, { color: dark ? '#E8B8FF' : '#A64AC9' }]}>
        Calculation History
      </Text>

      {history.length === 0 ? (
        <Text style={{ color: dark ? '#CCCCCC' : '#777777' }}>
          No calculations yet ♡
        </Text>
      ) : (
        history.map((item, index) => (
          <Text
            key={index}
            style={[
              styles.historyItem,
              { color: dark ? '#FFFFFF' : '#4A235A' },
            ]}
          >
            {item}
          </Text>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
  },
  display: {
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 20,
    padding: 15,
  },
  result: {
    fontSize: 45,
    fontWeight: 'bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  button: {
    width: '22%',
    height: 70,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  historyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 10,
  },
  historyItem: {
    fontSize: 16,
    marginBottom: 8,
  },
});
