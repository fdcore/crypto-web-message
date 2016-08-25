<?php
ini_set('display_errors', true);

// Include files

include 'lib/sparrow.php';
include 'lib/Tiny.php';
include 'config.php';

// Connect to db

$db = new Sparrow();
$db->setDb($config['db']);
$db->sql('SET NAMES utf8')->execute();

// Encode ident
$tiny = new Tiny($config['tiny_secret']);

// GC
$db->from('content')->where(array('expired <' => time()))->delete()->execute();

// Get content
if(isset($_GET['id'])){
  $id = $tiny->from($_GET['id']);

  if($id > 0){
    $data = $db->from('content')->where(array('id' => $id))->one();
    if($data){
      echo gzuncompress($data['content']);
      exit();
    }
  }

  echo 'error';
  exit();
}


// Save content
if (isset($_POST['content'], $_POST['expired'])) {
  $expired = $_POST['expired'];
  $date = strtotime('+1 week');

  if($expired == '1h') $date = strtotime('+1 hour');
  if($expired == '5h') $date = strtotime('+5 hour');
  if($expired == '1d') $date = strtotime('+1 day');
  if($expired == '1w') $date = strtotime('+1 week');
  if($expired == '1m') $date = strtotime('+1 month');

  if(strlen($_POST['content']) > 1){

    $compressed = gzcompress($_POST['content'], 9);

    $db->from('content')->insert(array('content' => $compressed, 'expired' => $date, 'date_created' => time()))->execute();

    echo $tiny->to($db->insert_id);
  }

  exit();
}

// DELETE CONTENT
if(isset($_POST['touch'])){
  $id = $tiny->from($_POST['touch']);

  if($id > 0){
    $data = $db->from('content')->where(array('id' => $id))->delete()->execute();
    if($data){
      echo 'ok';
    }
  }

  exit();
}

