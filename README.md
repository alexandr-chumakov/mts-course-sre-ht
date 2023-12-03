### Подготовительные работы

#### Установка инструмента НТ

В качестве инструмента НТ будем использовать k6.
Установим, следуя официальной документации

https://k6.io/docs/get-started/installation/

На выбранной VM, с которой будет НТ, в качестве ОС установлена Ubuntu, поэтому

```console
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```
Результаты нагрузочного тестирования хочется также отображать в нашей "коммунальной" Графане для курса по SRE.
В k6 опция output по умолчанию использует time-series базу данных Influxdb, установим её

```console
wget -q https://repos.influxdata.com/influxdata-archive_compat.key
echo '393e8779c89ac8d958f81f942f9ad7fb82a25e133faddaf92e15b16e6ac9ce4c influxdata-archive_compat.key' | sha256sum -c && cat influxdata-archive_compat.key | gpg --dearmor | sudo tee /etc/apt/trusted.gpg.d/influxdata-archive_compat.gpg > /dev/null
echo 'deb [signed-by=/etc/apt/trusted.gpg.d/influxdata-archive_compat.gpg] https://repos.influxdata.com/debian stable main' | sudo tee /etc/apt/sources.list.d/influxdata.list

sudo apt-get update && sudo apt-get install influxdb2
```

Однако, мы поставили InfluxDB v2.7.4, когда как k6 из под коробки работает с первой мажорной версией InfluxDB.
Выберем путь установки доп. расширения для k6 для работы с InfluxDB v2 вместо откатки до первой версии.
Сначала ставим утилиту xk6, которая затем позволит установить само расширение

https://github.com/grafana/xk6#install

Репозиторий с расширением и документация по установке

https://github.com/grafana/xk6-output-influxdb


Для второй версии InfluxDB необходимо завести организацию и бакет. Проще всего это сделать через её веб-интерфейс, перейдя в браузере по адресу

[http://{VM_IP_ADDRESS}:8086]()


Среди готовых дашбордов для k6 с источником данных из InfluxDB v2 на сайте графаны есть 

https://grafana.com/grafana/dashboards/19431-my-k6-dashboard2/

Создаем дашборд, импортируя его ID (19431).
Заголовки частично на корейском языке, редактируем, переводя в переводчике.


```console
K6_INFLUXDB_ORGANIZATION=<insert-here-org-name> \
K6_INFLUXDB_BUCKET=<insert-here-bucket-name> \
K6_INFLUXDB_TOKEN=<insert-here-valid-token> \
./k6 run -o xk6-influxdb=http://localhost:8086 scripts/script.js
```

Файл `scripts/script.js` содержит базовый "Hello World" для k6, но его достаточно, 
чтобы увидеть первые данные в нашей графане.


#### Подготовка данных

Сделать выгрузку городов возможно проще сделать через psql или pgadmin, 
но для практики работы с k6 создадим отдельный k6-скрипт, 
который добавит все населенные пункты `data/geo_names_list.txt` через API приложения.



В `config.yaml` пропишем hostname

https://github.com/szkiba/xk6-yaml

```console
xk6 build --with github.com/szkiba/xk6-yaml@latest
```

Теперь всё готово для нагрузочного тестирования нашего стенда.
