import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, BackHandler, Image } from 'react-native';

import * as Location from 'expo-location';
import CustomSelect from './CustomSelect';
import { checkPointInArea, getFormattedDateToday, getFormattedTimeNow, getTodayDayOfWeek } from './utils/functions';
import getTemperatureService from './services/getTemperatureService';
import postNewTime from './services/postNewTime';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    position: 'absolute',
    width: 250,
    height: 250,
    top: 40,
  },
  startButton: {
    bottom: 100,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ef5350',
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  startButtonText: {
    position: 'relative',
    color: '#fff',
    fontSize: 23,
  },
  subView: {
    position: 'absolute',
    bottom: 0,
    top: 350,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const countryStates = {
  question: 'Starea țării?',
  optionsArray: [
    {
      id: '0',
      value: 'Normală',
    },
    {
      id: '1',
      value: 'Alertă',
    },
    {
      id: '2',
      value: 'Urgență',
    },
  ],
};

const holidayStates = {
  question: 'Este vacanță?',
  optionsArray: [
    {
      id: '0',
      value: 'Nu',
    },
    {
      id: '1',
      value: 'Da',
    },
  ],
};

const routes = {
  route1CheckPointArea: [
    [46.783941, 23.644208],
    [46.784135, 23.645324],
    [46.784007, 23.645394],
    [46.783762, 23.644212],
  ],
  route2CheckPointArea: [
    [46.785970, 23.645819],
    [46.785973, 23.646099],
    [46.785256, 23.645950],
    [46.785271, 23.646144],
  ],
};

const initState = {
  data: getFormattedDateToday(),
  ora_plecare: '-',
  ora_sosire: '-',
  zi: getTodayDayOfWeek(),
  temperatura: '-',
  stare: '-',
  vacanta: '-',
  scurtatura: '-',
};

const App = () => {
  
  const [location, setLocation] = useState([0, 0]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [started, setStarted] = useState(null);
  const [intervalHandler, setIntervalHandler] = useState(null);
  const [view, setView] = useState('countryState');
  const [reachedCheckPoint, setReachedCheckPoint] = useState(false);

  const [newRecord, setNewRecord] = useState(initState);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
      }
    })();
  }, []);

  const checkReachedCheckPoint = (location) => {
    for (const checkPointArea in routes) {
      if (checkPointInArea(location, routes[checkPointArea])) {
        setReachedCheckPoint(true);
        
        setNewRecord(
          newRecord => {
            if (checkPointArea !== 'route1CheckPointArea') {
             return {
              ...newRecord,
              scurtatura: '1',
             };
            } 
          return {
            ...newRecord,
            scurtatura: '0',
          }
        });

      }
    }

  };

  useEffect(() => {
    const interval = setInterval(async () => {
      if (started === true && !errorMsg) {
        const position = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.BestForNavigation});
        const {
          coords: {
            latitude,
            longitude,
          },
        } = position;

        if (latitude !== location[0] && longitude !== location[1]) {
          setLocation([latitude, longitude]);
          !reachedCheckPoint && checkReachedCheckPoint(location);
        }

      } else {
        clearInterval(intervalHandler);
      } 
    }, 3000);
    setIntervalHandler(interval);
  }, [started])

  useEffect(() => {

    if (started === false && newRecord.ora_sosire !== '-') {
      ( async () => {
        const result = await postNewTime(newRecord);
        if (result) {
          if (result.success) {
            setNewRecord(initState);
            BackHandler.exitApp();
          }
        }
       }
      )()
    }

  }, [started])

  const StartButton = () => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={async () => {
        let temperature = '';
        if (!started) {
          temperature = await getTemperatureService();
        }
        
        setNewRecord(newRecord => ( 
          !started 
          ? {
            ...newRecord,
            ora_plecare: getFormattedTimeNow(),
            temperatura: temperature,
          } 
          : {
            ...newRecord,
            ora_sosire: getFormattedTimeNow(),
          }  
        ));

        setStarted(!started);
      }}
      style={styles.startButton}
    > 
      <Text style={styles.startButtonText}>
       { !started ? 'START' : 'STOP' }
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style='auto' />
      <Image style={styles.logo} source={require('./logo.png')} />
      <View style={styles.subView}>
        {
          view === 'countryState' ?
            <CustomSelect
              question={countryStates.question}
              options={countryStates.optionsArray}
              handleSelection={(selectedCountryState) => {
                setNewRecord(newRecord => ({
                  ...newRecord,
                  stare: selectedCountryState,
                }));
                setView('holidayState');
              }}
            />
          : view === 'holidayState' ?
          <CustomSelect
            question={holidayStates.question}
            options={holidayStates.optionsArray}
            handleSelection={(selectedHolidayState) => {
              setNewRecord(newRecord => ({
                ...newRecord,
                vacanta: selectedHolidayState,
              }));
              setView('start');
            }}
         />
          : view === 'start' ?
            <StartButton />
          : null
        }
      </View>
    </View>
  );
}

export default App;