?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Шифрованное послание</title>
    <link rel="stylesheet" href="static/style.css" charset="utf-8">
    <style media="screen">
      [v-cloak] { display: none; }
      html, body, #app { height: 100%; }
    </style>
  </head>

  <body>

    <div class="container" id="app" @mousemove="gen_pw">
      <div class="row" style="margin-top: 50px;" v-cloak>
        <div class="col-md-12">

          <div class="jumbotron" v-show="help">
            <h1>Для чего этот сервис?</h1>
            <p>Если вы хотите передать приватно сообщение или ссылку, и не хотите чтобы кто то об этом знал, данный сервис вам поможет.</p>
            <p>
              Данные криптуются на клиенте (в вашем браузере) и передаётся на сервер только зашифрованный контент без пароля. Пароль остаётся только у вас.
            </p>
            <p>
              При открытии ссылки с паролем, данные расшифровываются на клиенте и уничтожаются на сервере.
            </p>
            <p>
              Если никто ссылку не открывал то данные уничтожатся автоматический по исчечению указанного срока.
            </p>
            <p class="text-center"><a class="btn btn-primary btn-lg" href="javascript:;" @click="help=!help" role="button">Понятно</a></p>
          </div>
        </div>

        <div class="col-md-6 col-md-offset-3">

          <div class="panel panel-warning" v-show="mode == 'load'">
            <div class="panel-heading">Шифрованная передача</div>

            <div class="panel-body">

              <div class="form-group" v-if="!valid">
                <label for="url">Пароль для расшифровки</label>
                <input type="text" class="form-control" v-model="password">
              </div>

              <p v-if="content_type == 'text'">
                <textarea style="width: 100%" class="form-control" v-if="result_text != ''" rows="8" cols="40">{{ result_text }}</textarea>
              </p>
              <p v-if="content_type == 'image'" class="text-center">
                <a :href="result_text"><img :src="result_text" alt="image" class="img-thumbnail" /></a>
              </p>

              <p v-if="result_url != ''">Переадресация на <a :href="result_url" v-text="result_url" class="btn btn-link"></a></p>

              <div class="alert alert-danger" v-if="valid">Данная запись уничтожена!</div>

              <button class="btn btn-success btn-block btn-lg" v-if="!valid" @click="get_content">Расшифровать</button>

                <button type="button" class="btn btn-block btn-info" v-if="valid" @click="new">Создать новую запись</button>

              <div class="progress" v-if="progress > 0 && progress < 100">
                <div class="progress-bar" role="progressbar" aria-valuenow="{{ progress }}" aria-valuemin="0" aria-valuemax="100" style="width: {{ progress }}%;">
                  <span class="sr-only">{{ progress }}% Complete</span>
                </div>
              </div>

              </div>
            </div>

          <div class="panel panel-success" v-show="mode == 'created'">
            <div class="panel-heading">Контент зашифрован</div>

            <div class="panel-body">

              <div class="form-group">
                <label for="output">Ссылка c паролем</label>
                <input type="text" id="output" class="form-control" onclick="this.select()" v-model="output">
              </div>

              <div class="form-group">
                <label for="output_witout_pw">Ссылка без пароля</label>
                <input type="text" id="output_witout_pw" class="form-control" onclick="this.select()" v-model="output_witout_pw">
              </div>
              <div class="form-group">
                <label for="pw">Пароль</label>
                <input type="text" id="pw" class="form-control" v-model="password" onclick="this.select()">
              </div>

              <button type="button" class="btn btn-block btn-info" @click="new">Создать новую запись</button>
            </div>
          </div>


          <div class="text-right" v-show="result_text == '' && mode == 'create' && !help">
            <p>
              <a class="btn btn-default btn-lg" href="javascript:;" @click="help=!help"role="button">О сервисе</a>
            </p>
          </div>

          <div class="panel panel-primary" v-show="result_text == '' && mode == 'create'">
            <div class="panel-heading">Шифрованная передача</div>

            <div class="panel-body">

              <ul class="nav nav-tabs nav-justified">
                <li role="presentation" :class="{active: content_type == 'url'}"><a href="#" @click="content_type = 'url', url = ''">Ссылка</a></li>
                <li role="presentation" :class="{active: content_type == 'text'}"><a href="#"  @click="content_type = 'text', url = ''">Текст</a></li>
                <li role="presentation" :class="{active: content_type == 'file'}"><a href="#"  @click="content_type = 'file', url = ''">Файл</a></li>
              </ul>

              <div class="form-group">
                <input type="text" v-show="content_type == 'url'" class="form-control" placeholder="https://..." v-model="url">
                <textarea style="width: 100%" v-show="content_type == 'text'" placeholder="Введите текст" class="form-control" rows="8" cols="40" v-model="url"></textarea>
                <p>
                  <input type="file" v-show="content_type == 'file'" class="form-control" onchange="previewFile()" accept="image/jpeg,image/png,image/gif" id="file">
                </p>
              </div>

              <div class="form-group">
                <label for="url">Пароль для расшифровки</label>
                <input type="text" class="form-control" :disabled="!custom_password" maxlength="64" onclick="this.select()" v-model="password">
                <p>
                  <label for="custom_password">
                    <input type="checkbox"  id="custom_password" v-model="custom_password" value="y"> Свой пароль
                  </label>
                </p>
              </div>
              <div class="form-group">
                <label for="touch">Созданная запись автоматический удалится через</label> <a href="javascript:;" @click="expired_list=!expired_list" v-text="expired|expire_time"></a>
                <div class="list-group" v-show="expired_list">
                  <a class="list-group-item" :class="{active: expired == '1h'}" href="javascript:;" @click="expired='1h'">1 час</a>
                  <a class="list-group-item" :class="{active: expired == '5h'}" href="javascript:;" @click="expired='5h'">5 часов</a>
                  <a class="list-group-item" :class="{active: expired == '1d'}" href="javascript:;" @click="expired='1d'">1 день</a>
                  <a class="list-group-item" :class="{active: expired == '1w'}" href="javascript:;" @click="expired='1w'">1 неделя</a>
                  <a class="list-group-item" :class="{active: expired == '1m'}" href="javascript:;" @click="expired='1m'">1 месяц</a>
                </div>
              </div>

              <button class="btn btn-success btn-block btn-lg" :class="{disabled: url.length < 3 || password.length < 3}" @click="result">Создать запись</button>

              <div class="progress" v-if="progress > 0 && progress < 100">
                <div class="progress-bar" role="progressbar" aria-valuenow="{{ progress }}" aria-valuemin="0" aria-valuemax="100" style="width: {{ progress }}%;">
                  <span class="sr-only">{{ progress }}% Complete</span>
                </div>
              </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- привет человек который читает исходники :) -->
    <script src="static/vue.min.js"></script>
    <script src="static/routie.min.js"></script>
    <script src="static/reqwest.js"></script>
    <script src="static/sha1.js"></script>
    <script src="static/pbkdf2.js"></script>
    <script src="static/aes.js"></script>
    <script src="static/app.js"></script>
  </body>
</html>
