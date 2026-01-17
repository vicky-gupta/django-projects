import datetime
from django.shortcuts import render, HttpResponse
from django.contrib import messages
import os, requests
from dotenv import load_dotenv
load_dotenv()
# Create your views here.

API_KEY = os.environ.get("WEATHER_API")
GOOGLE_API = os.environ.get("GOOGLE_API")
SEARCH_ID = os.environ.get("SEARCH_ID")

def home(request):
    if 'city' in request.POST:
        city = request.POST['city']
    else:
        city = 'indore'
    url = f'https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}'
    PARAM = {'units':'metric'}

    query = city + "1920x1080"
    page = 1
    start = (page-1)*10 +1 
    searchType = 'image'
    city_url = f'https://www.googleapis.com/customsearch/v1?q={query}&cx={SEARCH_ID}&searchType={searchType}&num=10&start={start}&key={GOOGLE_API}&imgSize=xlarge'
    data = requests.get(city_url).json()
    print(data)
    count = 1
    search_items = data.get('items')
    print("**************************************************")
    print(search_items)
    print("**************************************************")
    image_url = search_items[1]['link']

    try:
        data = requests.get(url,PARAM).json()
        description = data['weather'][0]['description']
        icon = data['weather'][0]['icon']
        temp = data['main']['temp']
        day = datetime.date.today()
        return render(request, 'index.html',{'description':description, 'icon': icon, 'temp': temp, 'day': day, 'city': city, 'exception_occured': False, 'image_url': image_url} )  # Renders the home.html template
    except:
        exception_occured = True
        messages.error(request,'Entered data is not available to API')
        day = datetime.date.today()
        return render(request, 'index.html',{'description':'clear sky', 'icon': '01d', 'temp': 25, 'day': day, 'city': 'indore', 'exception_occured': True} )  # Renders the home.html template
    
