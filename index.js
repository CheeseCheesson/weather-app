const LINK = 'http://api.weatherstack.com/current?access_key=8a628355b977e5d6c67a3163bc6276c5'


const root = document.querySelector('#root')
const popup = document.querySelector('#popup')
const textInput = document.querySelector('#text-input')
const form = document.querySelector('#form')
const close = document.querySelector('#close')


let store = {
    city: 'Krasnodar',
    feelslike: 0,
    temperature: 0,
    observationTime: "00:00 AM",
    isDay: "yes",
    description: '',
    weatherIcons: './img/figure1.svg',
    properties: {
        cloudcover: {},
        humidity: {},
        pressure: {},
        uvIndex: {},
        visibility: {},
        windSpeed: {},
    }

}

const renderProperty = (props) => {
    return Object.values(props).map((data) => {
        const { title, value, icon } = data
        return `
        <div class="property">
        <div class="property-icon">
          <img src="./img/icons/${icon}" alt="">
        </div>
        <div class="property-info">
          <div class="property-info__value">${value}</div>
          <div class="property-info__description">${title}</div>
        </div>
      </div>
        `
    }).join('')
    // Object.entries(props).map(([key, value]) => {
    //     console.log('key', key, 'value', value)
    // })
}

const markup = (store) => {
    const { city,
        temperature,
        observationTime,
        description,
        weatherIcons,
        isDay,
        properties
    } = store

    const containerClass = isDay ? 'is-day' : ''
    return `
    <div class="container ${containerClass}">
    <div class="top">
      <div class="city">
        <div class="city-subtitle">Wather today in </div>
        <div class="city-title" id="city">
          <span>${city}</span>
        </div>
      </div>
      <div class="city-info">
        <div class="top-left">
          <img src="${weatherIcons}" alt="" class="icon">
          <div class="description">${description}</div>
        </div>
        <div class="top-right">
          <div class="city-info__subtitle">as of ${observationTime}</div>
          <div class="city-info__title">${temperature}°</div>
        </div>
      </div>
    </div>
    <div id="properties">${renderProperty(properties)}</div>
  </div>
    `
}

const fetchData = async () => {
    try {
        const query = localStorage.getItem('query') || store.city
        const response = await fetch(`${LINK}&query=${query}`)
        const data = await response.json()
        const {
            current: {
                cloudcover,
                feelslike,
                temperature,
                observation_time: observationTime,
                pressure,
                uv_index: uvIndex,
                visibility,
                is_day: isDay,
                weather_descriptions: description,
                wind_speed: windSpeed,
                humidity,
                weather_icons: weatherIcons

            },
            location: { name }
        } = data

        store = {
            ...store,
            city: name,
            feelslike,
            temperature,
            observationTime,
            isDay,
            description: description[0],
            weatherIcons: weatherIcons[0],
            properties: {
                cloudcover: {
                    title: 'cloudcover',
                    value: `${cloudcover}%`,
                    icon: 'cloud.png',
                },
                humidity: {
                    title: 'humidity',
                    value: `${humidity}%`,
                    icon: 'humidity.png',
                },
                pressure: {
                    title: 'pressure',
                    value: `${pressure} ad`,
                    icon: 'gauge.png',
                },
                uvIndex: {
                    title: 'uvIndex',
                    value: `${uvIndex} / 100`,
                    icon: 'uv-index.png',
                },
                visibility: {
                    title: 'visibility',
                    value: `${visibility}%`,
                    icon: 'visibility.png',
                },
                windSpeed: {
                    title: 'windSpeed',
                    value: `${windSpeed}km/h`,
                    icon: 'wind.png',
                },
            }
        }
        renderComponent(store)
    } catch {
        console.log('error');

    }
}

const renderComponent = (store) => {

    root.innerHTML = markup(store)
    const city = document.querySelector('#city')
    city.addEventListener('click', toggleActive)
}

const toggleActive = () => {
    popup.classList.toggle('active')
}

const handleInput = ({ target }) => {
    store = {
        ...store,
        city: target.value
    }
}
const handleSubmit = (e) => {
    e.preventDefault()
    const value = store.city
    if (!value) return null;
    localStorage.setItem('query', value)
    fetchData()
    toggleActive()
}
form.addEventListener('submit', handleSubmit)
textInput.addEventListener('input', handleInput)
close.addEventListener('click', toggleActive)



fetchData()


