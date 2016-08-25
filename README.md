# Скрипт веб сервиса для хранения шифрованных сообщений или файлов

Скрипт шифрует контент на уровне клиента без передачи ключа на сервера. Расшифровка также происходит в браузере без использования сервера. После прочтений даные уничтожаются.

Подробнее у меня в блоге <http://nyashk.in/blog/servis-po-peredachi-sekretnyh-poslanij>

## Установка

1. Залейте на сервер
2. Создайте бд для данных
3. Выполните запросы из **install.sql**
4. Измените config.php (сгенерируйте tiny secret используя gen_secret.php)
5. Измените в app.js переменную **SALT**

## Используется

- https://github.com/ded/reqwest Для ajax запросов
- https://github.com/mikecao/sparrow Для работы с базой
- https://github.com/zackkitzmiller/tiny-php Для шифрования id ключей
- http://vuejs.org Для реактивного интерфейса
- https://github.com/ricmoo/aes-js Шифрование в AES
