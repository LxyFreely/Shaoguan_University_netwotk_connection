import requests

url = "http://2.2.2.2"
res = requests.get(url)
print(res.url)