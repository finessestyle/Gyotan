import { useEffect, useState } from 'react'
import { View, Text, Image, StyleSheet, Alert } from 'react-native'
import axios from 'axios'
import { openWeatherApiKey } from '../config'

interface Props {
  lat: number
  lon: number
}

interface WeatherData {
  daily: Array<{
    dt: number
    temp: {
      max: number
      min: number
    }
    weather: Array<{
      icon: string
    }>
    wind_speed: number
    wind_deg: number
  }>
}

const Weather: React.FC<Props> = ({ lat, lon }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null)

  useEffect(() => {
    const fetchWeather = async (): Promise<void> => {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,alerts&units=metric&appid=${openWeatherApiKey}`
      try {
        const response = await axios.get<WeatherData>(weatherUrl)
        setWeather(response.data)
      } catch (error) {
        console.log(error)
        Alert.alert('天気予報の取得に失敗しました')
      }
    }
    void fetchWeather()
  }, [lat, lon, openWeatherApiKey])

  const getWindDirection = (windDeg: number): string => {
    if (windDeg >= 11.25 && windDeg < 33.75) return '北北東風'
    if (windDeg >= 33.75 && windDeg < 56.25) return '北東風'
    if (windDeg >= 56.25 && windDeg < 78.75) return '東北東風'
    if (windDeg >= 78.75 && windDeg < 101.25) return '東風'
    if (windDeg >= 101.25 && windDeg < 123.75) return '東南東風'
    if (windDeg >= 123.75 && windDeg < 146.25) return '南東風'
    if (windDeg >= 146.25 && windDeg < 168.75) return '南南東風'
    if (windDeg >= 168.75 && windDeg < 191.25) return '南風'
    if (windDeg >= 191.25 && windDeg < 213.75) return '南南西風'
    if (windDeg >= 213.75 && windDeg < 236.25) return '南西風'
    if (windDeg >= 236.25 && windDeg < 258.75) return '西南西風'
    if (windDeg >= 258.75 && windDeg < 281.25) return '西風'
    if (windDeg >= 281.25 && windDeg < 303.75) return '西北西風'
    if (windDeg >= 303.75 && windDeg < 326.25) return '北西風'
    if (windDeg >= 326.25 && windDeg < 348.75) return '北北西風'
    return '北風'
  }

  const renderWeather = (weatherData: WeatherData, index: number): JSX.Element => {
    const date = new Date(weatherData.daily[index].dt * 1000)
    date.setHours(date.getHours() + 9)
    const month = date.getMonth() + 1
    const day = `${month}/${date.getDate()} (${['日', '月', '火', '水', '木', '金', '土'][date.getDay()]})`
    const icon = weatherData.daily[index].weather[0].icon
    const windSpeed = Math.floor(weatherData.daily[index].wind_speed * 10) / 10
    const windDirection = getWindDirection(weatherData.daily[index].wind_deg)

    return (
      <View key={index} style={styles.weatherReport}>
        <Text style={styles.date}>{day}</Text>
        <Image source={{ uri: `https://openweathermap.org/img/w/${icon}.png` }} style={styles.icon} />
        <Text style={styles.wind}>{windDirection}</Text>
        <Text style={styles.wind}>{windSpeed}m</Text>
        <Text style={styles.tempMax}>最高：{Math.round(weatherData.daily[index].temp.max)}℃</Text>
        <Text style={styles.tempMin}>最低：{Math.floor(weatherData.daily[index].temp.min)}℃</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {weather !== null
        ? (
        <View style={styles.horizontalContainer}>
          {renderWeather(weather, 0)}
          {renderWeather(weather, 1)}
          {renderWeather(weather, 2)}
        </View>)
        : (
        <Text>天気予報を取得中...</Text>)
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  horizontalContainer: {
    flexDirection: 'row', // 横並びに配置
    justifyContent: 'center'
  },
  weatherReport: {
    alignItems: 'center',
    marginHorizontal: 16
  },
  date: {
    fontSize: 16,
    marginBottom: 5
  },
  icon: {
    width: 50,
    height: 50
  },
  wind: {
    fontSize: 14
  },
  tempMax: {
    fontSize: 16,
    color: 'red'
  },
  tempMin: {
    fontSize: 16,
    color: 'blue'
  }
})

export default Weather
