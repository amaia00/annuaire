/**
 * Created by amaia.nazabal on 1/16/17.
 */
var Annuaire = {
    /**
     *
     */
    getAll: function () {
      jQuery.ajax({
          url: '/all',
          method: 'GET'
          /*,
          statusCode: {
            404: function() {
             alert( "page not found" );
            }
          }
          */
      }).done(function(data){
          var list = JSON.parse(data);

          $('#pairs').html('');
          list.forEach(function (key) {

              jQuery("#pairs").append('<div id=' + key.nom + ' >' + key.nom + ' : ' + key.url +
                  ' <a href="#" key="' + key.nom + '" class="pairRemove">(remove)</a></div>');
          });

          jQuery(".pairRemove").click(Annuaire.delete);

      }).fail(function (error) {
          console.log(error);
      });
    },
    /**
     *
     * @param key
     * @param value
     */
    bind: function (key, value) {
        var params = {};
        params['url'] = value;
        params['nom'] = key;

        jQuery.ajax({
            url: '/',
            method: 'POST',
            data: params
            /*,
             statusCode: {
             404: function() {
             alert( "page not found" );
             }
             }
             */
        }).done(function(data){
            //var link = JSON.parse(data);
            //jQuery("#pairs").append('<div id=' + link.nom + ' >' + link.nom + ' : ' + link.url + ' <a href="#" key="' + link.nom + '" class="pairRemove">(remove)</a></div>');
            Annuaire.getAll();
        }).fail(function (error) {
            console.log(error);
        });
    },

    /**
     *
     * @param key
     */
    delete: function () {
        var key = event.target.attributes.getNamedItem("key").value;

        jQuery.ajax({
            url: '/' + key,
            method: 'DELETE'
            /*,
             statusCode: {
             404: function() {
             alert( "page not found" );
             }
             }
             */
        }).done(function(data){
            //console.log(data);
            jQuery("#" + key).remove();
        }).fail(function (error) {
            console.log(error);
        });
    },

    /**
     *
     * @param key
     */
    get: function (key) {i
        jQuery.ajax({
            url: '/get/' + key,
            method: 'GET'
            /*,
             statusCode: {
             404: function() {
             alert( "page not found" );
             }
             }
             */
        }).done(function(data){
            console.log(data);
        }).fail(function (error) {
            console.log(error);
        });
    }
};