/**
 * This function loads currencies to localstorage and fires an event to its listeners to inform them that currencis are
 * available
 *
 *
 * This function requires an address on our server
 * that fetches xml data from http://www.tcmb.gov.tr/kurlar/today.xml
 *
 * @param api_address
 *
 *
 * @return false|void
 */
function load_tcmb_currencies(api_address) {

    $.ajax({
        type: 'get',
        url: api_address,
        dataType: 'text',
        success: function (data, textStatus, jqXHR) {

            // Sorry! No Web Storage support..
            if (typeof (Storage) === "undefined") {
                console.log("Your browser doesn't support localstorage feature");
                return false;
            }

            // save result to localstorage
            localStorage.setItem('tcmb_currency', data);

            // fire event to inform listeners that currencies are loaded
            $(document).trigger('tcmb_loaded');

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('An error occured. Error: ' + errorThrown);
        }
    });
}

/**
 * This function writes currency table to given element by its identifier
 *
 *
 * @param container is must be a selector that you want to load the template in it
 *
 * @param curriencies is must be an object that contains currencies you wan to show up that associated with its title and symbole
 * example:
 * {
 *     'USD': '$',
 *     'EUR': '€',
 *     'GBP': '£'
 * }
 *
 * @param template you should send your template if default one is not satisfy your expactions and you can use keys showed below
 * the keys you use are: {title}, {symbole}(associated with its key), {selling}, {buying}
 */
function load_exchange_table(container, curriencies, template) {
    const $container = $(container);

    // set default currencies if not specified
    if (typeof curriencies === 'undefined')
        curriencies = {
            'USD': '$',
            'EUR': '€',
            'GBP': '£'
        };

    // set default template if not specified
    if (typeof template === 'undefined')
        template = '\
            <div class="row">\
            <div class="col-xs-5">{title}</div>\
            <div class="col-xs-1">{symbole}</div>\
            <div class="col-xs-3">{selling}</div>\
            <div class="col-xs-3">{buying}</div>\
            </div>\
        ';


    // listen for event that stores currencies to localstorage
    $(document).on('tcmb_loaded', function () {
        var tcmb, currency, code, opt, title, symbole, tmp;

        // create documentElement to load currencies into
        tcmb = localStorage.getItem('tcmb_currency');

        // first clean inner html
        $container.html('');

        // loop over asked curriencies
        Object.entries(curriencies).forEach(function (elm) {
            code = elm[0];
            symbole = elm[1];

            // fetch current currency from data
            currency = $(tcmb).find('Currency[CurrencyCode="' + code + '"]');

            // replace values with their placeholders
            tmp = template;
            tmp = tmp.replace("{title}", $(currency).find('Isim').text());
            tmp = tmp.replace('{symbole}', symbole);
            tmp = tmp.replace('{selling}', $(currency).find('banknoteselling').text());
            tmp = tmp.replace('{buying}', $(currency).find('banknotebuying').text());

            // append new template
            $container.append(tmp);
        });
    });

}

/**
 * This function loads currency exchanger into given element by its identifier
 *
 *
 * @param container is must be a selector that you want to load the template in it
 *
 * @param currencies is must be array of currencies list other than TRY that you want to use in converter
 *
 * @param template
 * the only key you can use is: {convertingOptions} for selectbox options to be replaced
 *
 * @param selectBoxName
 */
function load_converter_form(container, currencies, template, selectBoxName) {
    const $container = $(container);

    // set default currencies if not specified
    if (typeof currencies === 'undefined')
        currencies = ['USD', 'EUR', 'GBP'];

    // prepare conversion lookup table
    var convertingOptions = [];
    currencies.forEach(function (item) {
        convertingOptions.push([item, 'TRY']);
        convertingOptions.push(['TRY', item]);
    });

    // set default selectbox name if not specified
    if (typeof template === 'undefined')
        selectBoxName = 'conver_type';

    // set default template if not specified
    if (typeof template === 'undefined')
        template = '\
            <form id="tcmb_currency_converter" name="tcmb_currency_converter">\
                <div class="form-group">\
                    <label for="' + selectBoxName + '">Çeviri</label>\
                    <select name="' + selectBoxName + '" id="' + selectBoxName + '" class="form-control">\
                        <option value="">Seçim yapınız</option>\
                        {convertingOptions}\
                    </select>\
                </div>\
                <div class="form-group">\
                    <label for="money_amount">Miktar</label>\
                    <input type="number" name="money_amount" id="money_amount" class="form-control" min="0" step="100">\
                </div>\
                <div class="form-group">\
                    <label for="total">Toplam</label>\
                    <input type="text" name="total" id="total" class="form-control" readonly>\
                </div>\
            </form>\
        ';

    // listen for event that stores currencies to localstorage
    $(document).on('tcmb_loaded', function () {
        var tcmb, from, to, options;

        // create documentElement to load currencies into
        tcmb = localStorage.getItem('tcmb_currency');

        // loop over asked curriencies
        convertingOptions.forEach(function (elm) {
            from = elm[0] === 'TRY' ? 'TÜRK LİRASI' : $(tcmb).find('Currency[CurrencyCode="' + elm[0] + '"] Isim').text();
            to = elm[1] === 'TRY' ? 'TÜRK LİRASI' : $(tcmb).find('Currency[CurrencyCode="' + elm[1] + '"] Isim').text();

            // replace values with their placeholders
            options += '<option value="' + elm.join('-') + '">' + from + ' - ' + to + '</option>';

        });

        // replace values with their placeholders
        template = template.replace('{convertingOptions}', options);

        // place new template
        $container.html(template);
    });

    // listen for select box change
    $(document).on('change', 'select[name="' + selectBoxName + '"]', function (e) {
        convert_currencies(container, selectBoxName);
    });

    // listen for money amount change
    $(document).on('keyup change', 'input[name="money_amount"]', function (e) {
        convert_currencies(container, selectBoxName);
    });

}

/**
 * This function listens to converter form changes and prints out conversion result
 * And this function is being called automacilally on each change event on conversion type or money amount
 *
 *
 * @param container container element that contains the form
 * @param selectBoxName
 * @returns {boolean}
 */
function convert_currencies(container, selectBoxName) {
    const $container = $(container);
    const convert_type = $('select[name="' + selectBoxName + '"]').find('option:selected').val();
    const money_amount = parseFloat($('input[name="money_amount"]').val());
    const tcmb = localStorage.getItem('tcmb_currency');

    // reset form if requirements failed
    if (convert_type === '' || isNaN(money_amount)) {
        $(container).find('input[name="total"]').val('');
        return false;
    }

    // get asked conversion
    const currencies = convert_type.split('-');
    const from = currencies[0];
    const to = currencies[1];
    const foreing = from !== 'TRY' ? from : to;
    const banknoteselling = parseFloat($(tcmb).find('Currency[CurrencyCode="' + foreing + '"] banknoteselling').text());

    // get calculation
    var total = from === 'TRY' ? money_amount / banknoteselling : money_amount * banknoteselling;
    total = Math.round(total * 100) / 100;

    $(container).find('input[name="total"]').val(total + ' ' + to);
}
