# TCMB

Bu uygulamayı Türkiye Cumhuriyeti Merkez Bankası'nın sunmuş olduğu döviz kurlarını kullanarak, öntanımlı veya belirlenen 
dövizlerin banka satış birim fiyatını göstermek ve/veya bu bilgileri kullanarak TL'den diğer döviz cinslerine veya diğer döviz
cinslerinden TL'ye çeviri yapmak için geliştirdim.

Bu uygulamayı kendi geliştridiğim bir web uygulamasında kullanmam gerektiği için geliştirdim ve açık kaynak olarak paylaşmak istedim. :)

## Gereksinimler
- Jquery
- Sunucu tarafından çalışıp [http://www.tcmb.gov.tr/kurlar/today.xml] adresindeki veriyi alabileceğimiz bir dosya
  - Bu dosyanın gerekliliği farklı adreslere javascript ajax isteğinin modern taraycılar tarafından engellenmesinden kaynaklanmaktadır.
  
  
## Kullanım Örnekleri

### Döviz Kurlarını Göstermek 1 (Öntanımlı kurları göstermek)

Ön tanımlı olarak Dolar, Euro ve Sterlin gösterilecektir.
Kullanım için: [examples/exchange.html](https://github.com/aydinbulut07/TCMB/blob/master/examples/exchange.html) sayfasını görüntüleyebilirsiniz

```
<script src="js/jquery-3.2.1.min.js"></script>
<script src="../source/tcmb-currency.js"></script>
<script>
  /* 
  kurları merkez bankasından alıp xml tipinde döndürecek olan adresi ana fonksiyona gönderiyoruz belirlediğimiz 
  adres [http://www.tcmb.gov.tr/kurlar/today.xml] adresinden içeriği alıp tamamen olduğu gibi döndürmeli
  */
  load_tcmb_currencies('/examples/api/tcmb_currency.php');

  /*
  döviz kurlarını hangi elemanın içinde göstermek istiyorsak "load_exchange_table" fonksiyonuna seçicimizi 
  göndererek işlemimizi tamamlıyoruz
  */
  load_exchange_table('#exchange');
</script>
```

### Döviz Kurlarını Göstermek 2 (Belirlenen döviz kurlarını göstermek)

Burada Dolar, Euro ve Sterlin'e ek olarak Avusturalya Doları'nı da göstermek istiyorum.
Kullanım için: [examples/exchange-and-converter.html](https://github.com/aydinbulut07/TCMB/blob/master/examples/exchange-and-converter.html) sayfasını görüntüleyebilirsiniz

```
<script src="js/jquery-3.2.1.min.js"></script>
<script src="../source/tcmb-currency.js"></script>
<script>
  /* 
  kurları merkez bankasından alıp xml tipinde döndürecek olan adresi ana fonksiyona gönderiyoruz belirlediğimiz 
  adres [http://www.tcmb.gov.tr/kurlar/today.xml] adresinden içeriği alıp tamamen olduğu gibi döndürmeli
  */
  load_tcmb_currencies('/examples/api/tcmb_currency.php');
  
  /*
  Avusturalya Doları öntanımlı olarak gösterilmediği için döviz listesini aşağıda gösterildiği formatta
  hazırlamamız gerekiyor
  */
  var currencies = {'USD':'$','EUR':'€','GBP':'£','AUD':'$'};

  /*
  döviz kurlarını hangi elemanın içinde göstermek istiyorsak ilgili seçicimizi ve göstermek istediğimiz
  döviz cinslerini "load_exchange_table" fonksiyonuna göndererek işlemimizi tamamlıyoruz
  */
  load_exchange_table('#exchange',currencies);
</script>
```

### Döviz Çevirici Eklemek 1 (Öntanımlı kurları çevirmek)

Ön tanımlı olarak Dolar, Euro ve Sterlin çevirilecektir.
Kullanım için: [examples/converter.html](https://github.com/aydinbulut07/TCMB/blob/master/examples/converter.html) sayfasını görüntüleyebilirsiniz

```
<script src="js/jquery-3.2.1.min.js"></script>
<script src="../source/tcmb-currency.js"></script>
<script>
  /* 
  kurları merkez bankasından alıp xml tipinde döndürecek olan adresi ana fonksiyona gönderiyoruz belirlediğimiz 
  adres [http://www.tcmb.gov.tr/kurlar/today.xml] adresinden içeriği alıp tamamen olduğu gibi döndürmeli
  */
  load_tcmb_currencies('/examples/api/tcmb_currency.php');

  /*
  döviz çevirici formu hangi elemanın içinde göstermek istiyorsak load_converter_form fonksiyonuna seçiciyi
  göndererek işlemi tamamlamış oluyoruz
  */
  load_converter_form('#exchange');
</script>
```

### Döviz Çevirici Eklemek 2 (İstenilen kurları göstermek)

Burada Dolar, Euro ve Sterlin'e ek olarak Avusturalya Doları'nı da çevirmek istiyorum.
Kullanım için: [examples/exchange-and-converter.html](https://github.com/aydinbulut07/TCMB/blob/master/examples/exchange-and-converter.html) sayfasını görüntüleyebilirsiniz

```
<script src="js/jquery-3.2.1.min.js"></script>
<script src="../source/tcmb-currency.js"></script>
<script>
  /* 
  kurları merkez bankasından alıp xml tipinde döndürecek olan adresi ana fonksiyona gönderiyoruz belirlediğimiz 
  adres [http://www.tcmb.gov.tr/kurlar/today.xml] adresinden içeriği alıp tamamen olduğu gibi döndürmeli
  */
  load_tcmb_currencies('/examples/api/tcmb_currency.php');
  
  /*
  Avusturalya Doları öntanımlı olarak çevrilmediği için döviz listesini aşağıda gösterildiği formatta
  hazırlamamız gerekiyor
  */
  var currencies = ['USD','EUR','GBP','AUD'];

  /*
  döviz çevirici formu hangi elemanın içinde göstermek istiyorsak ilgili seçiciyi ve çevirmek istediğimiz 
  döviz cinslerini load_converter_form fonksiyonuna göndererek işlemi tamamlamış oluyoruz
  */
  load_converter_form('#exchange',currencies);
</script>
```


## TCMB'den kurları almak

Bu işlem için kendi sunucumuzda kullandığımız programlama dili ile bu işlemi yapacak basit bir uygulama 
hazırlamamamız gerekiyor, ben şuan PHP geliştirdiğim için PHP ve kullandığım LARAVEL frameworkünden dolayı
LARAVEL için örnekler göstereceğim.

### PHP

```
<?php
header('Content-type: application/xml');
echo file_get_contents('http://www.tcmb.gov.tr/kurlar/today.xml');
```
bur örnek için [tcmb_currency.php](https://github.com/aydinbulut07/TCMB/blob/master/examples/api/tcmb_currency.php) dosyasını görüntüleyebilirsiniz.

### PHP LARAVEL FRAMEWROK

Laravel 5.4 içindir bu anlatım.

Bu işlem için routing dosyalarından routes/api.php dosyasını kullanarak aşağıdaki tanımlamayı kullanmamız yeterlidir.
```
Route::get('exchange', function () {
    header('Content-type: application/xml');
    echo file_get_contents('http://www.tcmb.gov.tr/kurlar/today.xml');
});

// bu uygulamaya erişmek için /api/exchange adresine ajax isteği göndermemiz yeterlidir. 
```
